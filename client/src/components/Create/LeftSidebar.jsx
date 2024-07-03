import React, { useContext, useEffect, useState } from 'react';
import { Question } from '../../context/QuestionContext';

function LeftSidebar() {
  const {
    setMainQuestion,
    mainQuestion,
    displayQuestion,
    setDisplayQuestion,
    quiz,
    setQuiz,
  } = useContext(Question);

  useEffect(() => {
    if (mainQuestion.length === 0) {
      const initialQuestion = {
        questionIndex: 1,
        backgroundImage: '',
        question: '',
        answerList: [
          { name: 'option1', body: '', isCorrect: false },
          { name: 'option2', body: '', isCorrect: false },
          { name: 'option3', body: '', isCorrect: false },
          { name: 'option4', body: '', isCorrect: false },
        ],
      };
      setMainQuestion([initialQuestion]);
      setDisplayQuestion(initialQuestion); // Set the first question as the display question
    }
  }, []);

  const [selectedQuestionId, setSelectedQuestionId] = useState(1); // Start with the first question selected
  const [qIndex, setQIndex] = useState(2); // Start from 2 since the first question is already added

  useEffect(() => {
    if (mainQuestion.length > 0) {
      setQIndex(mainQuestion.length + 1);
    }
  }, [mainQuestion]);

  const addQuestion = () => {
    const newQuestion = {
      questionIndex: qIndex,
      backgroundImage: '',
      question: '',
      answerList: [
        { name: 'option1', body: '', isCorrect: false },
        { name: 'option2', body: '', isCorrect: false },
        { name: 'option3', body: '', isCorrect: false },
        { name: 'option4', body: '', isCorrect: false },
      ],
    };

    setMainQuestion((prevQuestions) => [...prevQuestions, newQuestion]);
    setQuiz((prev) => ({
      ...prev,
      numberOfQuestions: prev.numberOfQuestions + 1,
    }));
    setQIndex(qIndex + 1);
  };

  const handleSlide = (q) => {
    setDisplayQuestion(q);
    setSelectedQuestionId(q.questionIndex);
  };

  const handleQuizName = (e) => {
    const quizName = e.target.value;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      name: quizName,
    }));
  };

  return (
    <div className="sidebar">
      <input
        type="text"
        placeholder="Quiz Name"
        onChange={handleQuizName}
        value={quiz.name || ''}
      />
      {mainQuestion.map((q, i) => (
        <div
          key={q.questionIndex}
          onClick={() => handleSlide(q)}
          className={`quiz ${q.questionIndex === selectedQuestionId ? 'selected' : ''}`}
        >
          <div className="quiz">
            <p className="quiz-p">{`Quiz ${i + 1}`}</p>
            <div className="question">
              <p className="question-p">{'Question'}</p>
              <div className="timer-image">
                <div className="timer">
                  <img
                    className="img3"
                    width={50}
                    height={50}
                    src={`/${q.image}`}
                    alt=""
                  />
                  <div className="text-block">
                    <p>20</p>
                  </div>
                </div>
                <div className="questionImage">
                  <img className="img4" src="defaultQuestionImage.svg" alt="" />
                </div>
              </div>
              <div className="rectangle">
                <img className="rectangle-image" src="rectangle.webp" alt="" />
                <img className="rectangle-image" src="rectangle.webp" alt="" />
                <img className="rectangle-image" src="rectangle.webp" alt="" />
                <img className="rectangle-image" src="rectangle.webp" alt="" />
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="add-button">
        <button
          onClick={addQuestion}
          className="btn"
          style={{ border: '1px solid black' }}
        >
          Add Question
        </button>
      </div>
    </div>
  );
}

export default LeftSidebar;
