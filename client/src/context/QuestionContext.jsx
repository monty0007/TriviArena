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

  // Persistence Logic State (Moved up to fix ReferenceError)
  const [isRestored, setIsRestored] = useState(false);

  // Dirty State (Unsaved Changes)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const isFirstRender = React.useRef(true);

  // Baselines for deep comparison
  const baselineQuiz = React.useRef(null);
  const baselineQuestions = React.useRef(null);

  // Helper to update baseline (call this after successful save)
  const markQuizAsSaved = () => {
    baselineQuiz.current = JSON.parse(JSON.stringify(quiz));
    baselineQuestions.current = JSON.parse(JSON.stringify(mainQuestion));
    setHasUnsavedChanges(false);
  };

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
  }, []);

  React.useEffect(() => {
    // Mark as dirty when quiz or questions change, BUT only if we are past the initial restoration phase
    if (isRestored) {
      // Deep compare with baseline
      const currentQuizStr = JSON.stringify(quiz);
      const currentQuestionsStr = JSON.stringify(mainQuestion);

      const baselineQuizStr = JSON.stringify(baselineQuiz.current);
      const baselineQuestionsStr = JSON.stringify(baselineQuestions.current);

      if (currentQuizStr !== baselineQuizStr || currentQuestionsStr !== baselineQuestionsStr) {
        setHasUnsavedChanges(true);
      } else {
        setHasUnsavedChanges(false);
      }
    }
  }, [quiz, mainQuestion, isRestored]);


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

        // Set Initial Baselines
        baselineQuiz.current = JSON.parse(storedQuiz);
        baselineQuestions.current = JSON.parse(storedQuestions);

        if (parsedQuestions.length > 0) {
          setDisplayQuestion(parsedQuestions[0]);
        }
      } catch (e) {
        console.error("Failed to restore creator session", e);
      }
    } else {
      // New Quiz Defaults - initialize baseline with current default state
      baselineQuiz.current = JSON.parse(JSON.stringify(quiz));
      baselineQuestions.current = JSON.parse(JSON.stringify(mainQuestion));
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
        setValidationError,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        markQuizAsSaved
      }}
    >
      {props.children}
    </Question.Provider>
  )
}
