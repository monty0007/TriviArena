import React, { useContext, useEffect, useState } from 'react'
import './Join.css'
import io from 'socket.io-client'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Question } from '../../context/QuestionContext'

const socket = io('http://localhost:3000')

export default function Join() {
  const [room, setRoom] = useState('')
  const [name, setName] = useState('')
  const [info, setInfo] = useState(false)
  const [question, setQuestion] = useState('')
  const [questionIndex, setquestionIndex] = useState('')
  const [options, setOptions] = useState([]) // Initialize options as an empty array
  const [scores, setScores] = useState([])
  const [seconds, setSeconds] = useState('')
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [winner, setWinner] = useState()

  function handleSubmit(e) {
    e.preventDefault()
    if (name && room) {
      setInfo(true)
    }
  }

  const handleAnswer = (answerIndex) => {
    if (!answered) {
      setSelectedAnswerIndex(answerIndex)
      socket.emit('submitAnswer', room, questionIndex, answerIndex, (data) => {
        if (data.isCorrect) {
          toast(`Correct! ${data.playerName} got it right`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            newestOnTop: false,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            draggable: true,
            pauseOnHover: true,
            theme: 'light',
          })
        }
        setScores(data.scores)
      })
      setAnswered(true)
    }
  }

  useEffect(() => {
    socket.on('message', (message) => {
      toast(`${message} joined`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: 'light',
      })
    })
    return () => socket.off('message')
  }, [])

  useEffect(() => {
    socket.on('gameStarted', () => {
      setInfo(true)
    })
    socket.on('newQuestion', ({ question }) => {
      setQuestion(question.question)
      setOptions(question.answers) // Update options with data.answers
      setSeconds(question.timer)
      setquestionIndex(question.questionIndex)
      setAnswered(false)
      setSelectedAnswerIndex(null) // Clear selected answer index
    })

    socket.on('gameOver', (data) => {
      setWinner(data.winner)
    })
    // Clean up socket listener
    return () => {
      socket.off('newQuestion')
      socket.off('answerResult')
      socket.off('gameOver')
      socket.off('gameStarted')
    }
  }, []) // Empty dependency array to run only once

  useEffect(() => {
    if (seconds === 0) return

    const timeInterval = setInterval(() => {
      setSeconds((prevTime) => prevTime - 1)
    }, 1000)
    return () => {
      clearInterval(timeInterval)
    }
  }, [seconds])

  if (winner) {
    return (
      <div className="winner-div">
        <h1 className="winner">Winner is "{winner.toUpperCase()}"</h1>
        <img src="tro.jpg" alt="" />
      </div>
    )
  }

  return (
    <div className="main-join">
      {!info ? (
        <div className="container">
          <img className="img1" src="loading-xrc.png" alt="" />
          <h1>XRCentral</h1>
          <form onSubmit={handleSubmit}>
            <div className="box">
              <div className="pin">
                <input
                  required
                  className="input"
                  value={name}
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  required
                  className="input"
                  value={room}
                  type="number"
                  placeholder="Game Pin"
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>
              <div className="button">
                <button
                  className="btn"
                  onClick={() => {
                    socket.emit(
                      'joinRoom',
                      { room, name },
                      ({ users, room }) => {
                        setRoom(room)
                      }
                    )
                  }}
                >
                  Join
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="quiz-join">
          <h1>XRCentral Quiz</h1>
          <p className="room-id">Room id : {room}</p>
          <ToastContainer />
          {question ? (
            <div className="quiz-div">
              <div className="time">Remaining Time: {seconds}</div>
              <div className="question">
                <p className="question-text">{question}</p>
              </div>
              <ul>
                {options.map((answer, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleAnswer(index)}
                      disabled={answered}
                      className={`options ${
                        selectedAnswerIndex === index ? 'selected' : ''
                      }`}
                    >
                      {answer}
                    </button>
                  </li>
                ))}
              </ul>
              {/* {scores.map((player, index) => (
                <p key={index}>
                  {player.name} : {player.score}
                </p>
              ))} */}

              {scores
                .filter((player) => player.name !== 'Host')
                .map((player, index) => (
                  <p key={index}>
                    {player.name} : {player.score}
                  </p>
                ))}
            </div>
          ) : (
            <p>Waiting For Host To Start</p>
          )}
        </div>
      )}
    </div>
  )
}
