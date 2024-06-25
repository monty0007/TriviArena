import React, { useContext, useState, useEffect } from 'react'
import { Question } from '../../context/QuestionContext'
import './Host.css'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import { FiUser } from 'react-icons/fi'
import { IoMdTime } from "react-icons/io";

const socket = io('http://localhost:3000')

function Host() {
  const [isLoading, setIsLoading] = useState(false)
  const [joinedUsers, setJoinedUsers] = useState([]) // Add a state to store the joined users
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState([])
  const [seconds, setSeconds] = useState(10)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
  const [isQuestionActive, setIsQuestionActive] = useState(false) // New state for tracking if question is active
  const { setRoom, room } = useContext(Question)
  let navigate = useNavigate()

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
    socket.emit(
      'joinRoom',
      { room: room, name: 'Host' },
      ({ users, room, isAdmin }) => {
        setRoom(room)
        setJoinedUsers(users)
        setIsLoading(false)
      }
    )
    socket.on('newQuestion', ({question, answers, timer}) => {
      setQuestion(question);
      setOptions(answers); 
      setSeconds(timer);
      setAnswered(false)
      setSelectedAnswerIndex(null)
      setIsQuestionActive(true); // Set question active state to true
    });
    socket.on('userJoined', ({ users }) => {
      setJoinedUsers(users) // Update the joinedUsers state
    })
    setIsLoading(true)

    return () => {
      socket.off('newQuestion');
    }
  }, [])

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
          <FiUser />: {joinedUsers.length}
        </div>

        <div className="player-list">
          {joinedUsers.length === 0 ? (
            <div className="loading">Waiting For Users...</div>
          ) : (
            joinedUsers.map((user, index) => (
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
              onClick={() => {
                socket.emit('startGame', { room })
              }}
            >
              Start
            </button>
          </div>
        )}
        {question && (
          <div className="question">
            <h2>{question}</h2>
            <IoMdTime />
            <p>Time remaining: {seconds}</p>
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
  )
}

export default Host