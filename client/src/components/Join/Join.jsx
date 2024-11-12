import React, { useEffect, useState } from 'react';
import './Join.css';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

const socket = io('https://socket-kahoot.onrender.com');
// const socket = io('http://localhost:3000');

export default function Join() {
  const navigate=useNavigate()
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [info, setInfo] = useState(false);
  const [question, setQuestion] = useState('');
  const [questionIndex, setQuestionIndex] = useState('');
  const [options, setOptions] = useState([]); // Initialize options as an empty array
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

  const handleAnswers=()=>{
    navigate('/answers')
  }


  const handleAnswer = (answerIndex) => {
    if (!answered) {
      setSelectedAnswerIndex(answerIndex);
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
          });
          setCorrectAnswerIndex(answerIndex);
        } else {
          toast(`Incorrect! ${data.playerName} chose the wrong answer`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            newestOnTop: false,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            draggable: true,
            pauseOnHover: true,
            theme: 'light',
          });
          setCorrectAnswerIndex(data.correctIndex); // Assuming server returns the correct answer index
        }
        setScores(data.scores);
      });
      setAnswered(true);
    }
  };

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
      });
    });
    return () => socket.off('message');
  }, []);

  useEffect(() => {
    socket.on('gameStarted', () => {
      setInfo(true);
    });
    socket.on('newQuestion', ({ question }) => {
      setQuestion(question.question);
      setOptions(question.answers); // Update options with data.answers
      setSeconds(question.timer);
      setQuestionIndex(question.questionIndex);
      setAnswered(false);
      setSelectedAnswerIndex(null); // Clear selected answer index
      setCorrectAnswerIndex(null);
    });

    socket.on('gameOver', (data) => {
      setWinner(data.winner);
      setTopPlayers(data.topPlayers);
    });
    // Clean up socket listener
    return () => {
      socket.off('newQuestion');
      socket.off('answerResult');
      socket.off('gameOver');
      socket.off('gameStarted');
    };
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (seconds === 0) return;

    const timeInterval = setInterval(() => {
      setSeconds((prevTime) => prevTime - 1);
    }, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  }, [seconds]);

  if (winner) {
    return (
      <div className="winner-div">
         <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={true}
          numberOfPieces={600}
        />
        <div className="winner">
          <h1 className="winner">Winner is "{winner.toUpperCase()}"</h1>
          <img src="trophy.png" alt="trophy" />
        </div>
        <div className="leaderboard">
          <h2>Leaderboard</h2>
          <ul>
            {topPlayers.map((player) => (
              <li key={player.name}>
                {player.position}) {player.name} : {player.score}
              </li>
            ))}
          </ul>
        </div>
          <button className='btn' onClick={handleAnswers}>Answers</button>
      </div>
    );
  }

  const firstHalfOptions = Array.isArray(options) ? options.slice(0, 2) : [];
  const secondHalfOptions = Array.isArray(options) ? options.slice(2, 4) : [];

  return (
    <div className="main-join">
      {!info ? (
        <div className="join">
          <img className="img1" src="quiz.png" alt="loading" />
          {/* <h1>XRCentral</h1> */}
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
                <button className="btn" type="submit">
                  Join
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="quiz-join">
          <h1>XRCentral Quiz</h1>
          <p className="room-id">Room Id : {room}</p>
          <ToastContainer />
          {question ? (
            <div className="quiz-div">
              <div className="time">Remaining Time: {seconds}</div>
              <div className="question">
                <p className="question-text">{question}</p>
              </div>
              <div className="optione">
                <div className="option-group">
                  {firstHalfOptions.map((answer, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleAnswer(index)}
                        disabled={answered}
                        className={`options 
                          ${selectedAnswerIndex === index ? 'selected' : ''}
                          ${correctAnswerIndex === index ? 'correct' : ''}
                          ${answered && correctAnswerIndex !== index && index === selectedAnswerIndex ? 'incorrect' : ''}
                        `}
                      >
                        {answer}
                      </button>
                    </li>
                  ))}
                </div>
                <div className="option-group">
                  {secondHalfOptions.map((answer, index) => (
                    <li key={index + 2}>
                      <button
                        onClick={() => handleAnswer(index + 2)}
                        disabled={answered}
                        className={`options 
                          ${selectedAnswerIndex === index + 2 ? 'selected' : ''}
                          ${correctAnswerIndex === index + 2 ? 'correct' : ''}
                          ${answered && correctAnswerIndex !== index + 2 && index + 2 === selectedAnswerIndex ? 'incorrect' : ''}
                        `}
                      >
                        {answer}
                      </button>
                    </li>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p>Waiting For Host To Start</p>
          )}
        </div>
      )}
    </div>
  );
}


