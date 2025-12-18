import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { FiArrowLeft } from 'react-icons/fi';

const socket = io(import.meta.env.VITE_SOCKET_URL, { autoConnect: false });

function Join() {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [message, setMessage] = useState('');
    const [gameState, setGameState] = useState('LOBBY'); // LOBBY, QUESTION_ACTIVE, WAITING_FOR_NEXT, GAME_OVER
    const [question, setQuestion] = useState('');
    const [image, setImage] = useState(''); // New image state
    const [options, setOptions] = useState([]);
    const [timer, setTimer] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null); // null, true, false
    const [rank, setRank] = useState(0);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [winner, setWinner] = useState(null);
    const [topPlayers, setTopPlayers] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    // Helper to get query params
    const useQuery = () => new URLSearchParams(location.search);
    const query = useQuery();

    useEffect(() => {
        // 1. Auto-fill from URL
        const roomParam = query.get('room');
        if (roomParam) setRoom(roomParam);

        // 2. Enforce Single User: Auto-login if session exists
        const storedName = sessionStorage.getItem('player_name');
        const storedRoom = sessionStorage.getItem('player_room');

        if (storedName && storedRoom) {
            setName(storedName);
            setRoom(storedRoom);
            // Auto-connect
            if (!socket.connected) socket.connect();
            socket.emit('join', { name: storedName, room: storedRoom });
        }
    }, []);

    useEffect(() => {
        // Socket Listeners
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('error', (msg) => {
            setMessage(msg);
            // If error (e.g. name taken), reset joined state
            setIsJoined(false);
        });

        socket.on('joined', ({ name, room }) => {
            setIsJoined(true);
            setMessage(`Joined Room: ${room}`);
            // Simple persistence
            sessionStorage.setItem('player_name', name);
            sessionStorage.setItem('player_room', room);
        });

        socket.on('newQuestion', ({ question, backgroundImage, answers, timer }) => {
            setGameState('QUESTION_ACTIVE');
            setQuestion(question);
            setImage(backgroundImage); // Set image
            setOptions(answers);
            setTimer(timer);
            setSelectedOption(null);
            setIsCorrect(null);
            setMessage('');
        });

        socket.on('timerUpdate', (time) => {
            setTimer(time);
        });

        socket.on('questionEnded', ({ correctAnswer, yourAnswer, isCorrect, score, rank, totalPlayers }) => {
            setGameState('WAITING_FOR_NEXT');
            setIsCorrect(isCorrect);
            setScore(score);
            setRank(rank);
            setTotalPlayers(totalPlayers);
            if (isCorrect) {
                setMessage(`Correct! +${score} pts`);
            } else {
                setMessage(`Wrong! The answer was ${correctAnswer}`);
            }
        });

        socket.on('gameOver', ({ winner, topPlayers }) => {
            setGameState('GAME_OVER');
            setWinner(winner);
            setTopPlayers(topPlayers);
        });

        socket.on('hostEndedSession', () => {
            alert("The host has ended the session. Please enter a new code.");
            sessionStorage.clear();
            window.location.href = '/join'; // Or use navigate('/')
        });

        return () => {
            socket.off('connect');
            socket.off('error');
            socket.off('joined');
            socket.off('newQuestion');
            socket.off('timerUpdate');
            socket.off('questionEnded');
            socket.off('gameOver');
            socket.off('hostEndedSession');
        };
    }, []);

    const handleJoin = (e) => {
        e.preventDefault();
        if (name && room) {
            if (!socket.connected) socket.connect();
            socket.emit('join', { name, room });
        }
    };

    const handleAnswer = (option) => {
        if (selectedOption || gameState !== 'QUESTION_ACTIVE') return;
        setSelectedOption(option);
        socket.emit('submitAnswer', { room, answer: option });
    };

    const handleLeave = () => {
        socket.disconnect();
        sessionStorage.clear();
        setIsJoined(false);
        navigate('/');
    }

    // GAME OVER SCREEN
    if (gameState === 'GAME_OVER') {
        const isWinner = winner && winner.name === name;
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white flex flex-col items-center justify-center p-4">
                {isWinner && <Confetti />}
                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border border-white/20 animate-scale-in">
                    <h1 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        {isWinner ? 'VICTORY!' : 'GAME OVER'}
                    </h1>
                    <p className="text-xl font-bold mb-8 text-blue-200">{isWinner ? 'You represent the pinnacle of intellect!' : 'Better luck next time!'}</p>

                    <div className="bg-black/30 rounded-2xl p-6 mb-8">
                        <div className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-2">Final Score</div>
                        <div className="text-6xl font-black text-white mb-2">{score}</div>
                        <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-bold">Rank #{rank} / {totalPlayers}</div>
                    </div>

                    <button
                        onClick={handleLeave}
                        className="w-full bg-white text-blue-900 font-black py-4 rounded-xl shadow-lg hover:bg-blue-50 transform hover:scale-105 transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    // ACTIVE GAME SCREEN
    if (isJoined) {
        return (
            <div className="min-h-screen bg-[#46178f] flex flex-col items-center relative overflow-hidden font-sans">

                {/* Top Bar */}
                <div className="w-full flex justify-between items-center p-4 z-10 bg-black/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold border-2 border-white/30">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="text-xs text-white/60 font-bold uppercase tracking-wider">Player</div>
                            <div className="font-black text-white leading-none">{name}</div>
                        </div>
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-full font-black text-white text-xl shadow-inner border border-white/10">
                        {score} pts
                    </div>
                </div>

                {/* Game Content */}
                <div className="flex-1 w-full max-w-lg p-4 flex flex-col justify-center relative z-10">

                    {gameState === 'LOBBY' && (
                        <div className="text-center animate-float">
                            <div className="text-6xl mb-6">⏳</div>
                            <h2 className="text-3xl font-black text-white mb-4">You're in!</h2>
                            <p className="text-xl text-blue-200 font-medium">See your name on screen?</p>
                        </div>
                    )}

                    {gameState === 'WAITING_FOR_NEXT' && (
                        <div className="text-center animate-fade-in-up">
                            <div className={`text-6xl mb-6 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                {isCorrect ? 'Correct! 🎉' : 'Oops! ❌'}
                            </div>
                            <div className="bg-black/30 p-6 rounded-2xl backdrop-blur-md border border-white/10">
                                <div className="text-gray-400 font-bold uppercase text-sm mb-1">Current Streak</div>
                                <div className="text-white font-black text-2xl">🔥 3</div>
                                {/* Streak is dummy for now, can implement later */}
                            </div>
                            <p className="text-white/60 mt-8 font-bold animate-pulse">Waiting for host...</p>
                        </div>
                    )}

                    {gameState === 'QUESTION_ACTIVE' && (
                        <div className="w-full h-full flex flex-col">
                            {/* Timer Bar */}
                            {/* Timer Bar */}
                            <div className="w-full bg-white/20 h-2 rounded-full mb-6 overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 transition-all duration-1000 ease-linear"
                                    style={{ width: `${(timer / 30) * 100}%` }} // Assuming 30s max for visual
                                ></div>
                            </div>

                            {/* Question Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-2xl mb-6 min-h-[160px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                                <h2 className="text-gray-900 text-xl font-bold leading-tight z-10 relative">
                                    {question}
                                </h2>

                                {/* Image Display */}
                                {image && (
                                    <div className="w-full max-h-60 md:max-h-80 mt-4 rounded-lg overflow-hidden border border-gray-100">
                                        <img src={image} alt="Question" className="w-full h-full object-contain bg-gray-50" />
                                    </div>
                                )}
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-2 gap-3 flex-1">
                                {options.map((option, idx) => {
                                    const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'];
                                    const icons = ['▲', '◆', '●', '■'];
                                    const isSelected = selectedOption === option;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(option)}
                                            disabled={selectedOption !== null}
                                            className={`
                                        ${colors[idx]} 
                                        rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-button 
                                        transition-all active:scale-95 active:shadow-none
                                        ${isSelected ? 'ring-4 ring-white scale-95 opacity-100' : 'opacity-100'}
                                        ${selectedOption && !isSelected ? 'opacity-50 grayscale' : ''}
                                    `}
                                        >
                                            <span className="text-white/80 text-3xl font-black">{icons[idx]}</span>
                                            <span className="text-white font-bold text-lg leading-tight break-words w-full text-center">
                                                {option}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        );
    }

    // LOGIN / JOIN FORM
    return (
        <div className="min-h-screen bg-[#2563eb] flex flex-col items-center justify-center p-4 font-sans text-gray-900">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-md">TriviArena</h1>
                    <p className="text-blue-100 font-medium text-lg">Enter the arena, prove your worth.</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-2xl border-4 border-white/20">
                    <form onSubmit={handleJoin} className="flex flex-col gap-5">
                        <div>
                            <input
                                type="text"
                                placeholder="Game PIN"
                                className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl font-bold text-center text-xl placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all uppercase tracking-widest"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Nickname"
                                className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl font-bold text-center text-xl placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="h-4">
                            {message && <p className="text-red-500 text-center font-bold text-sm animate-pulse">{message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-black text-xl shadow-lg transform hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-md"
                        >
                            Enter Arena
                        </button>
                    </form>
                </div>

                <nav className="mt-12 flex justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-200 font-bold hover:text-white flex items-center gap-2 transition-colors px-4 py-2 rounded-full hover:bg-white/10"
                    >
                        <FiArrowLeft /> Back to Home
                    </button>
                </nav>
            </div>
        </div>
    )
}

export default Join;
