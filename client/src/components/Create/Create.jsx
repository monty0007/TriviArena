import React, { useState, useContext } from 'react'
import LeftSidebar from './LeftSidebar'
import Mainbody from './Mainbody'
import Navbar from './Navbar'
import RightSidebar from './RightSidebar'
import { Question } from '../../context/QuestionContext'
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function Create() {
  const [activeTab, setActiveTab] = useState('editor'); // 'slides', 'editor', 'settings'
  const {
    validationError,
    mainQuestion,
    displayQuestion,
    setDisplayQuestion,
    setMainQuestion,
    setQuiz,
    quiz
  } = useContext(Question);

  // Helper flags for tab error dots
  const hasSlideError = validationError && (validationError.name || validationError.description);
  const hasEditorError = validationError && (validationError.question || validationError.correctOption || Object.keys(validationError).some(k => k.startsWith('option')));
  const hasSettingsError = validationError && (validationError.questionType || validationError.answerTime || validationError.pointType);

  // --- Mobile Question Navigation Logic ---
  const currentIndex = mainQuestion.findIndex(q => q.questionIndex === displayQuestion.questionIndex);
  const totalQuestions = mainQuestion.length;

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setDisplayQuestion(mainQuestion[currentIndex - 1]);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setDisplayQuestion(mainQuestion[currentIndex + 1]);
    }
  };

  const handleAddQuestion = () => {
    // Determine new index (max index + 1)
    const newIndex = mainQuestion.length > 0 ? Math.max(...mainQuestion.map(q => q.questionIndex)) + 1 : 1;

    const newQuestion = {
      questionIndex: newIndex,
      backgroundImage: '',
      question: '',
      answerList: [
        { name: 'option1', body: '', isCorrect: false },
        { name: 'option2', body: '', isCorrect: false },
        { name: 'option3', body: '', isCorrect: false },
        { name: 'option4', body: '', isCorrect: false },
      ],
    };

    setMainQuestion([...mainQuestion, newQuestion]);
    setQuiz(prev => ({ ...prev, numberOfQuestions: prev.numberOfQuestions + 1 }));
    // Auto switch to new question
    setDisplayQuestion(newQuestion);

    // Optional: Toast or subtle feedback
  };

  const handleQuizName = (e) => {
    setQuiz(prev => ({ ...prev, name: e.target.value }));
  };

  const handleQuizDescription = (e) => {
    setQuiz(prev => ({ ...prev, description: e.target.value }));
  };

  return (
    <div className='flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans'>
      {/* Navbar (Always visible) */}
      <Navbar />

      {/* Mobile Quiz Header (Title & Desc) - Fixed below Navbar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex flex-col gap-2 shadow-sm z-20 flex-shrink-0 relative">
        <input
          type="text"
          placeholder="Quiz Title"
          value={quiz.name}
          onChange={handleQuizName}
          className="font-black text-lg text-gray-800 bg-transparent outline-none placeholder-gray-300"
        />
        <input
          type="text"
          placeholder="Add a short description..."
          value={quiz.description}
          onChange={handleQuizDescription}
          className="text-xs font-bold text-gray-500 bg-transparent outline-none placeholder-gray-300"
        />
        {hasSlideError && <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
      </div>

      {/* Content Area */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">

        {/* Left Sidebar (Slides) */}
        <div className={`
             ${activeTab === 'slides' ? 'block' : 'hidden'}
             md:block md:w-[260px] w-full h-full overflow-hidden z-10 bg-white pb-24 md:pb-0 font-sans border-r border-gray-200
        `}>
          <LeftSidebar />
        </div>

        {/* Main Body (Editor) */}
        <div className={`
             ${activeTab === 'editor' ? 'block' : 'hidden'}
             md:block flex-1 w-full h-full overflow-y-auto bg-gray-50 pb-24 md:pb-0
        `}>
          <Mainbody />
        </div>

        {/* Right Sidebar (Settings) */}
        <div className={`
             ${activeTab === 'settings' ? 'block' : 'hidden'}
             md:block md:w-1/5 w-full h-full overflow-y-auto z-10 bg-white pb-24 md:pb-0
        `}>
          <RightSidebar />
        </div>

      </div>

      {/* Mobile Question Navigator (Only visible in Editor Mode on Mobile) */}
      {activeTab === 'editor' && (
        <div className="md:hidden fixed bottom-28 left-4 right-4 bg-gray-900/90 text-white backdrop-blur rounded-full px-4 py-2 flex justify-between items-center z-50 shadow-xl animate-fade-in-up">
          <button
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
            className="p-2 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <FiChevronLeft size={24} />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Slide</span>
            <span className="text-lg font-black leading-none">{currentIndex + 1} <span className="text-gray-500 text-sm">/ {totalQuestions}</span></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddQuestion}
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg active:scale-95 transition-all"
              title="Add Slide"
            >
              <FiPlus size={20} />
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentIndex === totalQuestions - 1}
              className="p-2 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur border border-gray-200 rounded-2xl px-2 py-3 flex justify-around items-center z-50 shadow-2xl">
        {/* 'Slides' tab removed as requested */}

        <button
          onClick={() => setActiveTab('editor')}
          className={`relative flex flex-col items-center gap-1 p-2 min-w-[3.5rem] rounded-xl transition-all duration-200 active:scale-95 ${activeTab === 'editor' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <span className="text-xl">✏️</span>
          <span className="text-[10px] font-bold uppercase tracking-wide">Editor</span>
          {hasEditorError && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`relative flex flex-col items-center gap-1 p-2 min-w-[3.5rem] rounded-xl transition-all duration-200 active:scale-95 ${activeTab === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] font-bold uppercase tracking-wide">Settings</span>
          {hasSettingsError && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>}
        </button>
      </div>

    </div >
  )
}
