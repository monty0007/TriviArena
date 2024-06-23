import React, { useContext, useEffect, useState } from 'react'
import { Question } from '../../context/QuestionContext'

function LeftSidebar() {
  const {
    setMainQuestion,
    mainQuestion,
    displayQuestion,
    setDisplayQuestion,
    headingQuestion,
  } = useContext(Question)
  const [selectedQuestionId, setSelectedQuestionId] = useState(null) // Add state for selected question

  const addQuestion = () => {
    const id = 100000 + Math.floor(Math.random() * 900000)
    const newQuestion = {
      id: id.toString(),
      question: '',
      image: '',
      options: {
        option1: '',
        option2: '',
        option3: '',
        option4: '',
      },
    }

    setMainQuestion((prevQuestions) => [...prevQuestions, newQuestion])
  }

  const handleSlide = (q) => {
    setDisplayQuestion(q)
    setSelectedQuestionId(q.id) // Update selected question ID
  }

  useEffect(() => {
    console.log('slide : ', displayQuestion)
  }, [displayQuestion])

  return (
    <div className="sidebar">
      {mainQuestion.map((q, i) => (
        <div
          key={i}
          onClick={() => {
            handleSlide(q)
          }}
          className={`quiz ${q.id === selectedQuestionId ? 'selected' : ''}`} // Conditionally apply class
        >
          <div className="quiz">
            <p className="quiz-p">{`Quiz ${i + 1}`}</p>
            <div className="question">
              <p className="question-p">{headingQuestion || 'Question'}</p>{' '}
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
