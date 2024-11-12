import React, { useContext, useEffect, useState } from 'react'
import { Question } from '../../context/QuestionContext'
import { AiOutlineDelete } from "react-icons/ai";
import Swal from 'sweetalert2';


function LeftSidebar() {
  const {
    setMainQuestion,
    mainQuestion,
    displayQuestion,
    setDisplayQuestion,
    quiz,
    setQuiz,
  } = useContext(Question)

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
      }
      setMainQuestion([initialQuestion])
      setDisplayQuestion(initialQuestion) // Set the first question as the display question
    }
  }, [])

  const [selectedQuestionId, setSelectedQuestionId] = useState(1) // Start with the first question selected
  const [qIndex, setQIndex] = useState(2) // Start from 2 since the first question is already added

  useEffect(() => {
    if (mainQuestion.length > 0) {
      setQIndex(mainQuestion.length + 1)
    }
  }, [mainQuestion])

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
    }

    setMainQuestion((prevQuestions) => [...prevQuestions, newQuestion])
    setQuiz((prev) => ({
      ...prev,
      numberOfQuestions: prev.numberOfQuestions + 1,
    }))
    setQIndex(qIndex + 1)
  }

  const handleSlide = (q) => {
    setDisplayQuestion(q)
    setSelectedQuestionId(q.questionIndex)
  }

  const handleQuizName = (e) => {
    const quizName = e.target.value
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      name: quizName,
    }))
  }

  const handleDelete = (e, questionIndex) => {
    e.stopPropagation(); // Prevent the parent click event

    if (questionIndex === 1) {
      Swal.fire({
        icon: 'error',
        title: "Can't delete the only question in your quiz",
        text: 'To make a game engaging, we recommend adding at least one question.',
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          setMainQuestion((prevQuestions) =>
            prevQuestions.filter((q) => q.questionIndex !== questionIndex)
          );
          if (displayQuestion.questionIndex === questionIndex) {
            setDisplayQuestion(mainQuestion.length > 1 ? mainQuestion[0] : null);
          }
          setQuiz((prev) => ({
            ...prev,
            numberOfQuestions: prev.numberOfQuestions - 1,
          }));
          Swal.fire({
            title: 'Deleted!',
            text: 'Your question has been deleted.',
            icon: 'success',
          });
        }
      });
    }
  };
  console.log(mainQuestion);
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
          className={`quiz-wrapper ${q.questionIndex === selectedQuestionId ? 'selected' : ''}`}
        >
          <div className="quiz">
            <div className="quiz-name">
              <div className="name">
                {`Quiz ${i + 1}`}
              </div>
              <div className="delete" onClick={(e) => handleDelete(e, q.questionIndex)}>
                <AiOutlineDelete /> 
              </div>
            </div>
            <div className="question">
              <p className="question-p">{'Question'}</p>
              <div className="timer-image">
                <div className="timer">
                  {/* <img
                    className="img3"
                    width={50}
                    height={50}
                    src={`/${q.image}`}
                    alt=""
                  /> */}
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
  )
}

export default LeftSidebar
