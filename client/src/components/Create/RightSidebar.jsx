import React, { useContext, useState, useEffect } from 'react'
import { Question } from '../../context/QuestionContext'

function RightSidebar() {
  const { mainQuestion, setMainQuestion, quiz, setQuiz } = useContext(Question)
  const [quesType, setQuesType] = useState('')
  const [pType, setPType] = useState('')
  const [aType, setAType] = useState('')

  function handleType(e) {
    const { value } = e.target
    setQuesType(value)
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questionList: prevQuiz.questionList.map((question, index) => 
        index === 0 ? { ...question, questionType: value } : question // Update first question type for example
      )
    }))
    console.log('Question type:', value)
  }

  function handleTimeLimit(e) {
    const { value } = e.target
    setAType(value)
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questionList: prevQuiz.questionList.map((question, index) => 
        index === 0 ? { ...question, answerTime: parseInt(value, 10) } : question // Update first question time limit for example
      )
    }))
    console.log(quiz);
    console.log('Time limit:', value)
  }

  function handlePoints(e) {
    const { value } = e.target
    setPType(value)
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questionList: prevQuiz.questionList.map((question, index) => 
        index === 0 ? { ...question, pointType: value } : question // Update first question points type for example
      )
    }))
    console.log(quiz);
    console.log('Points:', value)
  }

  async function handleUploadQuestion() {
    setMainQuestion((prev) => ({
      ...prev,
    }))
    // const res = await uploadapi(question)
  }

  useEffect(() => {
    console.log('main question : ', mainQuestion)
  }, [mainQuestion])

  return (
    <div className="rightSidebar">
      <div className="imagee">
        <img src="questionType.svg" alt="" />
        <h5>Question type</h5>
      </div>
      <select name="qType" value={quesType} onChange={handleType}>
        <option>---</option>
        <option value="Quiz">Quiz</option>
      </select>
      <div className="imagee">
        <img src="timer.svg" alt="" />
        <h5>Time limit</h5>
      </div>
      <select name="timeLimit" onChange={handleTimeLimit}>
        <option>---</option>
        <option value="5">5 Seconds</option>
        <option value="10">10 Seconds</option>
        <option value="20">20 Seconds</option>
        <option value="30">30 Seconds</option>
        <option value="60">1 Minute</option>
      </select>
      <div className="imagee">
        <img src="gamePoints.svg" alt="" />
        <h5>Points</h5>
      </div>
      <select name="points" onChange={handlePoints}>
        <option>---</option>
        <option value="standard">Standard</option>
        {/* <option value="double">Double Points</option> */}
      </select>
      <div className="imagee">
        <img src="answerOptions.svg" alt="" />
        <h5>Answer options</h5>
      </div>
      <select name="answerOptions" onChange={(e) => console.log('Answer options:', e.target.value)}>
        <option>---</option>
        <option value="single">Single Select</option>
        {/* <option value="multi">Multi-Select</option> */}
      </select>
    </div>
  )
}

export default RightSidebar
