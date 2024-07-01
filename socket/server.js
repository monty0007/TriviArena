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

// const questions = [
//   {
//     question: 'What is the flagship product of XR Central?',
//     answers: [
//       { text: 'MetaQube', correct: true },
//       { text: 'MetaWorld', correct: false },
//       { text: 'XRBuilder', correct: false },
//       { text: 'VRStudio', correct: false },
//     ],
//   },
//   {
//     question: 'Which industry sectors has XR Central worked with?',
//     answers: [
//       { text: 'Aviation, Automotive, and Art', correct: true },
//       { text: 'Retail, Food & Beverage, and Real Estate', correct: false },
//       { text: 'Healthcare, Education, and Finance', correct: false },
//       { text: 'Sports, Entertainment, and Tourism', correct: false },
//     ],
//   },
//   {
//     question: 'Who are the founders of XR Central?',
//     answers: [
//       { text: 'Anshul Agarwal and Shrey Mishra', correct: true },
//       { text: 'Sundar Pichai and Satya Nadella', correct: false },
//       { text: 'Elon Musk and Mark Zuckerberg', correct: false },
//       { text: 'Bill Gates and Steve Jobs', correct: false },
//     ],
//   },
//   {
//     question: 'In which city is XR Central based?',
//     answers: [
//       { text: 'Gurgaon', correct: true },
//       { text: 'Bangalore', correct: false },
//       { text: 'Mumbai', correct: false },
//       { text: 'New Delhi', correct: false },
//     ],
//   },
//   {
//     question:
//       "What percentage of XR Central's revenue comes from metaverse as a service?",
//     answers: [
//       { text: '80%', correct: true },
//       { text: '60%', correct: false },
//       { text: '50%', correct: false },
//       { text: '30%', correct: false },
//     ],
//   },
//   {
//     question: 'What type of platform is MetaQube?',
//     answers: [
//       { text: 'No-code platform', correct: true },
//       { text: 'Low-code platform', correct: false },
//       { text: 'Full-code platform', correct: false },
//       { text: 'Hybrid-code platform', correct: false },
//     ],
//   },
//   {
//     question: 'During which global event was XR Central founded?',
//     answers: [
//       { text: 'COVID-19 pandemic', correct: true },
//       { text: 'Global Financial Crisis', correct: false },
//       { text: 'Dot-com Bubble', correct: false },
//       { text: 'World War II', correct: false },
//     ],
//   },
//   {
//     question: 'Which company is not mentioned as a partner of XR Central?',
//     answers: [
//       { text: 'Google', correct: true },
//       { text: 'SpiceJet', correct: false },
//       { text: 'Mercedes Benz', correct: false },
//       { text: 'HCL', correct: false },
//     ],
//   },
//   {
//     question: 'Which product sector is XR Central heavily involved in?',
//     answers: [
//       { text: 'Metaverse experiences', correct: true },
//       { text: 'Cloud computing', correct: false },
//       { text: 'Cybersecurity', correct: false },
//       { text: 'Blockchain', correct: false },
//     ],
//   },
//   {
//     question: 'How does XR Central primarily deliver its services?',
//     answers: [
//       { text: 'Subscription model', correct: true },
//       { text: 'One-time purchase', correct: false },
//       { text: 'Freemium model', correct: false },
//       { text: 'Pay-per-use model', correct: false },
//     ],
//   },
// ]

// let questions=[];

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
  const questions=rooms[room].questions;
  const randomIndex = Math.floor(Math.random() * questions.length)
  const ques = questions[randomIndex]

  return {
    question: ques.question,
    questionIndex:ques.questionIndex,
    answers: ques.answerList?.map((answer) => answer.body),
    timer: 10,
  }
  rooms[room].currentQuestion = question

  const correctAnswerIndex = question.answers.findIndex(
    (answer) => answer.correct
  )
  rooms[room].correctAnswer = correctAnswerIndex
  io.to(room).emit('newQuestion', {
    question: question.question,
    answers: question.answers.map((answer) => answer.text),
    timer: 10,
  })
  rooms[room].questionTimeout = setTimeout(() => {
    io.to(room).emit('answerResult', {
      playerName: 'No one',
      isCorrect: false,
      correctAnswer: rooms[room].correctAnswer,
      scores: rooms[room].players.map((player) => ({
        name: player.name,
        score: player.score || 0,
      })),
    })
    askNewQuestion(room)
  }, 10000)
}

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ room, name,questions }, callback) => {
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
        questions
      }
      activeRoomCodes.add(room)
    } else {
      if (!rooms[room]) {
        // Handle case where room doesn't exist (should not happen ideally)
        console.error(`Room ${room} does not exist.`)
        return
      }
      rooms[room].players.push({ socketId: socket.id, name,score:0 })
      socket.broadcast.to(room).emit('message', `${name} has joined the room`)
      socket.broadcast.to(room).emit('userJoined', {
        users: rooms[room].players,
      })
    }
    console.log(rooms[room].players);

    socket.join(room)

    callback({
      users: rooms[room].players,
      room,
      isAdmin: rooms[room].admin.socketId === socket.id,
    })
  })


  socket.on('startGame', ({ room }) => {
    const StartAskingQuestion = () => {
      const question = askNewQuestion(room)
      io.to(room).emit('newQuestion', question)
      setTimeout(() => {
        io.to(room).emit('answerResult', {
          playerName: 'No one',
          isCorrect: false,
          correctAnswer: rooms[room].correctAnswer,
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

  socket.on('submitAnswer', (room, questionIndex, callback) => {
    const currentPlayer = rooms[room].players.find(
      (player) => player.socketId === socket.id
    )
  
    if (!currentPlayer) {
      console.error('Player not found in the room');
      return;
    }
  
    const question = rooms[room].questions.find((q) => q.questionIndex === questionIndex);
    
    if (!question) {
      console.error('Question not found');
      return;
    }
  
    const submittedAnswer = question.answerList.find((answer) => answer.isCorrect);
    const correctAnswer = question.answerList.find((answer) => answer.correct);
  
    const isCorrect = submittedAnswer && submittedAnswer.body === correctAnswer.body;
  
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
    const winner = rooms[room].players.find((player) => (player.score || 0) >= winningThreshold);
  
    if (winner) {
      io.to(room).emit('gameOver', { winner: winner.name });
      delete rooms[room];
      activeRoomCodes.delete(room);
    } else {
      askNewQuestion(room);
    }
  });
  


  socket.on('startGame', ({ room }) => {
    const StartAskingQuestion = () => {
      const question = askNewQuestion(room)
      //   const question = askNewQuestion(room);
      io.to(room).emit('newQuestion', question)

      socket.broadcast.to(room).emit('newQuestion', { question })
      setTimeout(() => {
        socket.broadcast.to(room).emit('answerResult', {
          playerName: 'No one',
          isCorrect: false,
          correctAnswer: rooms[room].correctAnswer,
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
