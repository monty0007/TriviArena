import React, { useContext, useEffect, useState } from 'react';
import { Question } from '../../context/QuestionContext';
// import { fetchQuizes } from '../Api/Api'; // Adjust the path as per your file structure

function Mainbody() {
  const [uploading, setUploading] = useState(false);
  const [ques, setQues] = useState('');
  const [options, setOptions] = useState({
    option1: '',
    option2: '',
    option3: '',
    option4: '',
  });

  const { mainQuestion, setHeadingQuestion, setMainQuestion, displayQuestion, setDisplayQuestion, quiz, setQuiz } = useContext(Question);

  function handleInputQuestion(e) {
    const newQuestion = e.target.value;
    setQues(newQuestion);
    setDisplayQuestion(prev => ({
      ...prev,
      question: newQuestion
    }));
    setHeadingQuestion(newQuestion);
  }

  function handleOptions(e) {
    const { name, value } = e.target;
    setOptions(prev => ({
      ...prev,
      [name]: value
    }));
    setDisplayQuestion(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [name]: value
      }
    }));
  }

  async function handleSaveQuestion() {
    const answerList = Object.keys(options).map(key => ({
      name: key,
      body: options[key],
      isCorrect: false // Update this based on your logic
    }));
    const updatedDisplayQuestion = {
      ...displayQuestion,
      answerList: answerList
    };
    const updatedQuestions = mainQuestion.map(question =>
      question.id === displayQuestion.id ? updatedDisplayQuestion : question
    );
    const updatedQuiz = {
      ...quiz,
      questionList: quiz.questionList.map(question =>
        question.id === displayQuestion.id ? { ...question, answerList: answerList } : question
      )
    };

    setMainQuestion(updatedQuestions);
    setQuiz(updatedQuiz);

    // try {
    //   const response = await createQuiz(updatedQuiz);
    //   console.log('Quiz data saved successfully:', response);
    // } catch (error) {
    //   console.error('Error saving quiz data:', error);
    // }
  }

  return (
    <div className="mainbody">
      <div className="main-bodyinput">
        <input
          onChange={e => handleInputQuestion(e)}
          value={displayQuestion.question}
          className="mainbody-input"
          type="text"
          placeholder="Start typing your question"
        />
        <div className="image">
          Find and insert media
          <p>
            <input type="file" />
            <button disabled={uploading}>{uploading ? 'Uploading' : 'Upload Image'}</button>
            <button onClick={handleSaveQuestion}>Save Question</button>
          </p>
        </div>
      </div>
      <div className="answer">
        <div className="answer-1">
          <input
            onChange={e => handleOptions(e)}
            name="option1"
            value={options.option1}
            className="answer-input-1"
            type="text"
            placeholder="Add Answer 1"
          />
          <input
            onChange={e => handleOptions(e)}
            name="option2"
            value={options.option2}
            className="answer-input-3"
            type="text"
            placeholder="Add Answer 2"
          />
        </div>
        <div className="answer-2">
          <input
            onChange={e => handleOptions(e)}
            name="option3"
            value={options.option3}
            className="answer-input-2"
            type="text"
            placeholder="Add Answer 3"
          />
          <input
            onChange={e => handleOptions(e)}
            name="option4"
            value={options.option4}
            className="answer-input-4"
            type="text"
            placeholder="Add Answer 4"
          />
        </div>
      </div>
    </div>
  );
}

export default Mainbody;
