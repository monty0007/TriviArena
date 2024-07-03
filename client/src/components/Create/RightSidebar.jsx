import React, { useContext, useState, useEffect } from 'react'
import { Question } from '../../context/QuestionContext'

function RightSidebar() {
  const { quiz, setQuiz } = useContext(Question)
  const [quesType, setQuesType] = useState('')
  const [answerTime, setAnswerTime] = useState('')
  const [pType, setPType] = useState('')
  const [aType, setAType] = useState('')

  //Update backend also
  function handlePoints(e) {
    const { name, value } = e.target
    if (name === 'questionType') setQuesType(value)
    if (name === 'answerTime') setAnswerTime(value)
    if (name === 'pointType') setPType(value)
    if (name === 'answerOptions') setAType(value)
    
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      [name]: value
    }))
    // console.log(quiz);
  }

  useEffect(() => {
    console.log('Updated quiz:', quiz);
  }, [quiz]);


  return (
    <div className="rightSidebar">
      <div className="imagee">
        <img src="questionType.svg" alt="" />
        <h5>Question type</h5>
      </div>
      <select name="questionType" value={quiz.questionType} onChange={handlePoints}>
        <option>---</option>
        <option value="Quiz">Quiz</option>
      </select>
      <div className="imagee">
        <img src="timer.svg" alt="" />
        <h5>Time limit</h5>
      </div>
      <select name="answerTime" value={quiz.answerTime} onChange={handlePoints}>
        <option>---</option>
        {/* <option value="5">5 Seconds</option> */}
        <option value="10">10 Seconds</option>
        {/* <option value="20">20 Seconds</option> */}
        {/* <option value="30">30 Seconds</option> */}
        {/* <option value="60">1 Minute</option> */}
      </select>
      <div className="imagee">
        <img src="gamePoints.svg" alt="" />
        <h5>Points</h5>
      </div>
      <select name="pointType" value={quiz.pointType} onChange={handlePoints}>
        <option>---</option>
        <option value="Standard">Standard</option>
        {/* <option value="double">Double Points</option> */}
      </select>
      <div className="imagee">
        <img src="answerOptions.svg" alt="" />
        <h5>Answer options</h5>
      </div>
      <select name="answerOptions" value={aType} onChange={handlePoints}>
        {/* <option>---</option> */}
        <option value="single">Single Select</option>
        {/* <option value="multi">Multi-Select</option> */}
      </select>
    </div>
  )
}

export default RightSidebar
