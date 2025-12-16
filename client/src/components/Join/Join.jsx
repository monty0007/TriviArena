import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000');

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
  const [isWaiting, setIsWaiting] = useState(false); // New state for waiting screen
  const [isWaitingForResults, setIsWaitingForResults] = useState(false); // NEW: Waiting for final results
  const [autoCountdown, setAutoCountdown] = useState(null); // Countdown for auto-advance
  const [quizHistory, setQuizHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  /* REMOVED AUTO-RECONNECT LOGIC */

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
    window.location.reload(); // Ensure clean state
  };

  const handleAnswers = () => {
    setShowHistory(true);
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

  // Precise Timer Logic
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    if (!endTime) return;

    const timerInterval = setInterval(() => {
      const remaining = Math.ceil((endTime - Date.now()) / 1000);

      if (remaining <= 0) {
        setSeconds(0);
        // Only trigger waiting if we haven't answered and aren't already waiting
        if (!isWaiting && !answered && !correctAnswerIndex && question) {
          // We let the useEffect dependency on 'seconds' handle the transition or valid here
          // But actually checking 'seconds === 0' in another effect is safer 
          // to trigger shared logic.
        }
      } else {
        setSeconds(remaining);
      }
    }, 200); // Check 5 times a second for better precision

    return () => clearInterval(timerInterval);
  }, [endTime, isWaiting, answered, correctAnswerIndex, question]);

  // Handle zeroing out transition
  useEffect(() => {
    if (seconds <= 0 && !isWaiting && !answered && !correctAnswerIndex && question) {
      setIsWaiting(true);
    }
  }, [seconds, isWaiting, answered, correctAnswerIndex, question]);

  // Listen for Server Events
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
      // Synchronize time: Current Time + Timer Duration
      // We assume negligible network latency or that server adds grace period.
      // Server gives 1s grace, so we aim to finish slightly before/at server limit.
      const durationMs = timer * 1000;
      setEndTime(Date.now() + durationMs);
      setSeconds(timer);

      setAnswered(false);
      setSelectedAnswerIndex(null);
      setCorrectAnswerIndex(null);
      setIsWaiting(false);
      setAutoCountdown(null); // Reset countdown
    });

    socket.on('questionEnded', ({ isLastQuestion, autoAdvance, nextQuestionDelay } = {}) => {
      setEndTime(null); // Stop local timer
      setSeconds(0); // Force display to 0
      setIsWaiting(true);
      if (isLastQuestion) setIsWaitingForResults(true);

      if (autoAdvance && nextQuestionDelay) {
        // Start Countdown (e.g., 4000ms -> 3s display)
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

    return () => {
      socket.off('newQuestion');
      socket.off('answerResult');
      socket.off('gameOver');
      socket.off('gameStarted');
      socket.off('questionEnded');
    };
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
  if (!info) {
    return (
      <div className="min-h-screen bg-[#2563eb] flex flex-col items-center justify-center p-4 relative font-sans">

        {/* Navbar */}
        <nav className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 border border-transparent hover:border-white/20"
          >
            <span>←</span> Back
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

      <div className="flex justify-between items-center mb-6 z-10 w-full max-w-4xl mx-auto text-white">
        <div className="font-bold hidden md:block">
          <span className="opacity-70">PIN:</span> {room}
        </div>
        <div className="font-bold bg-white/20 backdrop-blur px-4 py-1 rounded-full">
          {name}
        </div>
        <div className="flex items-center gap-3">
          <div className="font-bold bg-white/20 backdrop-blur px-4 py-1 rounded-full flex items-center gap-2">
            <span>{seconds}</span>
          </div>
          <button
            onClick={leaveGame}
            className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full font-bold text-xs uppercase tracking-wide transition-all shadow-sm"
            title="Leave Game"
          >
            ✕
          </button>
        </div>
      </div>

      {/* WAITING SCREEN */}
      {isWaiting ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 pb-20">
          <div className="w-full max-w-lg bg-white/10 backdrop-blur p-10 rounded-3xl border border-white/20 shadow-xl flex flex-col items-center animate-pulse">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-6 ${isWaitingForResults ? 'bg-yellow-400/20 text-yellow-300' : 'bg-white/20'}`}>
              {isWaitingForResults ? '🏆' : (autoCountdown ? '⏱️' : '⏳')}
            </div>
            <h2 className="text-3xl font-black text-white mb-2">{isWaitingForResults ? 'Quiz Completed!' : "Time's Up!"}</h2>
            <p className="text-blue-100 font-bold text-lg">
              {isWaitingForResults ? 'Waiting for host to show results...' : (
                autoCountdown ? `Next question in ${autoCountdown}...` : 'Waiting for the next question...'
              )}
            </p>
          </div>
        </div>
      ) : question ? (
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
          <div className="w-full max-w-md bg-white rounded-xl shadow-card p-6 md:p-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl mb-4 animate-bounce shadow-sm">
              👑
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">You're in!</h2>
            <p className="text-gray-500 font-bold mb-8">See your name on screen?</p>
            <div className="w-full bg-gray-100 p-3 rounded text-sm text-gray-500 font-bold uppercase tracking-wide mb-6">
              Waiting for host
            </div>

            <button
              onClick={leaveGame}
              className="px-6 py-2 rounded-full border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 hover:border-red-200 transition-colors text-sm"
            >
              Leave Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


