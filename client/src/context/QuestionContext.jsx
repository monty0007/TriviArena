import React, { createContext, useState } from 'react'

export const Question = createContext()

export default function QuestionContext(props) {
  const [mainQuestion, setMainQuestion] = useState([
    {
      questionIndex: 0,
      backgroundImage: '',
      question: '',
      //update answerlist in backend
      answerList:[
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
      ]
  }])
  const [headingQuestion, setHeadingQuestion] = useState('')
  const [saveQuestion, setSaveQuestion] = useState({})
  const [displayQuestion, setDisplayQuestion] = useState({
    questionIndex: 0,
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
  })

  const [room, setRoom] = useState('')

  const [quiz, setQuiz] = useState({
    name: '',
    creatorId: '',
    creatorName:'',
    numberOfQuestions: 0,
    // isPublic: false,
    // dateCreated: '',
    questionType: '',
    pointType: '',
    answerTime: 0,
    id:'',
    questionList: [
      {
        backgroundImage: '',
        question: '',
        //update answerlist in backend
        answerList: [
          {
            name: '',
            body: '',
            isCorrect: false,
          },
        ],
        questionIndex: 0,
      },
    ],
  })


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
        setRoom,
        quiz,
        setQuiz,
      }}
    >
      {props.children}
    </Question.Provider>
  )
}
