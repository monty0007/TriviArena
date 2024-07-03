import React, { useContext, useEffect, useState } from 'react';
import { Question } from '../../context/QuestionContext';

function Mainbody() {
  const [uploading, setUploading] = useState(false);
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
    if (mainQuestion.length > 0 && !displayQuestion) {
      setDisplayQuestion(mainQuestion[0]);
    }
  }, [displayQuestion, mainQuestion]);

  const handleInputQuestion = (e) => {
    const newQuestion = e.target.value;
    setDisplayQuestion((prev) => ({
      ...prev,
      question: newQuestion,
    }));
    setHeadingQuestion(newQuestion);
    updateMainQuestion({ question: newQuestion });
  };

  const handleOptions = (e) => {
    const { name, value } = e.target;
    setDisplayQuestion((prev) => ({
      ...prev,
      answerList: prev.answerList.map((option) => {
        if (option.name === name) {
          return { ...option, body: value, isCorrect: correctOption === name };
        }
        return option;
      }),
    }));
    updateMainQuestion({
      answerList: displayQuestion.answerList.map((option) =>
        option.name === name ? { ...option, body: value, isCorrect: correctOption === name } : option
      ),
    });
  };

  const handleRadio = (e) => {
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
    updateMainQuestion({
      answerList: displayQuestion.answerList.map((option) =>
        option.name === name ? { ...option, isCorrect: true } : { ...option, isCorrect: false }
      ),
    });
  };

  const updateMainQuestion = (updatedFields) => {
    setMainQuestion((prevQuestions) =>
      prevQuestions.map((question) =>
        question.questionIndex === displayQuestion.questionIndex
          ? { ...question, ...updatedFields }
          : question
      )
    );
  };

  return (
    <div className="mainbody">
      <div className="main-bodyinput">
        <input
          onChange={handleInputQuestion}
          value={displayQuestion?.question || ''}
          className="mainbody-input"
          type="text"
          placeholder="Start typing your question"
        />
        <div className="image">
          <img className='xrc' src="loading-xrc.png" alt="" />
          <p></p>
        </div>
      </div>
      <div className="answer">
        <div className="answer-1">
          <input
            onChange={handleOptions}
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
            onChange={handleOptions}
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
            onChange={handleOptions}
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
            onChange={handleOptions}
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
