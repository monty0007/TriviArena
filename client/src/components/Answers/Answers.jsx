import React, { useContext } from 'react';
import { Question } from '../../context/QuestionContext';
// import './Answers.css';

function Answers() {
  const { mainQuestion } = useContext(Question);
  console.log(mainQuestion);

  return (
    <div className="answers-container">
      {mainQuestion.map((question, questionIndex) => (
        <div key={questionIndex} className="question-block">
          <h3>Question {questionIndex + 1}: {question.question}</h3>
          <ul className="answer-list">
            {question.answerList.map((answer, answerIndex) => (
              <li key={answerIndex} className={`answer-item ${answer.isCorrect ? 'correct-answer' : ''}`}>
                {answer.body} {answer.isCorrect && <span>(Correct)</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Answers;
