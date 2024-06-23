import React, { createContext, useState } from 'react'

export const Question = createContext()

export default function QuestionContext(props) {
  const [mainQuestion, setMainQuestion] = useState(
    [
      {  
        id : '100000',
        // userId: user ? user?._id : '',
        question: '',
        image: '',
        options : {
          option1 : '',
          option2 : '',
          option3 : '',
          option4 : '',
        }
      }
    ])
  const [headingQuestion, setHeadingQuestion] = useState('')
  const[saveQuestion, setSaveQuestion] = useState({})
  const [displayQuestion, setDisplayQuestion] = useState({
    id : '100000',
    question: '',
    image: '',
    options : {
      option1 : '',
      option2 : '',
      option3 : '',
      option4 : '',
    }
  })
  const [room, setRoom] = useState('')
  
  return (
    <Question.Provider
      value={{
        mainQuestion,
        setMainQuestion,
        headingQuestion,
        setHeadingQuestion,
        saveQuestion, 
        setSaveQuestion,
        displayQuestion,
        setDisplayQuestion,
        room,
         setRoom
      }}
    >
      {props.children}
    </Question.Provider>
  )
}
