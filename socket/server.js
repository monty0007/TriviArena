const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')

const app = express()

app.use(cors())

const server = http.createServer(app)

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
})

const rooms = {}
const activeRoomCodes = new Set()

// Constants for Game State
const GAME_STATES = {
  LOBBY: 'LOBBY',
  QUESTION_ACTIVE: 'QUESTION_ACTIVE',
  WAITING_FOR_NEXT: 'WAITING_FOR_NEXT',
  GAME_OVER: 'GAME_OVER'
};

function generateUniqueSixDigitPin() {
  let pin
  do {
    pin = Math.floor(100000 + Math.random() * 900000).toString()
  } while (activeRoomCodes.has(pin))
  return pin
}

function showLeaderboard(room) {
  if (!rooms[room]) return;

  const sortedPlayers = rooms[room].players
    .filter((player) => player.name !== 'Host') // Exclude host
    .sort((a, b) => b.score - a.score);

  const topPlayers = sortedPlayers.map((player, index) => ({
    name: player.name,
    score: player.score,
    position: index + 1,
  }));

  rooms[room].gameState = GAME_STATES.GAME_OVER;

  // Prepare full Question & Correct Answer list for Review
  // We should only send the necessary data, not entire server objects if they have sensitive info (but here it's fine)
  const history = rooms[room].questions.map(q => ({
    question: q.question,
    options: q.answerList, // contains isCorrect
    // Add any other necessary fields
  }));

  io.to(room).emit('gameOver', {
    winner: topPlayers[0]?.name || 'No one',
    topPlayers,
    history // Send full history
  });

  // Clean up eventually
  setTimeout(() => {
    if (rooms[room]) {
      delete rooms[room];
      activeRoomCodes.delete(room);
    }
  }, 3600000); // 1 hour cleanup
}

function askNewQuestion(room) {
  const roomData = rooms[room];
  if (!roomData) {
    console.error(`askNewQuestion: Room ${room} not found.`);
    return;
  }

  const questions = roomData.questions;
  const currentQuestionIndex = roomData.currentQuestionIndex || 0;

  console.log(`[Room ${room}] asking question index: ${currentQuestionIndex}, total: ${questions?.length}`);

  if (!questions || questions.length === 0) {
    console.error(`[Room ${room}] No questions found!`);
    return;
  }

  // Check if game over
  if (currentQuestionIndex >= questions.length) {
    showLeaderboard(room);
    return;
  }

  const ques = questions[currentQuestionIndex];

  if (!ques) {
    console.error(`[Room ${room}] Question at index ${currentQuestionIndex} is undefined.`);
    return;
  }

  roomData.currentQuestion = ques;
  roomData.currentQuestionIndex = currentQuestionIndex + 1;
  roomData.gameState = GAME_STATES.QUESTION_ACTIVE;
  roomData.currentAnswerCount = 0; // Reset answer count

  const timer = getTimer(room);

  // Payload for clients
  console.log(`[Room ${room}] Preparing payload for question ID: ${ques._id || 'unknown'}`);
  const questionPayload = {
    question: ques.question,
    questionIndex: ques.questionIndex,
    answers: ques.answerList?.map((answer) => answer.body || answer.name || answer), // Fallback if body is missing
    timer: timer,
    totalQuestions: questions.length,
    currentQuestionNum: currentQuestionIndex + 1
  };

  console.log(`[Room ${room}] Emitting newQuestion payload:`, JSON.stringify(questionPayload, null, 2));

  io.to(room).emit('newQuestion', questionPayload);

  // Start Timer on Server
  // Clear any existing timer first
  if (roomData.questionTimeout) clearTimeout(roomData.questionTimeout);

  // Add 1s grace period for client sync/animations (reduced from 2.5s to enable snappier transitions)
  const gracePeriod = 1000;
  roomData.questionTimeout = setTimeout(() => {
    handleQuestionEnd(room);
  }, (timer * 1000) + gracePeriod);
}

function handleQuestionEnd(room) {
  const roomData = rooms[room];
  if (!roomData) return;

  roomData.gameState = GAME_STATES.WAITING_FOR_NEXT;

  // Check if this was the last question
  const isLastQuestion = roomData.currentQuestionIndex >= roomData.questions.length;

  // Auto Advance Logic
  if (!roomData.isManualControl && !isLastQuestion) {
    const breakTime = getBreakTime(room);

    // Notify clients about auto-advance
    io.to(room).emit('questionEnded', {
      isLastQuestion,
      autoAdvance: true,
      nextQuestionDelay: breakTime
    });

    roomData.questionTimeout = setTimeout(() => {
      askNewQuestion(room);
    }, breakTime);
  } else {
    // Manual Mode OR Last Question: Do nothing, wait for 'nextQuestion' event or 'leaderboard'
    io.to(room).emit('questionEnded', { isLastQuestion, autoAdvance: false });
    console.log(`Room ${room}: Waiting for host (Manual Mode or Last Question)`);
  }
}

const getTimer = (room) => {
  const config = rooms[room]?.quizConfig;
  if (config?.gameMode === 'RapidFire') return 5;
  return parseInt(config?.answerTime) || 10;
};

const getBreakTime = (room) => {
  const config = rooms[room]?.quizConfig;
  if (config?.gameMode === 'RapidFire') return 2000;
  return 4000; // 4 seconds break (allows for 3s countdown + 1s buffer)
};

