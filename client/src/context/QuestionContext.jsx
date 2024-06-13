import React, { createContext, useState } from 'react'

export const Question = createContext()

export default function QuestionContext(props) {
    const [mainQuestion, setMainQuestion] = useState({
        monty : 'nalla'
    }) 
    const [headingQuestion, setHeadingQuestion] = useState('')
  return (
    <Question.Provider value={{mainQuestion, setMainQuestion, headingQuestion, setHeadingQuestion}}>
       {props.children}
    </Question.Provider>
  )
}
