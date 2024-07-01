import React, { useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Question } from '../../context/QuestionContext';
import io from 'socket.io-client';
import { updateQuiz, createQuiz } from '../Api/Api';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 from uuid package // Assuming these are imported from correct path

export default function Navbar() {
  let navigate = useNavigate();
  let location = useLocation();
  const socket = io('http://localhost:3000');

  const {
    mainQuestion,
    quiz,
    setQuiz,
    displayQuestion,
    setMainQuestion,
  } = useContext(Question);

  const handleSave = async () => {
    const updatedQuestions = mainQuestion.map((question) =>
      question.questionIndex === displayQuestion.questionIndex ? displayQuestion : question
    );

    setMainQuestion(updatedQuestions);

    const newQuizId = quiz._id || uuidv4();

    const updatedQuiz = {
      ...quiz,
      _id: newQuizId,
      questionList: updatedQuestions,
      numberOfQuestions: updatedQuestions.length,
    };

    setQuiz(updatedQuiz);

    try {
      if (quiz._id) {
        console.log("Updating quiz with id: ", quiz._id);
        await updateQuiz(quiz._id, updatedQuiz);
      } else {
        console.log("Creating new quiz");
        await createQuiz(updatedQuiz);
      }
      console.log('Data sent successfully');
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const handleHost = () => {
    navigate('/host');
  };

  const routeChange = () => {
    navigate('/');
  };

  return (
    <div className='main'>
      <div className="title">
        <img className='img2' src="loading-xrc.png" alt="" />
        <Link className='link' to='/'>XrCentral</Link>
      </div>
      <div className=''>
        <button className='navbar-btn' onClick={routeChange}>Exit</button>
        {location.pathname === '/create' && (
          <>
            <button className='navbar-btn' onClick={handleSave}>Save</button>
            <button className='navbar-btn' onClick={handleHost}>Host</button>
          </>
        )}
      </div>
      <div className='search'>
        <input className='input2' type="text" placeholder='Enter Game Title' />
        <button className='navbar-btn'>Search</button>
      </div>
    </div>
  );
}
