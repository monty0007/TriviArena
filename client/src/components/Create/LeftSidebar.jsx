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
    <div className="w-full md:w-[22%] h-full bg-slate-50 border-r border-slate-200 flex flex-col shadow-inner relative">
      {/* ... header ... */}

      {/* --- Quiz Details Header --- */}
      <div className="p-5 bg-white border-b border-slate-200 shadow-sm z-10 flex-shrink-0">
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
            Quiz Title
          </label>
          <input
            type="text"
            placeholder="Untitled Quiz"
            value={quiz.name}
            onChange={handleQuizName}
            className="w-full text-xl font-extrabold text-slate-800 placeholder-slate-300 border-b-2 border-slate-100 focus:border-blue-500 bg-transparent py-1 px-1 transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
            Description
          </label>
          <textarea
            placeholder="What is this quiz about?"
            value={quiz.description || ''}
            onChange={handleQuizDescription}
            rows={2}
            className="w-full text-sm text-slate-600 placeholder-slate-300 bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
          />
        </div>
      </div>

      {/* --- Question List (Scrollable) --- */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
        {mainQuestion.map((q, index) => (
          <div
            key={q.questionIndex}
            onClick={() => handleSlide(q)}
            className={`group relative w-full p-3 rounded-xl cursor-pointer transition-all duration-200 border-2 select-none ${q.questionIndex === selectedQuestionId
              ? 'bg-white border-blue-500 shadow-lg ring-4 ring-blue-50 scale-[1.02] z-10'
              : 'bg-white border-white hover:border-blue-200 shadow-sm hover:translate-y-[-2px]'
              }`}
          >
            {/* Header: Number & Delete */}
            <div className="flex justify-between items-center mb-2">
              <span className={`text-xs font-black uppercase tracking-wider ${q.questionIndex === selectedQuestionId ? 'text-blue-600' : 'text-slate-400'
                }`}>
                Question {index + 1}
              </span>
              <button
                className={`p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-all ${mainQuestion.length <= 1 ? 'hidden' : 'opacity-0 group-hover:opacity-100'
                  }`}
                onClick={(e) => handleDelete(e, q.questionIndex)}
                title="Delete Question"
              >
                <AiOutlineDelete size={16} />
              </button>
            </div>

            {/* Slide Preview Micro-UI */}
            <div className={`w-full aspect-[16/9] rounded-lg border flex flex-col items-center justify-center p-2 relative overflow-hidden bg-slate-50 ${q.questionIndex === selectedQuestionId ? 'border-blue-100' : 'border-slate-100'
              }`}>
              {q.backgroundImage && (
                <img
                  src={q.backgroundImage}
                  alt="bg"
                  className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[1px]"
                />
              )}

              <p className="relative z-10 text-[10px] font-semibold text-slate-700 text-center line-clamp-2 w-full leading-tight px-1">
                {q.question || <span className="text-slate-300 italic">Empty Question</span>}
              </p>

              {/* Answer Bars Decoration */}
              <div className="absolute bottom-2 left-2 right-2 flex gap-0.5 h-1.5 opacity-50">
                <div className="flex-1 bg-red-400 rounded-full"></div>
                <div className="flex-1 bg-blue-400 rounded-full"></div>
                <div className="flex-1 bg-yellow-400 rounded-full"></div>
                <div className="flex-1 bg-green-400 rounded-full"></div>
              </div>
            </div>

            {/* Active Indicator Strip (Left) */}
            {q.questionIndex === selectedQuestionId && (
              <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-500 rounded-r-md"></div>
            )}
          </div>
        ))}

        {/* Padding for sticky button not covering last item */}
        <div className="h-20"></div>
      </div>

      {/* --- Sticky Add Button --- */}
      <div className="p-4 bg-white border-t border-slate-200 absolute bottom-0 w-full backdrop-blur-sm bg-white/90 z-20">
        <button
          onClick={addQuestion}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 active:scale-95 font-bold text-sm tracking-wide flex items-center justify-center gap-2 group"
        >
          <span className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </span>
          Add Slide
        </button>
      </div>
    </div>
  )
}

export default LeftSidebar
