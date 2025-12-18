import React, { useContext, useEffect, useState } from 'react'
import { Question } from '../../context/QuestionContext'
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
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

  const handleQuizDescription = (e) => {
    const description = e.target.value
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      description: description,
    }))
  }

  // Sync selection state with displayQuestion
  useEffect(() => {
    if (displayQuestion && displayQuestion.questionIndex) {
      setSelectedQuestionId(displayQuestion.questionIndex)
    }
  }, [displayQuestion])

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col shadow-sm relative">

      {/* --- Fixed Header: Quiz Title & Info --- */}
      <div className="flex-shrink-0 p-5 border-b border-gray-100 bg-white z-20">
        <div className="mb-3">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
            Quiz Title
          </label>
          <input
            type="text"
            placeholder={validationError?.name ? "Required!" : "Untitled Quiz"}
            value={quiz.name}
            onChange={handleQuizName}
            className={`w-full text-lg font-black text-gray-800 bg-transparent border-b-2 py-1 px-1 transition-all outline-none ${validationError?.name ? 'border-red-500 placeholder-red-400' : 'border-gray-100 placeholder-gray-300 focus:border-blue-500'}`}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Description (Optional)"
            value={quiz.description || ''}
            onChange={handleQuizDescription}
            className={`w-full text-xs font-medium text-gray-500 bg-gray-50 rounded-lg px-3 py-2 outline-none transition-all ${validationError?.description ? 'ring-1 ring-red-500 bg-red-50' : 'focus:bg-blue-50 focus:text-blue-700'}`}
          />
        </div>
      </div>

      {/* --- Scrollable Question List --- */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar pb-24">
        {mainQuestion.map((q, index) => (
          <div
            key={q.questionIndex}
            onClick={() => handleSlide(q)}
            className={`group flex flex-col relative w-full rounded-xl cursor-pointer transition-all duration-300 border select-none overflow-hidden ${q.questionIndex === selectedQuestionId
              ? 'bg-white border-blue-600 shadow-lg scale-[1.02] z-10'
              : 'bg-white border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5'
              }`}
          >
            {/* Header: Number & Delete */}
            <div className="flex justify-between items-start p-2">
              <span className={`w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-black shadow-sm ${q.questionIndex === selectedQuestionId ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {index + 1}
              </span>
              <button
                className="text-gray-300 hover:text-red-500 transition-colors px-1"
                onClick={(e) => handleDelete(e, q.questionIndex)}
                title="Delete Slide"
              >
                <AiOutlineDelete size={14} />
              </button>
            </div>

            {/* Content Preview: "Image in middle with box" */}
            <div className="flex-1 flex flex-col items-center justify-center pb-2 px-2 gap-1">

              {/* Image Box */}
              <div className="w-16 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
                {q.backgroundImage ? (
                  <img src={q.backgroundImage} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-[8px] text-gray-300 font-bold">IMG</div>
                )}
              </div>

              {/* Text Snippet */}
              <p className="text-[10px] font-bold text-gray-600 leading-tight text-center line-clamp-1 w-full px-1">
                {q.question || <span className="text-gray-300 italic">...</span>}
              </p>
            </div>

            {/* Footer: Option Bars Preview */}
            <div className="h-1.5 flex w-full mt-auto opacity-80">
              <div className="flex-1 bg-red-400"></div>
              <div className="flex-1 bg-blue-400"></div>
              <div className="flex-1 bg-yellow-400"></div>
              <div className="flex-1 bg-green-400"></div>
            </div>

            {/* Active Indicator (Bottom Strip) */}
            {q.questionIndex === selectedQuestionId && (
              <div className="h-1 w-full bg-blue-600"></div>
            )}
          </div>
        ))}
      </div>

      {/* --- Sticky Add Button --- */}
      <div className="absolute bottom-4 right-4 left-4 z-30">
        <button
          onClick={addQuestion}
          className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl shadow-xl transition-all hover:shadow-2xl active:scale-95 font-bold text-sm flex items-center justify-center gap-2 group backdrop-blur-md"
        >
          <AiOutlinePlus className="text-white/70 group-hover:text-white transition-colors" />
          Add Slide
        </button>
      </div>

    </div>
  )
}

export default LeftSidebar
