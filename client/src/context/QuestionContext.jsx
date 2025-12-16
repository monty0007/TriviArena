import React, { createContext, useState } from 'react'

export const Question = createContext()

export default function QuestionContext(props) {
  const [mainQuestion, setMainQuestion] = useState([
    {
      questionIndex: 0,
      backgroundImage: '',
      question: '',
      //update answerlist in backend
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
    creatorName: '',
    numberOfQuestions: 0,
    // isPublic: false,
    // dateCreated: '',
    questionType: 'Quiz',
    pointType: 'Standard',
    answerTime: 10,
    id: '',
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

  // Validation State
  const [validationError, setValidationError] = useState({})


  // Persistence Logic
  // Persistence Logic
  const [isRestored, setIsRestored] = useState(false);

  React.useEffect(() => {
    // Save to storage on change - ONLY if restored
    if (isRestored) {
      sessionStorage.setItem('creator_quiz', JSON.stringify(quiz));
      sessionStorage.setItem('creator_questions', JSON.stringify(mainQuestion));
    }
  }, [quiz, mainQuestion, isRestored]);

  React.useEffect(() => {
    // Load from storage on mount
    const storedQuiz = sessionStorage.getItem('creator_quiz');
    const storedQuestions = sessionStorage.getItem('creator_questions');

    if (storedQuiz && storedQuestions) {
      try {
        const parsedQuiz = JSON.parse(storedQuiz);
        const parsedQuestions = JSON.parse(storedQuestions);

        setQuiz(parsedQuiz);
        setMainQuestion(parsedQuestions);
        if (parsedQuestions.length > 0) {
          setDisplayQuestion(parsedQuestions[0]);
        }
      } catch (e) {
        console.error("Failed to restore creator session", e);
      }
    }
    setIsRestored(true); // Allow saving after restoration attempt
  }, []); // Run once on mount

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
        validationError,
        setValidationError
      }}
    >
      {props.children}
    </Question.Provider>
  )
}
