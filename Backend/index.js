const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const http = require('http'); // 1. Import http
const socketIo = require('socket.io'); // 2. Import socket.io

// Import routes
const userRoutes = require('./routes/user');
const quizRouter = require("./routes/quiz");
const gameRouter = require("./routes/game");
dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS
const corsOptions = {
    origin: '*', // Your frontend URL
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// app.use(bodyParser.json());

// 3. Create HTTP Server
const server = http.createServer(app);

// 4. Initialize Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});

/* ------------------- SOCKET.IO GAME LOGIC START ------------------- */
const rooms = {}
const activeRoomCodes = new Set()

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
        .filter((player) => player.name !== 'Host')
        .sort((a, b) => b.score - a.score);

    const topPlayers = sortedPlayers.map((player, index) => ({
        name: player.name,
        score: player.score,
        position: index + 1,
    }));

    rooms[room].gameState = GAME_STATES.GAME_OVER;

    const history = rooms[room].questions.map(q => ({
        question: q.question,
        options: q.answerList,
    }));

    io.to(room).emit('gameOver', {
        winner: topPlayers[0]?.name || 'No one',
        topPlayers,
        history
    });

    setTimeout(() => {
        if (rooms[room]) {
            delete rooms[room];
            activeRoomCodes.delete(room);
        }
    }, 3600000);
}

function askNewQuestion(room) {
    const roomData = rooms[room];
    if (!roomData) return;

    const questions = roomData.questions;
    const currentQuestionIndex = roomData.currentQuestionIndex || 0;

    if (!questions || questions.length === 0 || currentQuestionIndex >= questions.length) {
        showLeaderboard(room);
        return;
    }

    const ques = questions[currentQuestionIndex];
    if (!ques) return;

    roomData.currentQuestion = ques;
    roomData.currentQuestionIndex = currentQuestionIndex + 1;
    roomData.gameState = GAME_STATES.QUESTION_ACTIVE;
    roomData.currentAnswerCount = 0;

    const timer = getTimer(room);

    const questionPayload = {
        question: ques.question,
        questionIndex: ques.questionIndex,
        answers: ques.answerList?.map((answer) => answer.body || answer.name || answer),
        timer: timer,
        totalQuestions: questions.length,
        currentQuestionNum: currentQuestionIndex + 1
    };

    io.to(room).emit('newQuestion', questionPayload);

    if (roomData.questionTimeout) clearTimeout(roomData.questionTimeout);

    const gracePeriod = 1000;
    roomData.questionTimeout = setTimeout(() => {
        handleQuestionEnd(room);
    }, (timer * 1000) + gracePeriod);
}

function handleQuestionEnd(room) {
    const roomData = rooms[room];
    if (!roomData) return;

    roomData.gameState = GAME_STATES.WAITING_FOR_NEXT;
    const isLastQuestion = roomData.currentQuestionIndex >= roomData.questions.length;

    if (!roomData.isManualControl && !isLastQuestion) {
        const breakTime = getBreakTime(room);
        io.to(room).emit('questionEnded', {
            isLastQuestion,
            autoAdvance: true,
            nextQuestionDelay: breakTime
        });

        roomData.questionTimeout = setTimeout(() => {
            askNewQuestion(room);
        }, breakTime);
    } else {
        io.to(room).emit('questionEnded', { isLastQuestion, autoAdvance: false });
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
    return 4000;
};

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ room, name, questions, quizConfig }, callback) => {
        if (!rooms[room] && (questions || name === 'Host')) {
            if (!room) room = generateUniqueSixDigitPin();
            rooms[room] = {
                gameState: GAME_STATES.LOBBY,
                players: [],
                currentQuestionIndex: 0,
                currentQuestion: null,
                isManualControl: true,
                admin: { socketId: socket.id, name },
                questions,
                quizConfig: quizConfig || { answerTime: 10, gameMode: 'Standard' },
            };
            activeRoomCodes.add(room);
        }

        const roomData = rooms[room];
        if (!roomData) {
            if (typeof callback === 'function') callback({ error: 'Room not found' });
            return;
        }

        if (name === 'Host') roomData.admin.socketId = socket.id;

        socket.join(room);

        const existingPlayer = roomData.players.find(p => p.socketId === socket.id);
        const isAdmin = roomData.admin.socketId === socket.id;

        if (!existingPlayer && !isAdmin) {
            roomData.players.push({ socketId: socket.id, name, score: 0 });
            socket.broadcast.to(room).emit('userJoined', { users: roomData.players });
        }

        callback({
            users: roomData.players,
            room,
            isAdmin,
            gameState: roomData.gameState,
            currentQuestion: roomData.gameState === GAME_STATES.QUESTION_ACTIVE ? {
                question: roomData.currentQuestion?.question,
                answers: roomData.currentQuestion?.answerList?.map(a => a.body),
                timer: getTimer(room)
            } : null
        });
    });

    socket.on('startGame', ({ room, isManualControl }) => {
        const roomData = rooms[room];
        if (roomData && roomData.admin.socketId === socket.id) {
            roomData.isManualControl = isManualControl;
            roomData.currentQuestionIndex = 0;
            io.to(room).emit('gameStarted');
            askNewQuestion(room);
        }
    });

    socket.on('nextQuestion', ({ room }) => {
        const roomData = rooms[room];
        if (roomData && roomData.admin.socketId === socket.id) {
            if (roomData.questionTimeout) clearTimeout(roomData.questionTimeout);
            askNewQuestion(room);
        }
    });

    socket.on('submitAnswer', (room, name, answerIndex, callback) => {
        const roomData = rooms[room];
        if (!roomData || !roomData.currentQuestion) return;

        const currentQ = roomData.currentQuestion;
        const isCorrect = currentQ.answerList[answerIndex]?.isCorrect;

        roomData.currentAnswerCount = (roomData.currentAnswerCount || 0) + 1;
        io.to(room).emit('answerCountUpdate', { count: roomData.currentAnswerCount });

        let points = 0;
        if (isCorrect) points = 10;

        const player = roomData.players.find(p => p.socketId === socket.id);
        if (player) {
            player.score += points;
        }

        callback({
            isCorrect,
            points,
            correctIndex: currentQ.answerList.findIndex(a => a.isCorrect),
            scores: roomData.players
        });
    });

    socket.on('disconnect', () => {
        for (const room in rooms) {
            rooms[room].players = rooms[room].players.filter(p => p.socketId !== socket.id);
            io.to(room).emit('userJoined', { users: rooms[room].players });
        }
    });
});
/* ------------------- SOCKET.IO GAME LOGIC END ------------------- */


const PORT = process.env.PORT || 5000;

// 5. Connect DB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
        });
        // console.log('Successfully connected to the database');
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
};
connectDB();

app.use('/api/users', userRoutes);
app.use('/api/quizes', quizRouter);
app.use('/api/game', gameRouter);

// 6. Listen on SERVER not APP
server.listen(PORT, () => {
    // console.log(`Server (API + Socket) Running on Port ${PORT}`);
});



