import React, { useContext, useEffect, useState } from 'react';
import { Question } from '../../context/QuestionContext';

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
    if (displayQuestion) {
      displayQuestion.answerList.forEach((opt) => {
        if (opt.isCorrect === true) {
          setCorrectOption(opt.name);
          return;
        }
      });
    }
  }, [displayQuestion, mainQuestion, quiz]);

  return (
    <div className="mainbody">
      <div className="main-bodyinput">
        <input
          onChange={(e) => handleInputQuestion(e)}
          value={displayQuestion?.question || ''}
          className="mainbody-input"
          type="text"
          placeholder="Start typing your question"
        />
        <div className="image">
          Find and insert media
          <p>
            <input type="file" />
            <button disabled={uploading}>{uploading ? 'Uploading' : 'Upload Image'}</button>
          </p>
        </div>
      </div>
      <div className="answer">
        <div className="answer-1">
          <input
            onChange={(e) => handleOptions(e)}
            name="option1"
            value={displayQuestion?.answerList[0]?.body || ''}
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
            value={displayQuestion?.answerList[1]?.body || ''}
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
            value={displayQuestion?.answerList[2]?.body || ''}
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
            value={displayQuestion?.answerList[3]?.body || ''}
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
