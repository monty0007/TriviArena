import React, { useContext, useEffect, useState } from 'react'
import { Question } from '../../context/QuestionContext'

function LeftSidebar() {
  const {setMainQuestion, headingQuestion} = useContext(Question)
  const [sum, setSum] = useState(1)
  const AllQuestions = [
    {
      question: 'what is ur name',
      image: 'classroom.png',
      options: [
        { opt1: 'loki' },
        { opt2: 'arpita' },
        { opt3: 'deempu' },
        { opt4: 'monty' },
      ],
    },
    {
      question: 'how are you',
      image: 'classroom.png',
      options: [
        { opt1: 'loki' },
        { opt2: 'arpita' },
        { opt3: 'deempu' },
        { opt4: 'monty' },
      ],
    },
  ]

  const handleQuestionUpdate = () => {
    setSum(sum + 1)
  }

  function handleQuestion(q){
    // setMainQuestion(q)
  }

  useEffect(() => {
    console.log(sum)
  }, [sum])

  return (
    <div className="sidebar">
      {AllQuestions.slice(0, 1).map((q, i) => {
        return (
          <div key={i} onClick={()=>handleQuestion(q)} >
            <div className="quiz">
              <p className="quiz-p">1 Quiz</p>
              <div className="question">
                <p className="question-p">{headingQuestion}</p>
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
                    <img
                      className="img4"
                      src="defaultQuestionImage.svg"
                      alt=""
                    />
                  </div>
                </div>
                <div className="rectangle">
                  <img
                    className="rectangle-image"
                    src="rectangle.webp"
                    alt=""
                  />
                  <img
                    className="rectangle-image"
                    src="rectangle.webp"
                    alt=""
                  />
                  <img
                    className="rectangle-image"
                    src="rectangle.webp"
                    alt=""
                  />
                  <img
                    className="rectangle-image"
                    src="rectangle.webp"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}
      {AllQuestions.slice(1, sum).map((q, i) => {
        return (
          <div key={i} onClick={()=>handleQuestion(q)} >
            <div className="quiz">
              <p className="quiz-p">1 Quiz</p>
              <div className="question">
                <p className="question-p">{q.question}</p>
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
                    <img
                      className="img4"
                      src="defaultQuestionImage.svg"
                      alt=""
                    />
                  </div>
                </div>
                <div className="rectangle">
                  <img
                    className="rectangle-image"
                    src="rectangle.webp"
                    alt=""
                  />
                  <img
                    className="rectangle-image"
                    src="rectangle.webp"
                    alt=""
                  />
                  <img
                    className="rectangle-image"
                    src="rectangle.webp"
                    alt=""
                  />
                  <img
                    className="rectangle-image"
                    src="rectangle.webp"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}
      <div className="add-button">
        <button
          onClick={handleQuestionUpdate}
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
