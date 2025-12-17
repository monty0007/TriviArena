import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import { FiX, FiArrowLeft } from 'react-icons/fi';

const socket = io(import.meta.env.VITE_SOCKET_URL);

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
  const [isWaiting, setIsWaiting] = useState(false);
  const [isWaitingForResults, setIsWaitingForResults] = useState(false);
  const [autoCountdown, setAutoCountdown] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isGameTerminated, setIsGameTerminated] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (name && room) {
      sessionStorage.setItem('player_room', room);
      sessionStorage.setItem('player_name', name);

      socket.emit('joinRoom', { room, name }, ({ users, room }) => {
        setRoom(room);
        setInfo(true);
      });
    }
  }

  const leaveGame = () => {
    sessionStorage.removeItem('player_room');
    sessionStorage.removeItem('player_name');
    setInfo(false);
    setRoom('');
    setName('');
    setIsGameTerminated(false);
    window.location.reload();
  };

  const handleAnswers = () => {
    setShowHistory(true);
  }

  const handleAnswer = (answerIndex) => {
    if (!answered) {
      setSelectedAnswerIndex(answerIndex);
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

  // Precise Timer Logic
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    if (!endTime) return;

    const timerInterval = setInterval(() => {
      const remaining = Math.ceil((endTime - Date.now()) / 1000);

      if (remaining <= 0) {
        setSeconds(0);
      } else {
        setSeconds(remaining);
      }
    }, 200);

    return () => clearInterval(timerInterval);
  }, [endTime, isWaiting, answered, correctAnswerIndex, question]);

  // Handle zeroing out transition
  useEffect(() => {
    if (seconds <= 0 && !isWaiting && !answered && !correctAnswerIndex && question) {
      setIsWaiting(true);
    }
  }, [seconds, isWaiting, answered, correctAnswerIndex, question]);

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
    socket.on('newQuestion', (data) => {
      console.log('[Join] Received newQuestion:', data);
      const { question, answers, timer } = data;
      setQuestion(question);
      setOptions(answers);
      const durationMs = timer * 1000;
      setEndTime(Date.now() + durationMs);
      setSeconds(timer);

      setAnswered(false);
      setSelectedAnswerIndex(null);
      setCorrectAnswerIndex(null);
      setIsWaiting(false);
      setAutoCountdown(null);
    });

    socket.on('questionEnded', ({ isLastQuestion, autoAdvance, nextQuestionDelay } = {}) => {
      setEndTime(null);
      setSeconds(0);
      setIsWaiting(true);
      if (isLastQuestion) setIsWaitingForResults(true);

      if (autoAdvance && nextQuestionDelay) {
        let c = Math.floor(nextQuestionDelay / 1000) - 1;
        if (c < 1) c = 3;
        setAutoCountdown(c);

        const intv = setInterval(() => {
          setAutoCountdown(prev => {
            if (prev <= 1) {
              clearInterval(intv);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    });

    socket.on('gameOver', (data) => {
      setWinner(data.winner);
      setTopPlayers(data.topPlayers);
      setQuizHistory(data.history || []);
    });

    socket.on('gameTerminated', () => {
      setIsGameTerminated(true);
      setInfo(false);
      setQuestion('');
      sessionStorage.clear();
    });

    return () => {
      socket.off('newQuestion');
      socket.off('answerResult');
      socket.off('gameOver');
      socket.off('gameStarted');
      socket.off('questionEnded');
      socket.off('gameTerminated');
    };
  }, []);

  useEffect(() => {
    socket.on('hostDisconnected', () => {
      toast.info("The host has ended the session. Please enter a new code.", { position: 'top-center', autoClose: 4000 });
      sessionStorage.removeItem('player_room');
      sessionStorage.removeItem('player_name');
      setInfo(false);
      setRoom('');
      setName('');
    });
    return () => socket.off('hostDisconnected');
  }, []);

  // Game Over Screen
  if (winner) {
    if (showHistory) {
      return (
        <div className="min-h-screen bg-[#2563eb] flex flex-col items-center justify-center p-4 font-sans">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-card flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-black text-gray-800">Quiz Results</h2>
              <button onClick={() => setShowHistory(false)} className="text-blue-600 font-bold hover:underline">Close</button>
            </div>
            <div className="overflow-y-auto p-6 space-y-6">
              {quizHistory.map((q, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg"><span className="text-blue-500 mr-2">Q{i + 1}.</span>{q.question}</h3>
                  <div className="space-y-2">
                    {q.options.map((opt, idx) => (
                      <div key={idx} className={`p-3 rounded-lg font-medium text-sm flex justify-between items-center ${opt.isCorrect ? 'bg-green-100 text-green-800 border-green-200 border' : 'bg-gray-50 text-gray-500'}`}>
                        <span>{opt.body || opt.name}</span>
                        {opt.isCorrect && <span className="text-xl">✅</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-[#2563eb] flex flex-col items-center justify-center p-4 text-center overflow-hidden relative font-sans">
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={true} numberOfPieces={600} />
        <div className="z-10 bg-white p-8 rounded-3xl shadow-card max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
          <h1 className="text-4xl font-black text-gray-900 mb-6">Game Over!</h1>

          <div className="mb-8 transform scale-100 md:scale-110">
            <div className="w-24 h-24 bg-yellow-100 rounded-full mx-auto flex items-center justify-center border-4 border-yellow-200 mb-4 animate-bounce">
              <span className="text-4xl">🏆</span>
            </div>
            <div className="bg-yellow-50 inline-block px-6 py-2 rounded-full border border-yellow-200">
              <span className="text-sm font-bold text-yellow-600 uppercase tracking-widest block mb-1">Winner</span>
              <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wider">{winner}</h2>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left max-h-60 overflow-y-auto custom-scrollbar border border-gray-100">
            <h3 className="text-gray-400 font-bold mb-4 uppercase text-sm tracking-widest text-center sticky top-0 bg-gray-50 pb-2 border-b border-gray-200">Leaderboard</h3>
            <ul className="space-y-2">
              {topPlayers.map((player) => (
                <li key={player.name} className={`flex justify-between items-center p-3 rounded-lg border shadow-sm ${player.name === name ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-black ${player.position === 1 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-600'}`}>{player.position}</span>
                    <span className="font-bold text-gray-800">{player.name} {player.name === name && '(You)'}</span>
                  </div>
                  <span className="text-blue-600 font-mono font-bold">{player.score} pts</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            <button onClick={() => {
              sessionStorage.clear();
              window.location.href = '/';
            }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl transition-all">
              Home
            </button>
            <button onClick={handleAnswers} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-button active:translate-y-1 active:shadow-button-active transition-all flex items-center justify-center gap-2">
              <span>📝</span> View Answers
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Join Screen
  if (isGameTerminated) {
    return (
      <div className="min-h-screen bg-[#2563eb] flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-card p-10 flex flex-col items-center animate-fade-in-up">
          <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm border-4 border-red-50">
            🛑
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Game Ended</h2>
          <p className="text-gray-500 font-bold mb-8 text-lg px-4 leading-relaxed">
            The admin has ended the game.<br />
            <span className="text-sm text-gray-400 font-medium mt-2 block">Please ask for a new PIN to join.</span>
          </p>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-button active:translate-y-1 active:shadow-button-active transition-all text-xl flex items-center justify-center gap-2"
          >
            <span>🔄</span> Join New Game
          </button>
        </div>
      </div>
    )
  }

  if (!info) {
    return (
      <div className="min-h-screen bg-[#2563eb] flex flex-col items-center justify-center p-4 relative font-sans">

        {/* Navbar */}
        <nav className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 border border-transparent hover:border-white/20"
          >
            <FiArrowLeft size={20} /> Back
          </button>
        </nav>

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
    <div className="min-h-screen bg-[#2563eb] flex flex-col p-4 relative font-sans">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6 z-10 w-full max-w-6xl mx-auto text-white">
        <div className="font-bold hidden md:block">
          <span className="opacity-70">PIN:</span> {room}
        </div>
        <div className="font-bold bg-white/20 backdrop-blur px-4 py-1 rounded-full border border-white/10">
          {name}
        </div>
        <div className="flex items-center gap-3">
          {!isWaiting && seconds !== '' && (
            <div className="font-bold bg-white/20 backdrop-blur px-4 py-1 rounded-full flex items-center gap-2 border border-white/10">
              <span>{seconds}s</span>
            </div>
          )}
          <button
            onClick={leaveGame}
            className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full font-bold transition-all shadow-sm border border-white/10 backdrop-blur-sm active:scale-95"
            title="Leave Game"
          >
            <FiX size={24} />
          </button>
        </div>
      </div>

      {/* WAITING SCREEN */}
      {isWaiting ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full h-full pb-10">
          <div className="w-full h-full flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-xl animate-pulse">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl mb-8 ${isWaitingForResults ? 'bg-yellow-400/20 text-yellow-300' : 'bg-white/20 shadow-inner'}`}>
              {isWaitingForResults ? '🏆' : (autoCountdown ? '⏱️' : '⏳')}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{isWaitingForResults ? 'Quiz Completed!' : "Time's Up!"}</h2>
            <p className="text-blue-100 font-bold text-xl md:text-2xl max-w-2xl leading-relaxed">
              {isWaitingForResults ? 'Waiting for host to show results...' : (
                autoCountdown ? `Next question in ${autoCountdown}...` : 'Waiting for the next question...'
              )}
            </p>
          </div>
        </div>
      ) : question ? (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto z-10">
          <div className="bg-white text-gray-900 w-full p-6 md:p-10 rounded-2xl shadow-card mb-6 text-center min-h-[120px] md:min-h-[160px] flex items-center justify-center transform transition-all hover:scale-[1.01]">
            <h2 className="text-xl md:text-3xl font-black leading-snug">{question}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full flex-grow max-h-[60vh]">
            {options.map((answer, index) => {
              const bgColors = ['bg-red-500 hover:bg-red-600', 'bg-blue-500 hover:bg-blue-600', 'bg-yellow-500 hover:bg-yellow-600', 'bg-green-500 hover:bg-green-600'];
              const icons = ['▲', '◆', '●', '■'];
              const isSelected = selectedAnswerIndex === index;
              const isCorrect = correctAnswerIndex === index;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={`
                            relative w-full h-full rounded-2xl shadow-button flex items-center p-6 transition-all active:scale-[0.98] disabled:cursor-not-allowed
                            ${bgColors[index]}
                            ${answered && !isSelected ? 'opacity-50 grayscale-[0.5]' : ''}
                            ${isSelected ? 'ring-4 ring-white/50 scale-[1.02] z-10' : ''}
                          `}
                >
                  <span className="text-white/60 text-4xl md:text-5xl mr-6 font-black">{icons[index]}</span>
                  <span className="text-white text-xl md:text-3xl font-bold text-left leading-tight">{answer}</span>

                  {isCorrect && <div className="absolute top-4 right-4 bg-white text-green-600 rounded-full p-2 text-xl font-bold shadow-lg transform rotate-12">✓</div>}
                  {answered && isSelected && !isCorrect && correctAnswerIndex !== null && <div className="absolute top-4 right-4 bg-white text-red-500 rounded-full p-2 text-xl font-bold shadow-lg transform rotate-12">✕</div>}
                </button>
              )
            })}
          </div>

          {answered && !correctAnswerIndex && (
            <div className="mt-8 bg-black/30 backdrop-blur text-white px-8 py-3 rounded-full font-bold animate-pulse text-lg border border-white/10">
              Answer submitted! Good luck! 🤞
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 w-full h-full">
          <div className="w-full h-full flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-xl">
            <div className="w-32 h-32 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-6xl mb-6 animate-bounce shadow-lg ring-8 ring-blue-500/20">
              👑
            </div>
            <h2 className="text-4xl font-black text-white mb-4 drop-shadow-sm">You're in!</h2>
            <p className="text-blue-100 font-bold mb-10 text-xl">See your name on screen?</p>
            <div className="w-full max-w-sm bg-white/90 p-4 rounded-xl text-lg text-blue-900 font-black uppercase tracking-widest mb-12 shadow-lg animate-pulse">
              Waiting for host...
            </div>

            <button
              onClick={leaveGame}
              className="px-8 py-3 rounded-full border-2 border-red-300/50 text-red-100 font-bold hover:bg-red-500/20 hover:border-red-300 transition-all text-sm uppercase tracking-wide"
            >
              Leave Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
