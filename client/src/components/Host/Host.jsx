import React, { useContext, useState, useEffect } from 'react';
import { Question } from '../../context/QuestionContext';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { FiUser } from 'react-icons/fi';
import { IoMdTime } from "react-icons/io";
import Confetti from 'react-confetti';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'https://triviarena-socketserver.onrender.com', { autoConnect: false });

function Host() {
  const [isLoading, setIsLoading] = useState(false);
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [seconds, setSeconds] = useState(10);
  const [isQuestionActive, setIsQuestionActive] = useState(false);

  const [isWaitingForNext, setIsWaitingForNext] = useState(false);
  const [isManualMode, setIsManualMode] = useState(true); // Default to Manual
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [autoCountdown, setAutoCountdown] = useState(null);
  const [answerCount, setAnswerCount] = useState(0);

  const [winner, setWinner] = useState(null);
  const [topPlayers, setTopPlayers] = useState([]);
  const { setRoom, room, mainQuestion, quiz } = useContext(Question);
  const navigate = useNavigate();

  // Precise Timer Logic
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    if (!endTime) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining <= 0) {
        // Any specific zero-logic here if needed, or rely on server event
      }
    }, 200);
    return () => clearInterval(interval);
  }, [endTime]);

  useEffect(() => {
    const handleReconnection = () => {
      // 1. Try to recover from Context or SessionStorage
      let currentRoom = room;
      let currentQuestions = mainQuestion;
      let currentQuiz = quiz;

      if (!currentRoom) {
        // Recovery Mode
        const storedRoom = sessionStorage.getItem('host_room');
        const storedQuestions = JSON.parse(sessionStorage.getItem('host_questions'));
        const storedQuiz = JSON.parse(sessionStorage.getItem('host_quiz'));

        if (storedRoom && storedQuestions) {
          currentRoom = storedRoom;
          currentQuestions = storedQuestions;
          currentQuiz = storedQuiz || {};

          // Restore Context
          setRoom(currentRoom);
          // Note context setters might not be exposed or working effectively inside this effect immediately, 
          // but we use the local variables for the socket emitted data.
        } else {
          // No room found, navigate back
          navigate('/dashboard');
          return;
        }
      } else {
        // Persist to SessionStorage for future refreshes
        sessionStorage.setItem('host_room', currentRoom);
        sessionStorage.setItem('host_questions', JSON.stringify(currentQuestions));
        sessionStorage.setItem('host_quiz', JSON.stringify(currentQuiz));
      }

      setIsLoading(true);
      socket.connect();

      socket.emit('joinRoom', {
        room: currentRoom,
        name: 'Host',
        questions: currentQuestions,
        quizConfig: { ...currentQuiz }
      }, ({ users, room, isAdmin, gameState, currentQuestion }) => {
        setRoom(room);
        setJoinedUsers(users);
        setIsLoading(false);

        // If reconnecting to an active game
        if (gameState === 'QUESTION_ACTIVE' && currentQuestion) {
          setQuestion(currentQuestion.question);
          setOptions(currentQuestion.answers);
          setSeconds(currentQuestion.timer);
          // Note: On reconnect, server currently sends full duration. 
          // Ideally server should send remaining time. 
          // For now, we restart the visual timer based on received value.
          setEndTime(Date.now() + (currentQuestion.timer * 1000));
          setIsQuestionActive(true);
          setIsWaitingForNext(false);
        } else if (gameState === 'WAITING_FOR_NEXT') {
          setIsQuestionActive(true);
          setIsWaitingForNext(true);
          setQuestion(currentQuestion?.question || "Waiting..."); // Display last question or placeholder
          setOptions(currentQuestion?.answers || []);
        }
      });
    };

    handleReconnection();

    socket.on('newQuestion', ({ question, answers, timer }) => {
      setQuestion(question);
      setOptions(answers);
      setSeconds(timer);
      setEndTime(Date.now() + (timer * 1000));
      setIsQuestionActive(true);
      setEndTime(Date.now() + (timer * 1000));
      setIsQuestionActive(true);
      setIsQuestionActive(true);
      setIsWaitingForNext(false); // Question started, no longer waiting
      setAutoCountdown(null);
      setAnswerCount(0);
    });

    socket.on('answerCountUpdate', ({ count }) => {
      setAnswerCount(count);
    });

    socket.on('questionEnded', ({ isLastQuestion, autoAdvance, nextQuestionDelay } = {}) => {
      setIsWaitingForNext(true); // Question ended, now waiting (if manual)
      if (isLastQuestion) setIsLastQuestion(true);

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

    socket.on('userJoined', ({ users }) => {
      setJoinedUsers(users);
    });

    socket.on('gameOver', ({ winner, topPlayers }) => {
      setWinner(winner);
      setTopPlayers(topPlayers);
      setIsQuestionActive(false);
      setQuestion('');
      setOptions([]);
      setSeconds(10);

      // Clear persistence
      sessionStorage.removeItem('host_room');
      sessionStorage.removeItem('host_questions');
      sessionStorage.removeItem('host_quiz');

      socket.off('newQuestion');
      socket.off('userJoined');
      socket.off('gameOver');
      socket.off('questionEnded');
      socket.disconnect();
    });

    return () => {
      socket.off('newQuestion');
      socket.off('userJoined');
      socket.off('gameOver');
      socket.off('questionEnded');
      socket.disconnect();
    };
  }, []);

  const startGame = () => {
    socket.emit('startGame', { room, isManualControl: isManualMode });
  };

  const handleNextQuestion = () => {
    socket.emit('nextQuestion', { room });
    setIsWaitingForNext(false); // Optimistic update
  };

  // Winner Screen
  // Winner Screen
  // Winner Screen
  if (winner) {
    return (
      <div className="min-h-screen bg-[#2563eb] flex flex-col items-center p-4 md:p-8 font-sans overflow-y-auto">
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={true} numberOfPieces={600} />

        {/* Navigation - Top Left Back Button */}
        <nav className="absolute top-0 left-0 w-full p-6 z-50 flex justify-start items-center pointer-events-none">
          <button
            onClick={() => navigate('/dashboard')}
            className="pointer-events-auto text-white hover:bg-white/10 px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 border border-transparent hover:border-white/20 backdrop-blur-sm"
          >
            <span>←</span> Back
          </button>
        </nav>

        {/* Header - Transparent on Background */}
        <div className="mb-16 md:mb-24 text-center z-10 pt-8 animate-fade-in-down">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-md tracking-tight">The Results</h1>
          <div className="bg-white/20 backdrop-blur-md px-6 py-1 rounded-full inline-block border border-white/20">
            <p className="text-white font-bold uppercase tracking-widest text-sm md:text-base">🎉 Congratulations! 🎉</p>
          </div>
        </div>

        {/* Podium Section - Standalone */}
        <div className="w-full max-w-4xl flex justify-center items-end h-[280px] md:h-[380px] gap-2 md:gap-6 mb-16 md:mb-24 z-10 px-4">
          {/* 2nd Place */}
          {topPlayers[1] && (
            <div className="flex flex-col items-center animate-slide-up animation-delay-500 relative group w-1/3 max-w-[150px]">
              <div className="mb-2 md:mb-4 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-lg">
                <span className="text-white font-bold text-xs md:text-sm">{topPlayers[1].score} pts</span>
              </div>
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-gray-300 bg-gray-100 flex items-center justify-center mb-[-1rem] md:mb-[-1.5rem] shadow-lg z-20 relative">
                <span className="text-gray-800 font-bold text-xs md:text-xl truncate max-w-[90%] px-1" title={topPlayers[1].name}>{topPlayers[1].name}</span>
              </div>
              <div className="w-full h-32 md:h-48 bg-gray-300 rounded-t-2xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-end pb-4 border-t border-white/30">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
                <span className="text-4xl md:text-6xl font-black text-white/50">2</span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {topPlayers[0] && (
            <div className="flex flex-col items-center z-20 animate-slide-up relative group w-1/3 max-w-[180px]">
              <div className="mb-2 md:mb-4 bg-yellow-400/20 backdrop-blur-sm border border-yellow-300/50 px-4 py-1.5 rounded-lg animate-bounce">
                <span className="text-yellow-100 font-bold text-sm md:text-lg">{topPlayers[0].score} pts</span>
              </div>
              <div className="absolute -top-16 md:-top-24 text-5xl md:text-7xl drop-shadow-2xl filter animate-float">👑</div>

              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-yellow-300 bg-yellow-100 flex items-center justify-center mb-[-1.5rem] md:mb-[-2rem] shadow-[0_0_30px_rgba(253,224,71,0.6)] z-20 relative">
                <span className="text-gray-900 font-black text-sm md:text-2xl truncate max-w-[90%] px-1" title={topPlayers[0].name}>{topPlayers[0].name}</span>
              </div>
              <div className="w-full h-48 md:h-64 bg-yellow-400 rounded-t-2xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-end pb-6 border-t border-white/40">
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/50 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <span className="text-6xl md:text-8xl font-black text-white">1</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topPlayers[2] && (
            <div className="flex flex-col items-center animate-slide-up animation-delay-1000 relative group w-1/3 max-w-[150px]">
              <div className="mb-2 md:mb-4 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-lg">
                <span className="text-white font-bold text-xs md:text-sm">{topPlayers[2].score} pts</span>
              </div>
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-orange-200 bg-orange-100 flex items-center justify-center mb-[-1rem] md:mb-[-1.5rem] shadow-lg z-20 relative">
                <span className="text-gray-800 font-bold text-xs md:text-xl truncate max-w-[90%] px-1" title={topPlayers[2].name}>{topPlayers[2].name}</span>
              </div>
              <div className="w-full h-24 md:h-40 bg-orange-400 rounded-t-2xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-end pb-4 border-t border-white/30">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
                <span className="text-4xl md:text-6xl font-black text-white/50">3</span>
              </div>
            </div>
          )}
        </div>

        {/* List Box - Separate Text Box Below */}
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl z-20 flex flex-col animate-slide-up animation-delay-1000 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-black text-gray-800">Runner Ups</h2>
            <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">{topPlayers.length} Players</span>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-0">
            {topPlayers.slice(3).length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-400 text-xs uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-3 font-bold">Rank</th>
                    <th className="px-6 py-3 font-bold">Player</th>
                    <th className="px-6 py-3 font-bold text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topPlayers.slice(3).map((player) => (
                    <tr key={player.position} className="hover:bg-blue-50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-gray-500 group-hover:text-blue-600">#{player.position}</td>
                      <td className="px-6 py-4 font-bold text-gray-800 text-lg">{player.name}</td>
                      <td className="px-6 py-4 font-black text-right text-blue-600 font-mono">{player.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-10 text-center text-gray-400">
                <span className="text-4xl block mb-2">🎈</span>
                <p className="font-bold">That's everyone! Great game!</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>🏠</span> Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Game Screen for Host
  return (
    <div className={`min-h-screen bg-[#2563eb] flex flex-col items-center p-6 relative font-sans ${isQuestionActive ? 'justify-start pt-6' : 'justify-center'}`}>

      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 text-9xl text-white transform -rotate-12">?</div>
        <div className="absolute bottom-10 right-10 text-9xl text-white transform rotate-12">!</div>
      </div>

      {/* Navigation - Top Left Back Button */}
      <nav className="absolute top-0 left-0 w-full p-6 z-50 flex justify-start items-center pointer-events-none">
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to leave? This will end the session for everyone.')) {
              navigate('/dashboard');
            }
          }}
          className="pointer-events-auto text-white hover:bg-white/10 px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 border border-transparent hover:border-white/20 backdrop-blur-sm"
        >
          <span>←</span> Back
        </button>
      </nav>

      {/* Top Header Row (PIN / Users) only in Lobby or small in game */}
      {!isQuestionActive ? (
        // LOBBY STATE
        <div className="z-10 w-full max-w-6xl flex flex-col h-[85vh] bg-white rounded-3xl shadow-card overflow-hidden">
          <div className="bg-white p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="flex flex-col">
              <span className="text-gray-500 font-bold uppercase tracking-wide text-xs md:text-sm">Join at</span>
              <span className="text-3xl md:text-4xl font-black text-blue-600">triviarena.xyz</span>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <span className="text-gray-500 font-bold uppercase tracking-wide text-xs md:text-sm">Game PIN</span>
              <span className="text-5xl md:text-6xl font-black text-gray-900 tracking-wider">{isLoading ? '...' : room}</span>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 md:px-5 md:py-2 rounded-full font-bold text-sm md:text-base">
                  <FiUser />
                  <span>{joinedUsers.filter((user) => user.name !== 'Host').length}</span>
                </div>

                {/* Mode Toggle */}
                <div
                  onClick={() => setIsManualMode(!isManualMode)}
                  className="flex items-center gap-2 md:gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors select-none"
                >
                  <span className={`text-xs md:text-sm font-bold ${isManualMode ? 'text-purple-600' : 'text-gray-400'}`}>Manual</span>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors relative ${!isManualMode ? 'bg-blue-600' : 'bg-purple-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${!isManualMode ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                  <span className={`text-xs md:text-sm font-bold ${!isManualMode ? 'text-blue-600' : 'text-gray-400'}`}>Auto</span>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-gray-400 animate-pulse text-center">Waiting for players...</h2>
              <button
                onClick={startGame}
                disabled={joinedUsers.filter((user) => user.name !== 'Host').length === 0}
                className="w-full md:w-auto bg-gray-800 text-white px-8 py-3 rounded font-black text-lg shadow-button hover:bg-black active:shadow-button-active active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Start
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              {joinedUsers.filter((user) => user.name !== 'Host').map((user, index) => (
                <div key={index} className="bg-white text-gray-800 font-black px-6 py-3 rounded shadow-sm border border-gray-200 animate-bounce-in transform hover:-rotate-2 transition-transform">
                  {user.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // GAME ACTIVE STATE
        <div className="z-10 w-full max-w-7xl flex flex-col h-full items-center">

          <div className="flex justify-between items-center w-full mb-6 text-white font-bold">
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">{answerCount} Answered</div>
            <div className="text-center">TriviArena</div>
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">PIN: {room}</div>
          </div>

          <div className="bg-white text-gray-900 w-full p-4 md:p-10 rounded shadow-card mb-4 md:mb-8 text-center min-h-[150px] md:min-h-[180px] flex items-center justify-center relative">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight">{question}</h2>

            {/* Timer Circle - Responsive Positioning */}
            {!isWaitingForNext && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 md:-left-16 md:top-1/2 md:translate-x-0 md:-translate-y-1/2 w-20 h-20 md:w-24 md:h-24 bg-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-20">
                <span className="text-2xl md:text-3xl font-black text-white">{seconds}</span>
              </div>
            )}

            {/* Show 'Time Up' or Status when waiting OR when timer hits 0 locally */}
            {(isWaitingForNext || seconds === 0) && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 md:-left-16 md:top-1/2 md:translate-x-0 md:-translate-y-1/2 w-20 h-20 md:w-24 md:h-24 bg-red-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-20">
                <span className="text-xs md:text-sm font-black text-white uppercase">Time Up</span>
              </div>
            )}

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full flex-1 min-h-[50vh] md:min-h-[350px] pb-20 md:pb-0">
            {options.map((answer, index) => {
              // Classic Kahoot Colors: Red, Blue, Yellow (Orangeish), Green
              const bgColors = ['bg-red-500 hover:bg-red-600', 'bg-blue-500 hover:bg-blue-600', 'bg-yellow-500 hover:bg-yellow-600', 'bg-green-500 hover:bg-green-600'];
              const icons = ['▲', '◆', '●', '■'];
              return (
                <div
                  key={index}
                  className={`
                            w-full h-full rounded shadow-button flex items-center p-8 transition-all active:shadow-button-active active:translate-y-1
                            ${bgColors[index]}
                            ${isWaitingForNext ? 'opacity-50 grayscale' : ''} 
                          `}
                >
                  <span className="text-white/80 text-5xl mr-6 font-black">{icons[index]}</span>
                  <span className="text-white text-3xl font-bold">{answer}</span>
                </div>
              )
            })}
          </div>

          {/* HOST CONTROLS - NEXT BUTTON or AUTO COUNTDOWN */}
          {isWaitingForNext && (
            <div className="fixed bottom-10 z-50 animate-bounce-in">
              {autoCountdown ? (
                <div className="bg-white/90 backdrop-blur border-4 border-purple-500 text-purple-700 px-10 py-4 rounded-full font-black text-2xl shadow-xl flex items-center gap-3 animate-pulse">
                  <span>⏳</span> Next Question in {autoCountdown}...
                </div>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className={`
                    bg-white text-gray-900 border-4 border-gray-900 px-10 py-4 rounded-full font-black text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3
                    ${isLastQuestion ? 'bg-yellow-300 border-yellow-500 text-yellow-900' : ''}
                  `}
                >
                  {isLastQuestion ? 'View Results 🏆' : 'Next Question ➜'}
                </button>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Host;
