import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:3000');

export default function Join() {
  const navigate = useNavigate();
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [info, setInfo] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [scores, setScores] = useState([]);
  const [seconds, setSeconds] = useState('');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [winner, setWinner] = useState();
  const [topPlayers, setTopPlayers] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    if (name && room) {
      socket.emit('joinRoom', { room, name }, ({ users, room }) => {
        setRoom(room);
        setInfo(true);
      });
    }
  }

  const handleAnswers = () => {
    navigate('/answers');
  }

  const handleAnswer = (answerIndex) => {
    if (!answered) {
      setSelectedAnswerIndex(answerIndex);
      // Determine correction locally for immediate feedback if possible, or wait for server logic
      // But preserving original logic which alerts based on server response via callback
      socket.emit('submitAnswer', room, '', answerIndex, (data) => {
        if (data.isCorrect) {
          toast.success(`Correct! +${data.points || 'Points'}`, { position: 'top-center', autoClose: 2000 });
          setCorrectAnswerIndex(answerIndex);
        } else {
          toast.error(`Incorrect!`, { position: 'top-center', autoClose: 2000 });
          setCorrectAnswerIndex(data.correctIndex);
        }
        setScores(data.scores);
      });
      setAnswered(true);
    }
  };

  useEffect(() => {
    socket.on('message', (message) => {
      toast.info(message, { position: 'top-right', autoClose: 3000 });
    });
    return () => socket.off('message');
  }, []);

  useEffect(() => {
    socket.on('gameStarted', () => {
      setInfo(true);
    });
    socket.on('newQuestion', ({ question }) => {
      setQuestion(question.question);
      setOptions(question.answers);
      setSeconds(question.timer);
      setAnswered(false);
      setSelectedAnswerIndex(null);
      setCorrectAnswerIndex(null);
    });

    socket.on('gameOver', (data) => {
      setWinner(data.winner);
      setTopPlayers(data.topPlayers);
    });

    return () => {
      socket.off('newQuestion');
      socket.off('answerResult');
      socket.off('gameOver');
      socket.off('gameStarted');
    };
  }, []);

  useEffect(() => {
    if (seconds === 0) return;
    const timeInterval = setInterval(() => {
      setSeconds((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timeInterval);
  }, [seconds]);

  // Game Over Screen
  if (winner) {
    return (
      <div className="min-h-screen bg-[#2563eb] flex flex-col items-center justify-center p-4 text-center overflow-hidden relative font-sans">
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={true} numberOfPieces={600} />
        <div className="z-10 bg-white p-8 rounded-3xl shadow-card max-w-lg w-full">
          <h1 className="text-4xl font-black text-gray-900 mb-6">Game Over!</h1>

          <div className="mb-8 transform scale-125">
            <div className="w-24 h-24 bg-yellow-100 rounded-full mx-auto flex items-center justify-center border-4 border-yellow-200 mb-4 animate-bounce">
              <span className="text-4xl">🏆</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wider">{winner}</h2>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="text-gray-400 font-bold mb-4 uppercase text-sm tracking-widest text-center">Leaderboard</h3>
            <ul className="space-y-2">
              {topPlayers.map((player) => (
                <li key={player.name} className="flex justify-between items-center text-gray-800 p-2 rounded bg-white border border-gray-100 shadow-sm">
                  <span className="font-bold">#{player.position} {player.name}</span>
                  <span className="text-blue-600 font-mono font-bold">{player.score} pts</span>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={handleAnswers} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded shadow-button active:translate-y-1 active:shadow-button-active transition-all">
            View Answers
          </button>
        </div>
      </div>
    );
  }

  // Join Screen
  if (!info) {
    return (
      <div className="min-h-screen bg-[#2563eb] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-lg transform rotate-45 animate-float"></div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-card z-10 w-full max-w-md relative">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-2">TriviArena</h1>
            <p className="text-gray-500 font-bold">Join the fun!</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                required
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                type="number"
                placeholder="Game PIN"
                className="w-full bg-gray-100 border-2 border-transparent text-gray-900 rounded px-4 py-4 text-center text-2xl font-black placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all font-mono"
              />
            </div>
            <div>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Nickname"
                className="w-full bg-gray-100 border-2 border-transparent text-gray-900 rounded px-4 py-4 text-center text-xl font-bold placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all"
              />
            </div>
            <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded shadow-button active:translate-y-1 active:shadow-button-active transition-all text-xl mt-4">
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Active Game Screen
  return (
    <div className="min-h-screen bg-[#2563eb] flex flex-col p-4 relative overflow-hidden font-sans">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6 z-10 w-full max-w-4xl mx-auto text-white">
        <div className="font-bold">
          <span className="opacity-70">PIN:</span> {room}
        </div>
        <div className="font-bold bg-white/20 backdrop-blur px-4 py-1 rounded-full">
          {name}
        </div>
        <div className="font-bold bg-white/20 backdrop-blur px-4 py-1 rounded-full flex items-center gap-2">
          <span>{seconds}</span>
        </div>
      </div>

      {question ? (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto z-10">
          <div className="bg-white text-gray-900 w-full p-4 md:p-8 rounded shadow-card mb-8 text-center min-h-[100px] flex items-center justify-center">
            <h2 className="text-xl md:text-2xl font-black">{question}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-[350px]">
            {options.map((answer, index) => {
              const bgColors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'];
              const icons = ['▲', '◆', '●', '■'];
              const isSelected = selectedAnswerIndex === index;
              const isCorrect = correctAnswerIndex === index;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={`
                            relative w-full h-full rounded shadow-button flex items-center p-6 transition-all active:scale-95 disabled:cursor-not-allowed
                            ${bgColors[index]}
                            ${answered && !isSelected ? 'opacity-50' : ''}
                          `}
                >
                  <span className="text-white/60 text-4xl mr-4">{icons[index]}</span>
                  <span className="text-white text-xl font-bold text-left leading-tight">{answer}</span>

                  {isCorrect && <div className="absolute top-2 right-2 bg-white text-green-600 rounded-full p-1 text-sm font-bold shadow">✓</div>}
                  {answered && isSelected && !isCorrect && correctAnswerIndex !== null && <div className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1 text-sm font-bold shadow">✕</div>}
                </button>
              )
            })}
          </div>

          {answered && !correctAnswerIndex && (
            <div className="mt-8 bg-black/20 text-white px-6 py-2 rounded-full font-bold animate-pulse">
              Answer submitted! Good luck!
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
          <div className="w-full max-w-md bg-white rounded-xl shadow-card p-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl mb-4 animate-bounce">
              👑
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">You're in!</h2>
            <p className="text-gray-500 font-bold mb-8">See your name on screen?</p>
            <div className="w-full bg-gray-100 p-3 rounded text-sm text-gray-500 font-bold uppercase tracking-wide">
              Waiting for host
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


