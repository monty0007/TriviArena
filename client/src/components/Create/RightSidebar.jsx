import React, { useContext, useState, useEffect } from 'react'
import { Question } from '../../context/QuestionContext'

function RightSidebar() {
  const { quiz, setQuiz, validationError } = useContext(Question)

  // Local state for immediate UI feedback (syncs with quiz state)
  const [quesType, setQuesType] = useState(quiz.questionType || 'Quiz')
  const [answerTime, setAnswerTime] = useState(quiz.answerTime || '10')
  const [pType, setPType] = useState(quiz.pointType || 'Standard')
  const [aType, setAType] = useState('single')

  function handlePoints(e) {
    const { name, value } = e.target
    // Update local state
    if (name === 'questionType') setQuesType(value)
    if (name === 'answerTime') setAnswerTime(value)
    if (name === 'pointType') setPType(value)
    if (name === 'answerOptions') setAType(value)

    // Update Context
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      [name]: value
    }))
  }

  // Sync local state when quiz prop changes from outside
  useEffect(() => {
    setQuesType(quiz.questionType || 'Quiz')
    setAnswerTime(quiz.answerTime || '10')
    setPType(quiz.pointType || 'Standard')
  }, [quiz.questionType, quiz.answerTime, quiz.pointType])

  const renderSetting = (icon, label, name, value, options) => {
    const hasError = validationError && validationError[name];

    return (
      <div className="w-full mb-6">
        <div className="flex items-center gap-2 mb-2 text-gray-400">
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-xl">{icon}</span>
          </div>
          <h5 className={`font-semibold text-sm uppercase tracking-wide ${hasError ? 'text-red-500' : ''}`}>{label}</h5>
        </div>
        <div className="relative">
          <select
            name={name}
            value={value}
            onChange={handlePoints}
            className={`w-full bg-gray-100 border text-gray-900 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors font-bold ${hasError ? 'border-red-500 ring-2 ring-red-500 bg-red-50' : 'border-transparent focus:bg-white focus:border-blue-500 hover:bg-gray-200'}`}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            {/* Arrow removed to avoid duplication if using browser default, or keeping it if concealing default appearance. 
                Upon review, the user sees TWO arrows. One is likely from the browser default appearance and one is this SVG.
                I will style the select to appearance-none to fix this, or just remove this custom arrow if the browser one is preferred.
                Let's use appearance-none on the select to keep the custom styling consistent. */}
          </div>
          <style jsx>{`
            select {
              appearance: none;
              -webkit-appearance: none;
              -moz-appearance: none;
            }
          `}</style>
        </div>
      </div>
    )
  }

  // Helper function to update quiz state and local state
  const updateQuestionHelper = (value, field) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      [field]: value,
    }));
    // Also update local state for immediate UI feedback if it's one of the tracked fields
    if (field === 'questionType') setQuesType(value);
    if (field === 'answerTime') setAnswerTime(String(value)); // Ensure it's a string for select value
    if (field === 'pointType') setPType(value);
  };

  return (
    <div className="w-full md:w-1/5 bg-white border-t md:border-t-0 md:border-l border-gray-200 p-4 flex flex-col items-center h-auto md:h-full overflow-y-auto">

      <div className="w-full mb-6">
        <h3 className="text-gray-800 font-black text-lg mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
          Quiz Settings
        </h3>

        {/* Question Type */}
        <div className="mb-4">
          <label className={`text-xs font-bold uppercase tracking-wide mb-2 block ${validationError?.questionType ? 'text-red-500' : 'text-gray-500'}`}>Question Type</label>
          <div className={`grid grid-cols-2 gap-2 p-1 rounded-lg ${validationError?.questionType ? 'bg-red-50 ring-2 ring-red-500' : ''}`}>
            <button
              onClick={() => {
                setQuiz({ ...quiz, questionType: 'Quiz' });
                updateQuestionHelper('Quiz', 'questionType');
              }}
              className={`p-3 rounded-lg border-2 font-bold text-sm flex flex-col items-center justify-center gap-1 transition-all
                ${quiz.questionType === 'Quiz' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'}`}
            >
              <span>❓</span> Quiz
            </button>
            <button
              onClick={() => {
                setQuiz({ ...quiz, questionType: 'TrueFalse' });
                updateQuestionHelper('TrueFalse', 'questionType');
              }}
              className={`p-3 rounded-lg border-2 font-bold text-sm flex flex-col items-center justify-center gap-1 transition-all
                ${quiz.questionType === 'TrueFalse' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'}`}
            >
              <span>✅</span> T / F
            </button>
          </div>
        </div>

        {/* Time Limit */}
        <div className="mb-4">
          <label className={`text-xs font-bold uppercase tracking-wide mb-2 block ${validationError?.answerTime ? 'text-red-500' : 'text-gray-500'}`}>Time Limit</label>
          <select
            value={quiz.answerTime}
            onChange={(e) => updateQuestionHelper(Number(e.target.value), "answerTime")}
            className={`w-full bg-gray-100 border text-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors font-bold ${validationError?.answerTime ? 'border-red-500 ring-2 ring-red-500 bg-red-50' : 'border-transparent focus:bg-white focus:border-blue-500 hover:bg-gray-200'}`}
          >
            <option value={5}>5 Seconds</option>
            <option value={10}>10 Seconds</option>
            <option value={20}>20 Seconds</option>
            <option value={30}>30 Seconds</option>
            <option value={60}>60 Seconds</option>
            <option value={90}>90 Seconds</option>
          </select>
        </div>

        {/* Points */}
        <div className="mb-4">
          <label className={`text-xs font-bold uppercase tracking-wide mb-2 block ${validationError?.pointType ? 'text-red-500' : 'text-gray-500'}`}>Points</label>
          <div className={`w-full bg-gray-100 rounded-lg p-1 flex ${validationError?.pointType ? 'ring-2 ring-red-500 bg-red-50' : ''}`}>
            <button
              onClick={() => updateQuestionHelper("Standard", "pointType")}
              className={`p-3 rounded-lg border-2 font-bold text-sm flex flex-col items-center justify-center gap-1 transition-all
                ${quiz.pointType === 'Standard' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Standard
            </button>
            <button
              onClick={() => updateQuestionHelper("Double", "pointType")}
              className={`flex-1 py-1 rounded text-xs font-bold transition-all ${quiz.pointType === 'Double' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Double
            </button>
            <button
              onClick={() => updateQuestionHelper("NoPoints", "pointType")}
              className={`flex-1 py-1 rounded text-xs font-bold transition-all ${quiz.pointType === 'NoPoints' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              No Points
            </button>
          </div>
        </div>
      </div>

      {renderSetting("🎮", "Game Mode", "gameMode", quiz.gameMode || "Standard", [
        { value: "Standard", label: "Standard" },
        { value: "RapidFire", label: "Rapid Fire ⚡" },
        { value: "TrueFalse", label: "True or False" } // Added option for future
      ])}

      {renderSetting("✅", "Answer options", "answerOptions", aType, [
        { value: "single", label: "Single Select" },
        // { value: "multi", label: "Multi-Select" },
      ])}

      <div className="mt-auto w-full pt-4">
        {/* Placeholder for Delete Button or duplicates if needed */}
      </div>
    </div>
  )
}

export default RightSidebar
