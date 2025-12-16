import React, { useContext, useState, useEffect } from 'react';
import { Question } from '../../context/QuestionContext';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { FiUser } from 'react-icons/fi';
import { IoMdTime } from "react-icons/io";
import Confetti from 'react-confetti';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', { autoConnect: false });

function Host() {
  const [isLoading, setIsLoading] = useState(false);
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [seconds, setSeconds] = useState(10);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [isQuestionActive, setIsQuestionActive] = useState(false);
  const [winner, setWinner] = useState(null);
  const [topPlayers, setTopPlayers] = useState([]);
  const { setRoom, room, mainQuestion, quiz } = useContext(Question);
  const navigate = useNavigate();

  useEffect(() => {
    if (seconds === 0) return;
    const timeInterval = setInterval(() => {
      setSeconds((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timeInterval);
  }, [seconds]);

  useEffect(() => {
    setIsLoading(true);
    socket.connect();

    socket.emit('joinRoom', { room: room, name: 'Host', questions: mainQuestion, quizConfig: { ...quiz } }, ({ users, room, isAdmin }) => {
      setRoom(room);
      setJoinedUsers(users);
      setIsLoading(false);
    });

    socket.on('newQuestion', ({ question, answers, timer }) => {
      setQuestion(question);
      setOptions(answers);
      setSeconds(timer);
      setAnswered(false);
      setSelectedAnswerIndex(null);
      setIsQuestionActive(true);
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
      socket.off('newQuestion');
      socket.off('userJoined');
      socket.off('gameOver');
      socket.disconnect();
    });

    return () => {
      socket.off('newQuestion');
      socket.off('userJoined');
      socket.off('gameOver');
      socket.disconnect();
    };
  }, []);

  const startGame = () => {
    socket.emit('startGame', { room });
  };

  // Winner Screen
  if (winner) {
    return (
      <div className="min-h-screen bg-[#2563eb] flex flex-col items-center justify-center p-4 text-center overflow-hidden relative font-sans">
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={true} numberOfPieces={600} />

        <div className="z-10 w-full max-w-4xl bg-white rounded-3xl shadow-card p-12">
          <h1 className="text-6xl font-black text-gray-900 mb-8">Podium</h1>

          <div className="flex justify-center items-end h-[400px] gap-4 mb-12">
            {/* 2nd Place */}
            {topPlayers[1] && (
              <div className="flex flex-col items-center animate-slide-up animation-delay-500">
                <div className="w-20 h-20 rounded-full border-4 border-gray-200 bg-gray-100 flex items-center justify-center mb-2 shadow-md">
                  <span className="text-gray-800 font-bold">{topPlayers[1].name}</span>
                </div>
                <div className="w-24 h-48 bg-gray-400 rounded-t-lg flex items-end justify-center pb-4 text-3xl font-black text-white shadow-lg">2</div>
              </div>
            )}
            {/* 1st Place */}
            {topPlayers[0] && (
              <div className="flex flex-col items-center z-10 animate-slide-up">
                <div className="w-24 h-24 rounded-full border-4 border-yellow-200 bg-yellow-100 flex items-center justify-center mb-2 shadow-lg">
                  <span className="text-gray-800 font-bold text-xl">{topPlayers[0].name}</span>
                </div>
                <div className="w-32 h-64 bg-yellow-400 rounded-t-lg flex items-end justify-center pb-4 text-5xl font-black text-white shadow-xl">
                  1
                </div>
              </div>
            )}
            {/* 3rd Place */}
            {topPlayers[2] && (
              <div className="flex flex-col items-center animate-slide-up animation-delay-1000">
                <div className="w-20 h-20 rounded-full border-4 border-orange-200 bg-orange-100 flex items-center justify-center mb-2 shadow-md">
                  <span className="text-gray-800 font-bold">{topPlayers[2].name}</span>
                </div>
                <div className="w-24 h-32 bg-orange-400 rounded-t-lg flex items-end justify-center pb-4 text-3xl font-black text-white shadow-lg">3</div>
              </div>
            )}
          </div>

          <button onClick={() => navigate('/dashboard')} className="bg-gray-800 text-white font-bold py-4 px-10 rounded shadow-button hover:bg-black active:shadow-button-active active:translate-y-1 transition-all text-xl">
            Back to Dashboard
          </button>
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

      {/* Top Header Row (PIN / Users) only in Lobby or small in game */}
      {!isQuestionActive ? (
        // LOBBY STATE
        <div className="z-10 w-full max-w-6xl flex flex-col h-[85vh] bg-white rounded-3xl shadow-card overflow-hidden">
          <div className="bg-white p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-gray-500 font-bold uppercase tracking-wide text-sm">Join at</span>
              <span className="text-4xl font-black text-blue-600">triviarena.com</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-gray-500 font-bold uppercase tracking-wide text-sm">Game PIN</span>
              <span className="text-6xl font-black text-gray-900 tracking-wider">{isLoading ? '...' : room}</span>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2 rounded-full font-bold">
                <FiUser />
                <span>{joinedUsers.filter((user) => user.name !== 'Host').length}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-400 animate-pulse">Waiting for players...</h2>
              <button
                onClick={startGame}
                disabled={joinedUsers.filter((user) => user.name !== 'Host').length === 0}
                className="bg-gray-800 text-white px-8 py-3 rounded font-black text-lg shadow-button hover:bg-black active:shadow-button-active active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">{joinedUsers.length - 1} Answers</div>
            <div className="text-center">TriviArena</div>
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full">PIN: {room}</div>
          </div>

          <div className="bg-white text-gray-900 w-full p-10 rounded shadow-card mb-8 text-center min-h-[180px] flex items-center justify-center relative">
            <h2 className="text-4xl md:text-5xl font-black leading-tight">{question}</h2>

            {/* Timer Circle - Responsive Positioning */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 md:-left-16 md:top-1/2 md:translate-x-0 md:-translate-y-1/2 w-20 h-20 md:w-24 md:h-24 bg-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-20">
              <span className="text-2xl md:text-3xl font-black text-white">{seconds}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-[350px]">
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
                          `}
                >
                  <span className="text-white/80 text-5xl mr-6 font-black">{icons[index]}</span>
                  <span className="text-white text-3xl font-bold">{answer}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  );
}

export default Host;
