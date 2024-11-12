import React, { useContext, useState, useEffect } from 'react';
import { Question } from '../../context/QuestionContext';
import './Host.css';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { FiUser } from 'react-icons/fi';
import { IoMdTime } from "react-icons/io";
import Confetti from 'react-confetti';

const socket = io('https://socket-kahoot.onrender.com', { autoConnect: false });
// const socket = io('http://localhost:3000', { autoConnect: false });

function Host() {
  const [isLoading, setIsLoading] = useState(false);
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [seconds, setSeconds] = useState(10);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [isQuestionActive, setIsQuestionActive] = useState(false);
  const [winner, setWinner] = useState(null); // State to track winner
  const [topPlayers, setTopPlayers] = useState([]); // State for leaderboard
  const { setRoom, room, mainQuestion } = useContext(Question);
  const navigate = useNavigate(); // Navigate hook from react-router-dom

  useEffect(() => {
    if (seconds === 0) return;

    const timeInterval = setInterval(() => {
      setSeconds((prevTime) => prevTime - 1);
    }, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  }, [seconds]);

  useEffect(() => {
    setIsLoading(true);

    socket.connect();

    socket.emit('joinRoom', { room: room, name: 'Host', questions: mainQuestion }, ({ users, room, isAdmin }) => {
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
      setWinner(winner); // Set winner state
      setTopPlayers(topPlayers); // Set top players state
      setIsQuestionActive(false); // Stop showing questions
      setQuestion(''); // Clear current question
      setOptions([]); // Clear options
      setSeconds(10); // Reset timer if needed

      // Redirect to winner page if needed
      // navigate('/winner'); // Uncomment this line if you want to redirect

      // Optionally, delete the room if needed
      // socket.emit('deleteRoom', room); // Assuming you have a deleteRoom event in your server

      // Clean up socket listeners and disconnect
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

  return winner ? (
    <div className="winner-div">
      <div className="winner">
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={true}
          numberOfPieces={600}
        />
        <h1 className="winner">Winner is "{winner.toUpperCase()}"</h1>
        <img src="trophy.png" alt="" />
      </div>
      <div className="leaderboard">
        <h2>Leaderboard </h2>
        <ul>
          {topPlayers.map((player, index) => (
            <li key={index}>
              {player.position}) {player.name} : {player.score}
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <div className={`host ${isQuestionActive ? 'question-active' : ''}`}>
      <div className="code">
        <div className="wrap">
          <div className="pin">Game pin:</div>
          {isLoading ? (
            <div className="pincode">Loading...</div>
          ) : (
            <div className="pincode">{room}</div>
          )}
        </div>
      </div>
      <div className="players">
        <div className="user-count">
          <FiUser />: {joinedUsers.filter((user) => user.name !== 'Host').length}
        </div>

        <div className="player-list">
          {joinedUsers.length === 0 ? (
            <div className="loading">Waiting For Users...</div>
          ) : (
            joinedUsers.filter((user) => user.name !== 'Host').map((user, index) => (
              <div key={index} className="users">
                {user.name}
              </div>
            ))
          )}
        </div>

        {!isQuestionActive && (
          <div className="start">
            <button 
              className="btn" 
              onClick={startGame} 
              disabled={joinedUsers.filter((user) => user.name !== 'Host').length === 0}
            >
              Start
            </button>
          </div>
        )}

        {question && (
          <div className="question">
            <h2>{question}</h2>
            <div className="time">
              <IoMdTime />
              Time remaining: {seconds}
            </div>
            <ul>
              {options.map((answer, index) => (
                <li key={index}>
                  <button
                    disabled={answered}
                    className={`options ${selectedAnswerIndex === index ? 'selected' : ''}`}
                  >
                    {answer}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Host;
