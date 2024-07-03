import React, { useContext, useState, useEffect } from 'react';
import { Question } from '../../context/QuestionContext';
import './Host.css';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { FiUser } from 'react-icons/fi';
import { IoMdTime } from "react-icons/io";

const socket = io('http://localhost:3000', { autoConnect: false });

function Host() {
  const [isLoading, setIsLoading] = useState(false);
  const [joinedUsers, setJoinedUsers] = useState([]); 
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [seconds, setSeconds] = useState(10);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [isQuestionActive, setIsQuestionActive] = useState(false); 
  const { setRoom, room, mainQuestion } = useContext(Question);

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

    return () => {
      socket.off('newQuestion');
      socket.off('userJoined');
      socket.disconnect();
    };
  }, []);

  const startGame = () => {
    socket.emit('startGame', { room });
  };

  return (
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
            <button className="btn" onClick={startGame}>
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
