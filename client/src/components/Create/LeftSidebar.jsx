import React, { useContext, useEffect, useState } from 'react'
import { Question } from '../../context/QuestionContext'
import { AiOutlineDelete } from "react-icons/ai";
import Swal from 'sweetalert2';

function LeftSidebar() {
  const {
    setMainQuestion,
    mainQuestion,
    displayQuestion,
    setDisplayQuestion,
    quiz,
    setQuiz,
    validationError
  } = useContext(Question)

  useEffect(() => {
    if (mainQuestion.length === 0) {
      const initialQuestion = {
        questionIndex: 1,
        backgroundImage: '',
        question: '',
        answerList: [
          { name: 'option1', body: '', isCorrect: false },
          { name: 'option2', body: '', isCorrect: false },
          { name: 'option3', body: '', isCorrect: false },
          { name: 'option4', body: '', isCorrect: false },
        ],
      }
      setMainQuestion([initialQuestion])
      setDisplayQuestion(initialQuestion)
    }
  }, [])

  const [selectedQuestionId, setSelectedQuestionId] = useState(1)
  const [qIndex, setQIndex] = useState(2)

  useEffect(() => {
    if (mainQuestion.length > 0) {
      setQIndex(mainQuestion.length + 1)
    }
  }, [mainQuestion])

  const addQuestion = () => {
    const newQuestion = {
      questionIndex: qIndex,
      backgroundImage: '',
      question: '',
      answerList: [
        { name: 'option1', body: '', isCorrect: false },
        { name: 'option2', body: '', isCorrect: false },
        { name: 'option3', body: '', isCorrect: false },
        { name: 'option4', body: '', isCorrect: false },
      ],
    }

    setMainQuestion((prevQuestions) => [...prevQuestions, newQuestion])
    setQuiz((prev) => ({
      ...prev,
      numberOfQuestions: prev.numberOfQuestions + 1,
    }))
    setQIndex(qIndex + 1)
  }

  const handleSlide = (q) => {
    setDisplayQuestion(q)
    setSelectedQuestionId(q.questionIndex)
  }

  const handleQuizName = (e) => {
    const quizName = e.target.value
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      name: quizName,
    }))
  }

  const handleDelete = (e, questionIndex) => {
    e.stopPropagation();

    if (questionIndex === 1) {
      Swal.fire({
        icon: 'error',
        title: "Can't delete only question",
        text: 'You need at least one question.',
        text: 'You need at least one question.',
        confirmButtonColor: '#3b82f6', // blue-500
      });
    } else {
      Swal.fire({
        title: 'Delete Question?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it',
        customClass: {
          popup: 'rounded-2xl',
          title: 'text-gray-900 font-bold',
          content: 'text-gray-600'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          setMainQuestion((prevQuestions) =>
            prevQuestions.filter((q) => q.questionIndex !== questionIndex)
          );
          if (displayQuestion.questionIndex === questionIndex) {
            setDisplayQuestion(mainQuestion.length > 1 ? mainQuestion[0] : null);
          }
          setQuiz((prev) => ({
            ...prev,
            numberOfQuestions: prev.numberOfQuestions - 1,
          }));
        }
      });
    }
  };

  return (
    <div className="w-full md:w-1/5 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col items-center py-4 h-auto md:h-full overflow-y-auto">
      <div className="px-4 w-full mb-4">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Quiz Title</label>
        <input
          type="text"
          value={quiz.name || ''}
          onChange={handleQuizName}
          placeholder="Enter quiz title..."
          className={`w-full bg-gray-100 border focus:bg-white text-gray-900 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors font-bold ${validationError && validationError.name ? 'border-red-500 ring-2 ring-red-500 placeholder-red-400' : 'border-transparent focus:border-blue-500'}`}
        />
      </div>

      <div className="flex-1 w-full px-2 space-y-3">
        {mainQuestion.map((q, index) => (
          <div
            key={q.questionIndex}
            onClick={() => handleSlide(q)}
            className={`group w-full p-2 rounded-lg cursor-pointer transition-all ${q.questionIndex === selectedQuestionId
              ? 'bg-blue-50 border-2 border-blue-500 shadow-md transform scale-[1.02]'
              : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
              }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={`text-xs font-bold ${q.questionIndex === selectedQuestionId ? 'text-blue-600' : 'text-gray-500'}`}>
                {index + 1}. Quiz
              </span>
              <button
                className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md shadow-sm transition-all transform hover:scale-110"
                onClick={(e) => handleDelete(e, q.questionIndex)}
                title="Delete Question"
              >
                <AiOutlineDelete size={16} />
              </button>
            </div>

            <div className={`w-full aspect-video bg-white rounded-lg border flex flex-col items-center justify-center p-2 relative overflow-hidden ${q.questionIndex === selectedQuestionId ? 'border-blue-200' : 'border-gray-200'}`}>
              <p className="text-[10px] text-gray-700 text-center line-clamp-2 w-full mb-1">{q.question || "Question"}</p>
              <div className="flex-1 w-full bg-gray-50 rounded flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-[10px] text-gray-400">Img</div>
              </div>
              <div className="w-full grid grid-cols-2 gap-1 mt-1 h-3">
                <div className="bg-red-500/50 rounded-sm"></div>
                <div className="bg-blue-500/50 rounded-sm"></div>
                <div className="bg-yellow-500/50 rounded-sm"></div>
                <div className="bg-green-500/50 rounded-sm"></div>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 pb-8 flex justify-center">
          <button
            onClick={addQuestion}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-blue-400/30"
          >
            <div className="bg-white/20 p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span>Add Question</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default LeftSidebar
