import React, { useContext, useEffect, useState } from 'react'
import { Question } from '../../context/QuestionContext'

function LeftSidebar() {
  const {
    setMainQuestion,
    mainQuestion,
    displayQuestion,
    setDisplayQuestion,
    headingQuestion,
    quiz,
    setQuiz,
  } = useContext(Question)
  const [selectedQuestionId, setSelectedQuestionId] = useState(null) // Add state for selected question
  const [qIndex, setQIndex] = useState(1)

  // pahli baar load hone pe check karenge agar questionlist > 1 hai kya agar ha to purane quiz ko add kar dnege aur qIndex ko uski length se aage badha denge
  useEffect(()=>{
    console.log(mainQuestion)
  }, [mainQuestion])

  const addQuestion = () => {
    // const id = 100000 + Math.floor(Math.random() * 900000)
    const newQuestion = {
      questionIndex: qIndex,
      backgroundImage: '',
      question: '',
      answerList: [
        {
          name: 'option1',
          body: '',
          isCorrect: false,
        },
        {
          name: 'option2',
          body: '',
          isCorrect: false,
        },
        {
          name: 'option3',
          body: '',
          isCorrect: false,
        },
        {
          name: 'option4',
          body: '',
          isCorrect: false,
        },
      ],
    }

    setQIndex(qIndex+1)
    setMainQuestion((prevQuestions) => [...prevQuestions, newQuestion])
    setQuiz((prev) => ({
      ...prev,
      numberOfQuestions: mainQuestion.length + 1,
    }))
    // console.log(quiz)
  }

  const handleSlide = (q) => {
    setDisplayQuestion(q)
    setSelectedQuestionId(q.questionIndex) // Update selected question ID
  }

  const handleQuizName = (e) => {
    e.preventDefault();
    const quizName = e.target.value;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      name: quizName,
    }));
    // console.log(quiz);
  };

  useEffect(() => {
    // console.log('slide : ', displayQuestion)
  }, [displayQuestion])

  return (
    <div className="sidebar">
      <input type="text" placeholder="Quiz Name" onChange={handleQuizName} />
      {mainQuestion.map((q, i) => (
        <div
          key={i}
          onClick={() => {
            handleSlide(q)
          }}
          className={`quiz ${q.questionIndex === selectedQuestionId ? 'selected' : ''}`} // Conditionally apply class
        >
          <div className="quiz">
            <p className="quiz-p">{`Quiz ${i + 1}`}</p>
            <div className="question">
              <p className="question-p">{'Question'}</p>{' '}
              {/* Update headingQuestion later */}
              {/* <p className="question-p">{headingQuestion || 'Question'}</p>{' '} */}
              {/* Display headingQuestion of each question */}
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
  )
}

export default LeftSidebar
