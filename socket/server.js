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
  if (rooms[room].players.length === 0) {
    clearTimeout(rooms[room].questionTimeout)
    delete rooms[room]
    activeRoomCodes.delete(room)
    return
  }
  const questions = rooms[room].questions
  const currentQuestionIndex = rooms[room].currentQuestionIndex || 0
  console.log("currentQuestionIndex=",currentQuestionIndex);
  const ques = questions[currentQuestionIndex]

  rooms[room].currentQuestionIndex = (currentQuestionIndex+1 ) % questions.length

  return {
    question: ques.question,
    questionIndex: ques.questionIndex,
    answers: ques.answerList?.map((answer) => answer.body),
    timer: 10,
  }

  // rooms[room].currentQuestion = question

  // const correctAnswerIndex = question.answers.findIndex(
  //   (answer) => answer.correct
  // )
  // rooms[room].correctAnswer = correctAnswerIndex
  // io.to(room).emit('newQuestion', {
  //   question: question.question,
  //   answers: question.answers.map((answer) => answer.text),
  //   timer: 10,
  // })
  // rooms[room].questionTimeout = setTimeout(() => {
  //   io.to(room).emit('answerResult', {
  //     playerName: 'No one',
  //     isCorrect: false,
  //     correctAnswer: rooms[room].correctAnswer,
  //     scores: rooms[room].players.map((player) => ({
  //       name: player.name,
  //       score: player.score || 0,
  //     })),
  //   })
  //   askNewQuestion(room)
  // }, 10000)
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
      const existingPlayer = rooms[room].players.find((player) => player.socketId === socket.id)
      if (existingPlayer) {
        // Host is already in the room, don't add them again
        callback({
          users: rooms[room].players.filter(player => player.socketId !== socket.id), // Remove host from user list
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
      users: rooms[room].players.filter(player => player.socketId !== socket.id), // Remove host from user list
      room,
      isAdmin: rooms[room].admin.socketId === socket.id,
    })
  })
  

  // socket.on('startGame', ({ room }) => {
  //   const StartAskingQuestion = () => {
  //     const question = askNewQuestion(room)
  //     io.to(room).emit('newQuestion', question)
  //     setTimeout(() => {
  //       io.to(room).emit('answerResult', {
  //         playerName: 'No one',
  //         isCorrect: false,
  //         correctAnswer: rooms[room].correctAnswer,
  //         scores: rooms[room].players.map((player) => ({
  //           name: player.name,
  //           score: player.score || 0,
  //         })),
  //       })
  //       StartAskingQuestion()
  //     }, question.timer * 1000)
  //   }

  //   socket.broadcast.to(room).emit('gameStarted')
  //   StartAskingQuestion()
  // })

  socket.on('submitAnswer', (room, questionIndex, answerIndex, callback) => {
  if (!rooms[room]) {
    console.error(`Room ${room} does not exist.`);
    return;
  }

  const currentPlayer = rooms[room].players.find(
    (player) => player.socketId === socket.id
  );

  if (!currentPlayer) {
    console.error('Player not found in the room');
    return;
  }

  const question = rooms[room].questions.find(
    (q) => q.questionIndex === questionIndex
  );

  if (!question) {
    console.error('Question not found');
    return;
  }

  const correctAnswer = question.answerList.find((answer) => answer.isCorrect);
  const submittedAnswer = question.answerList[answerIndex];

  const isCorrect = submittedAnswer.isCorrect === correctAnswer.isCorrect;
  console.log("isCorrect=", isCorrect);

  if (isCorrect) {
    currentPlayer.score += 1;
  }

  clearTimeout(rooms[room].questionTimeout);

  callback({
    playerName: currentPlayer.name,
    isCorrect,
    correctAnswer: correctAnswer.body,
    scores: rooms[room].players.map((player) => ({
      name: player.name,
      score: player.score || 0,
    })),
  });

  const winningThreshold = 5;
  const winner = rooms[room].players.find(
    (player) => (player.score || 0) >= winningThreshold
  );

  if (winner) {
    io.to(room).emit('gameOver', { winner: winner.name });
    delete rooms[room];
    activeRoomCodes.delete(room);
  } 
  // else {
  //   askNewQuestion(room);
  // }
});


  socket.on('startGame', ({ room }) => {
    const StartAskingQuestion = () => {
      const question = askNewQuestion(room)
      //   const question = askNewQuestion(room);
      io.to(room).emit('newQuestion', question)

      socket.broadcast.to(room).emit('newQuestion', { question })
      // console.log(rooms[room]);
      setTimeout(() => {
        socket.broadcast.to(room).emit('answerResult', {
          playerName: 'No one',
          isCorrect: false,
          // correctAnswer: rooms[room].correctAnswer.isCorrect,
          scores: rooms[room].players.map((player) => ({
            name: player.name,
            score: player.score || 0,
          })),
        })
        StartAskingQuestion()
      }, question.timer * 1000)
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
