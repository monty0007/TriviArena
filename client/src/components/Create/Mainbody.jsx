import React, { useContext, useEffect, useState } from 'react';
import { Question } from '../../context/QuestionContext';
import { createQuiz, updateQuiz } from '../Api/Api';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 from uuid package

function Mainbody() {
  const [uploading, setUploading] = useState(false);
  const [ques, setQues] = useState('');
  const [options, setOptions] = useState({
    option1: '',
    option2: '',
    option3: '',
    option4: '',
  });
  const [correctOption, setCorrectOption] = useState('');

  const {
    mainQuestion,
    setHeadingQuestion,
    setMainQuestion,
    displayQuestion,
    setDisplayQuestion,
    quiz,
    setQuiz,
    id,
  } = useContext(Question);

  useEffect(() => {
    if (!displayQuestion) {
      setDisplayQuestion({
        question: '',
        answerList: [
          { name: 'option1', body: '', isCorrect: false },
          { name: 'option2', body: '', isCorrect: false },
          { name: 'option3', body: '', isCorrect: false },
          { name: 'option4', body: '', isCorrect: false },
        ],
        questionIndex: mainQuestion.length,
      });
    }
  }, [displayQuestion, mainQuestion]);

  function handleInputQuestion(e) {
    const newQuestion = e.target.value;
    setQues(newQuestion);
    setDisplayQuestion((prev) => ({
      ...prev,
      question: newQuestion,
    }));
    setHeadingQuestion(newQuestion);
  }

  function handleOptions(e) {
    const { name, value } = e.target;
    setOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
    setDisplayQuestion((prev) => ({
      ...prev,
      answerList: prev.answerList.map((option) => {
        if (option.name === name) {
          return { ...option, body: value, isCorrect: correctOption === name };
        }
        return option;
      }),
    }));
  }

  function handleRadio(e) {
    const { name } = e.target;
    setCorrectOption(name);
    setDisplayQuestion((prev) => ({
      ...prev,
      answerList: prev.answerList.map((option) => {
        if (option.name === name) {
          return { ...option, isCorrect: true };
        }
        return { ...option, isCorrect: false };
      }),
    }));
  }

  useEffect(() => {
    console.log('quiz:', quiz);
  }, [displayQuestion, mainQuestion, quiz]);

  async function handleSaveQuestion() {
    const updatedQuestions = mainQuestion.map((question) =>
      question.questionIndex === displayQuestion.questionIndex ? displayQuestion : question
    );
  
    setMainQuestion(updatedQuestions);
  
    // Generate a new ID if it doesn't exist (for new quiz creation)
    const newQuizId = quiz._id || uuidv4();
    console.log(newQuizId);
  
    // Create an updated quiz object
    const updatedQuiz = {
      ...quiz,
      _id: newQuizId,
      questionList: updatedQuestions,
      numberOfQuestions: updatedQuestions.length,
    };
  
    setQuiz(updatedQuiz);
  
    try {
      // If id exists, update the quiz; otherwise, create a new quiz
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
  }
  
  return (
    <div className="mainbody">
      <div className="main-bodyinput">
        <input
          onChange={(e) => handleInputQuestion(e)}
          value={displayQuestion.question}
          className="mainbody-input"
          type="text"
          placeholder="Start typing your question"
        />
        <div className="image">
          Find and insert media
          <p>
            <input type="file" />
            <button disabled={uploading}>
              {uploading ? 'Uploading' : 'Upload Image'}
            </button>
            <button onClick={handleSaveQuestion}>Save Question</button>
          </p>
        </div>
      </div>
      <div className="answer">
        <div className="answer-1">
          <input
            onChange={(e) => handleOptions(e)}
            name="option1"
            value={options.option1}
            className="answer-input-1"
            type="text"
            placeholder="Add Answer 1"
          />
          <input
            type="radio"
            name="option1"
            id="option1"
            checked={correctOption === 'option1'}
            onChange={handleRadio}
            className="custom-radio"
          />
          <label htmlFor="option1"></label>
          <input
            onChange={(e) => handleOptions(e)}
            name="option2"
            value={options.option2}
            className="answer-input-3"
            type="text"
            placeholder="Add Answer 2"
          />
          <input
            type="radio"
            name="option2"
            id="option2"
            checked={correctOption === 'option2'}
            onChange={handleRadio}
            className="custom-radio"
          />
          <label htmlFor="option2"></label>
        </div>
        <div className="answer-2">
          <input
            onChange={(e) => handleOptions(e)}
            name="option3"
            value={options.option3}
            className="answer-input-2"
            type="text"
            placeholder="Add Answer 3"
          />
          <input
            type="radio"
            name="option3"
            id="option3"
            checked={correctOption === 'option3'}
            onChange={handleRadio}
            className="custom-radio"
          />
          <label htmlFor="option3"></label>
          <input
            onChange={(e) => handleOptions(e)}
            name="option4"
            value={options.option4}
            className="answer-input-4"
            type="text"
            placeholder="Add Answer 4"
          />
          <input
            type="radio"
            name="option4"
            id="option4"
            checked={correctOption === 'option4'}
            onChange={handleRadio}
            className="custom-radio"
          />
          <label htmlFor="option4"></label>
        </div>
      </div>
    </div>
  );
}

export default Mainbody;
