const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const GameManager = require('./GameManager')
const gameManager = new GameManager()

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
let joinedUsers = []
const activeRoomCodes = new Set()

function generateUniqueSixDigitPin() {
  let pin
  do {
    pin = Math.floor(100000 + Math.random() * 900000).toString()
  } while (activeRoomCodes.has(pin)) // Ensure the pin is unique
  return pin
}

function askNewQuestion(room) {
  // Check if the room exists
  if (!rooms[room]) {
    console.error(`Room ${room} does not exist`);
    return;
  }

  // Check if there are any players in the room
  if (rooms[room].players.length === 0) {
    clearTimeout(rooms[room].questionTimeout);
    delete rooms[room];
    activeRoomCodes.delete(room);
    return;
  }

  const questions = rooms[room].questions;
  const currentQuestionIndex = rooms[room].currentQuestionIndex || 0;

  // If we've asked all questions, end the game and show leaderboard
  if (currentQuestionIndex >= questions.length) {
    showLeaderboard(room);
    return;
  }

  const ques = questions[currentQuestionIndex];

  rooms[room].currentQuestionIndex = currentQuestionIndex + 1;
  console.log(rooms[room].currentQuestionIndex);

  return {
    question: ques.question,
    questionIndex: ques.questionIndex,
    answers: ques.answerList?.map((answer) => answer.body),
    timer: 10,
  };
}

function showLeaderboard(room) {
  const sortedPlayers = rooms[room].players
    .filter((player) => player.name !== 'Host') // Exclude host from ranking
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Get top 3 players

  const topPlayers = sortedPlayers.map((player, index) => ({
    name: player.name,
    score: player.score,
    position: index + 1,
  }));

  io.to(room).emit('gameOver', {
    winner: topPlayers[0]?.name || 'No one',
    topPlayers,
  });

  // Clean up the room
  delete rooms[room];
  activeRoomCodes.delete(room);
}

io.on('connection', (socket) => {
  // Helper to get config or defaults
  const getTimer = (room) => {
    const config = rooms[room]?.quizConfig;
    // If RapidFire, force 5s or use config
    if (config?.gameMode === 'RapidFire') return 5;
    return parseInt(config?.answerTime) || 10;
  };

  const getBreakTime = (room) => {
    const config = rooms[room]?.quizConfig;
    if (config?.gameMode === 'RapidFire') return 1000; // 1s break
    return 5000; // 5s break
  };

  socket.on('joinRoom', ({ room, name, questions, quizConfig }, callback) => {
    if (!room) {
      room = generateUniqueSixDigitPin()
      rooms[room] = {
        players: [],
        currentQuestion: null,
        correctAnswer: null,
        questionTimeout: null,
        shouldAskNewQuestion: true,
        admin: {
          socketId: socket.id,
          name,
        },
        questions,
        quizConfig: quizConfig || { answerTime: 10, gameMode: 'Standard' }, // Store config
        currentQuestionIndex: 0
      }
      activeRoomCodes.add(room)
    } else {
      // ... existing join logic for players ...
      if (!rooms[room]) {
        console.error(`Room ${room} does not exist.`)
        return
      }
      const existingPlayer = rooms[room].players.find(
        (player) => player.socketId === socket.id
      )
      if (existingPlayer) {
        callback({
          users: rooms[room].players.filter(
            (player) => player.socketId !== socket.id
          ),
          room,
          isAdmin: rooms[room].admin.socketId === socket.id,
        })
        return
      }
      rooms[room].players.push({ socketId: socket.id, name, score: 0 })
      socket.broadcast.to(room).emit('message', `${name} has joined the room`)
      socket.broadcast.to(room).emit('userJoined', {
        users: rooms[room].players,
      })
    }
    socket.join(room)
    callback({
      users: rooms[room].players.filter(
        (player) => player.socketId !== socket.id
      ),
      room,
      isAdmin: rooms[room].admin.socketId === socket.id,
    })
  })

  // ... (submitAnswer handler unchanged) ...

  socket.on('startGame', ({ room, isManualControl }) => {
    if (!rooms[room]) return;

    // Set Manual Mode flag
    rooms[room].isManualControl = isManualControl;

    const StartAskingQuestion = () => {
      // Logic for asking new question
      if (!rooms[room]) return;

      const questions = rooms[room].questions;
      const currentQuestionIndex = rooms[room].currentQuestionIndex || 0;

      if (currentQuestionIndex >= questions.length) {
        showLeaderboard(room);
        return;
      }

      const ques = questions[currentQuestionIndex];
      rooms[room].currentQuestionIndex = currentQuestionIndex + 1;

      const timer = getTimer(room);

      const questionData = {
        question: ques.question,
        questionIndex: ques.questionIndex,
        answers: ques.answerList?.map((answer) => answer.body),
        timer: timer,
        totalQuestions: questions.length
      };

      io.to(room).emit('newQuestion', questionData)

      // Wait for Question Timer
      setTimeout(() => {
        if (!rooms[room]) return;

        // Notify clients that question ended (showing correct answer phase)
        io.to(room).emit('questionEnded'); // New event to show results/correct answer

        if (rooms[room].isManualControl) {
          // MANUAL MODE: Do nothing. Wait for Host to trigger 'nextQuestion'
          console.log(`Room ${room}: Waiting for host (Manual Mode)`);
        } else {
          // AUTO MODE: Continue loop
          const breakTime = getBreakTime(room);
          setTimeout(() => {
            StartAskingQuestion();
          }, breakTime);
        }

      }, timer * 1000)
    }

    // Attach function to room object for manual triggering
    rooms[room].nextQuestionFn = StartAskingQuestion;

    socket.broadcast.to(room).emit('gameStarted')
    StartAskingQuestion()
  })

  // Listener for Host to trigger next question
  socket.on('nextQuestion', ({ room }) => {
    if (rooms[room] && rooms[room].admin.socketId === socket.id) {
      // Logic to trigger next (reuse StartAskingQuestion logic?)
      // We can't easily reuse the scoped function above unless we structure differently.
      // Let's copy/refactor the core asking logic or make it global/helper.
      // Better yet, let's just emit a signal or call a helper.
      // Refactoring: move StartAskingQuestion to room object or outer scope? 
      // For now, let's copy the "Next Step" logic since it's just calling a helper.
      // Wait, StartAskingQuestion relies on closure state? No, it uses 'rooms[room]'.

      // Fix: We need a way to call StartAskingQuestion from here.
      // Let's attach it to the room object!
      if (rooms[room].nextQuestionFn) {
        rooms[room].nextQuestionFn();
      }
    }
  });

  // Update startGame to attach the function
  // (See above block - I will need to rewrite it slightly to attach fn)

  socket.on('disconnect', () => {
    for (const room in rooms) {
      rooms[room].players = rooms[room].players.filter(
        (player) => player.id !== socket.id
      )
      joinedUsers = joinedUsers.filter((user) => user.id !== socket.id) // remove user from joinedUsers array
    }
  })
})

io.emit('joinedUsers', joinedUsers)

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
})