io.on('connection', (socket) => {

  socket.on('joinRoom', ({ room, name, questions, quizConfig }, callback) => {

    console.log(`[joinRoom] Request: room=${room}, name=${name}, hasQuestions=${!!questions}`);

    // 1. Create Room if it doesn't exist AND it's a Host joining (with questions or explicit intent)
    if (!rooms[room] && (questions || name === 'Host')) {
      console.log(`[joinRoom] Creating new room: ${room}`);
      if (!room) room = generateUniqueSixDigitPin(); // Generate if not provided

      rooms[room] = {
        gameState: GAME_STATES.LOBBY,
        players: [],
        currentQuestionIndex: 0,
        currentQuestion: null,
        isManualControl: true, // Default to manual now as requested
        admin: { socketId: socket.id, name },
        questions,
        quizConfig: quizConfig || { answerTime: 10, gameMode: 'Standard' },
      };
      activeRoomCodes.add(room);
    }

    const roomData = rooms[room];

    // 2. Validate Room Exists or Handling Host Reconnect
    if (!roomData) {
      console.error(`[joinRoom] Room ${room} not found and creation failed/skipped.`);
      if (typeof callback === 'function') {
        callback({ error: 'Room not found' });
      }
      return;
    }

    // 2b. Reclaim Admin Rights if Host Reconnects
    if (name === 'Host') {
      // Update the admin socket ID to the new connection
      roomData.admin.socketId = socket.id;
      // Optionally update questions if they were lost? 
      // For now, assume server state is source of truth, but we could sync if needed.
    }

    // 3. Join Logic
    socket.join(room);

    const existingPlayer = roomData.players.find(p => p.socketId === socket.id);
    const isAdmin = roomData.admin.socketId === socket.id;

    if (!existingPlayer && !isAdmin) {
      roomData.players.push({ socketId: socket.id, name, score: 0 });
      socket.broadcast.to(room).emit('userJoined', { users: roomData.players });
    }

    // 4. Send Initial Sync Data
    callback({
      users: roomData.players,
      room,
      isAdmin,
      gameState: roomData.gameState,
      // If game is active, send current question state effectively "reconnecting" the user
      currentQuestion: roomData.gameState === GAME_STATES.QUESTION_ACTIVE ? {
        question: roomData.currentQuestion?.question,
        answers: roomData.currentQuestion?.answerList?.map(a => a.body),
        // We don't send exact remaining time here for simplicity, but could calculate it
        timer: getTimer(room)
      } : null
    });
  });

  socket.on('startGame', ({ room, isManualControl }) => {
    const roomData = rooms[room];
    if (roomData && roomData.admin.socketId === socket.id) {
      roomData.isManualControl = isManualControl;
      roomData.currentQuestionIndex = 0; // Reset

      io.to(room).emit('gameStarted');
      askNewQuestion(room);
    }
  });

  socket.on('nextQuestion', ({ room }) => {
    const roomData = rooms[room];
    if (roomData && roomData.admin.socketId === socket.id) {
      // Only allow if in WAITING state, or force it? 
      // Let's allow force next for flexibility
      if (roomData.questionTimeout) clearTimeout(roomData.questionTimeout);
      askNewQuestion(room);
    }
  });

  socket.on('submitAnswer', (room, name, answerIndex, callback) => {
    const roomData = rooms[room];
    if (!roomData || !roomData.currentQuestion) return;

    const currentQ = roomData.currentQuestion;
    const isCorrect = currentQ.answerList[answerIndex]?.isCorrect;

    // Track Answers
    roomData.currentAnswerCount = (roomData.currentAnswerCount || 0) + 1;
    io.to(room).emit('answerCountUpdate', { count: roomData.currentAnswerCount });

    // Calculate points
    let points = 0;
    if (isCorrect) points = 10; // Simple scoring for now

    // Update Player Score
    const player = roomData.players.find(p => p.socketId === socket.id);
    if (player) {
      player.score += points;
    }

    callback({
      isCorrect,
      points,
      correctIndex: currentQ.answerList.findIndex(a => a.isCorrect),
      scores: roomData.players // Return updated scores if needed
    });
  });

  socket.on('endGame', ({ room }, callback) => {
    const roomData = rooms[room];
    // Security check: Only host can end game
    if (roomData && roomData.admin.socketId === socket.id) {
      console.log(`[Room ${room}] Host ending game.`);

      // Notify all players
      io.to(room).emit('gameTerminated', { reason: 'Host ended the game' });

      // Clean up room immediately or on delay?
      // Let's keep it for a moment so clients receive the event, then delete.
      // Actually, if we delete immediately, subsequent calls might fail.
      // Let's set a state.
      roomData.gameState = GAME_STATES.GAME_OVER;

      // Optional: Clear any timers
      if (roomData.questionTimeout) clearTimeout(roomData.questionTimeout);

      // Clean up after short delay to allow message propagation
      setTimeout(() => {
        if (rooms[room]) {
          delete rooms[room];
          activeRoomCodes.delete(room);
        }
      }, 5000);

      if (callback) callback({ status: 'ok' });
    } else {
      if (callback) callback({ status: 'error', message: 'Unauthorized or room not found' });
    }
  });

  socket.on('disconnect', () => {
    // Cleanup player from rooms
    for (const room in rooms) {
      rooms[room].players = rooms[room].players.filter(p => p.socketId !== socket.id);
      io.to(room).emit('userJoined', { users: rooms[room].players });
    }
  });
});

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
})
