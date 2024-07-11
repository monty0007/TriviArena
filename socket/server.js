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
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
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
  socket.on('joinRoom', ({ room, name, questions }, callback) => {
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
      }
      activeRoomCodes.add(room)
    } else {
      if (!rooms[room]) {
        // Handle case where room doesn't exist (should not happen ideally)
        console.error(`Room ${room} does not exist.`)
        return
      }
      const existingPlayer = rooms[room].players.find(
        (player) => player.socketId === socket.id
      )
      if (existingPlayer) {
        // Host is already in the room, don't add them again
        callback({
          users: rooms[room].players.filter(
            (player) => player.socketId !== socket.id
          ), // Remove host from user list
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
      ), // Remove host from user list
      room,
      isAdmin: rooms[room].admin.socketId === socket.id,
    })
  })

  socket.on('submitAnswer', (room, questionIndex, answerIndex, callback) => {
    if (!rooms[room]) {
      console.error(`Room ${room} does not exist.`)
      return
    }

    const currentPlayer = rooms[room].players.find(
      (player) => player.socketId === socket.id
    )

    if (!currentPlayer) {
      console.error('Player not found in the room')
      return
    }

    const question = rooms[room].questions.find(
      (q) => q.questionIndex === questionIndex
    )

    if (!question) {
      console.error('Question not found')
      return
    }

    const correctAnswer = question.answerList.find((answer) => answer.isCorrect)
    const submittedAnswer = question.answerList[answerIndex]

    const isCorrect = submittedAnswer.isCorrect === correctAnswer.isCorrect
    // console.log('isCorrect=', isCorrect)

    if (isCorrect) {
      currentPlayer.score += 1
    }

    clearTimeout(rooms[room].questionTimeout)

    callback({
      playerName: currentPlayer.name,
      isCorrect,
      correctAnswer: correctAnswer.body,
      scores: rooms[room].players.map((player) => ({
        name: player.name,
        score: player.score || 0,
      })),
    })

    const winningThreshold = 100 // Define your winning threshold here
    const winner = rooms[room].players.find(
      (player) => (player.score || 0) >= winningThreshold
    )

    if (winner) {
      showLeaderboard(room);
    }
  })

  socket.on('startGame', ({ room }) => {
    const StartAskingQuestion = () => {
      const question = askNewQuestion(room)
      // If no question is returned, it means the game has ended
      if (!question) return;

      io.to(room).emit('newQuestion', question)

      socket.broadcast.to(room).emit('newQuestion', { question })
      // console.log(rooms[room]);
      setTimeout(() => {
        socket.broadcast.to(room).emit('answerResult', {
          playerName: 'No one',
          isCorrect: false,
          // correctAnswer: rooms[room].correctAnswer.isCorrect,
          // scores: rooms[room].players.map((player) => ({
          //   name: player.name,
          //   score: player.score || 0,
          // })),
        })
        StartAskingQuestion()
      // }, question.timer * 1000)
      }, 10000)
    }

    socket.broadcast.to(room).emit('gameStarted')
    StartAskingQuestion()
  })

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
