import React, { useState, useContext } from 'react'
import LeftSidebar from './LeftSidebar'
import Mainbody from './Mainbody'
import Navbar from './Navbar'
import RightSidebar from './RightSidebar'
import { Question } from '../../context/QuestionContext'

export default function Create() {
  const [activeTab, setActiveTab] = useState('editor'); // 'slides', 'editor', 'settings'
  const { validationError } = useContext(Question);

  // Helper flags for tab error dots
  const hasSlideError = validationError && (validationError.name || validationError.description);
  const hasEditorError = validationError && (validationError.question || validationError.correctOption || Object.keys(validationError).some(k => k.startsWith('option')));
  const hasSettingsError = validationError && (validationError.questionType || validationError.answerTime || validationError.pointType);

  return (
    <div className='flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans'>
      {/* Navbar (Always visible) */}
      <Navbar />

      {/* Content Area */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">

        {/* Left Sidebar (Slides) */}
        <div className={`
             ${activeTab === 'slides' ? 'block' : 'hidden'}
             md:block md:w-[22%] w-full h-full overflow-y-auto z-10 bg-white
        `}>
          <LeftSidebar />
        </div>

        {/* Main Body (Editor) */}
        <div className={`
             ${activeTab === 'editor' ? 'block' : 'hidden'}
             md:block flex-1 w-full h-full overflow-y-auto bg-gray-50
        `}>
          <Mainbody />
        </div>

        {/* Right Sidebar (Settings) */}
        <div className={`
             ${activeTab === 'settings' ? 'block' : 'hidden'}
             md:block md:w-1/5 w-full h-full overflow-y-auto z-10 bg-white
        `}>
          <RightSidebar />
        </div>

      </div>

      {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
      <div className="md:hidden bg-white border-t border-gray-200 px-2 py-2 pb-safe flex justify-around items-center z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setActiveTab('slides')}
          className={`relative flex flex-col items-center gap-1 p-2 min-w-[3.5rem] rounded-xl transition-all duration-200 active:scale-95 ${activeTab === 'slides' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <span className="text-xl">🗂️</span>
          <span className="text-[10px] font-bold uppercase tracking-wide">Slides</span>
          {hasSlideError && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>}
        </button>

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

    </div>
  )
}
