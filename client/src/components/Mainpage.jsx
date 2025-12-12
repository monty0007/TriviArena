import React from 'react'
import { Link } from 'react-router-dom'

function Mainpage() {
  return (
    <div className="min-h-screen bg-[#2563eb] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-white/10 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-[20%] right-[10%] w-24 h-24 bg-white/10 rounded-lg transform rotate-12 animate-float"></div>
        <div className="absolute bottom-[15%] left-[20%] w-40 h-40 border-8 border-white/10 rounded-full"></div>
        <div className="absolute bottom-[10%] right-[5%] w-0 h-0 border-l-[50px] border-l-transparent border-t-[75px] border-t-white/10 border-r-[50px] border-r-transparent transform rotate-45"></div>
      </div>

      <div className="z-10 text-center max-w-5xl w-full">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-4 drop-shadow-md tracking-tight">
          TriviArena
        </h1>
        <div className="bg-white/20 backdrop-blur-md rounded-full px-6 py-2 inline-block mb-12">
          <p className="text-white font-bold text-lg">Where learning meets awesome</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-4">
          <Link to="/login" className="group w-full md:w-auto">
            <div className="w-full md:w-80 bg-white rounded-xl p-6 flex flex-col items-center justify-center shadow-card transition-transform hover:-translate-y-1 active:translate-y-1 active:shadow-button-active h-64">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">👑</span>
              </div>
              <h2 className="text-3xl font-black text-gray-800 mb-1">Create</h2>
              <p className="text-gray-500 font-bold">Host a game</p>
            </div>
          </Link>

          <Link to="/join" className="group w-full md:w-auto">
            <div className="w-full md:w-80 bg-white rounded-xl p-6 flex flex-col items-center justify-center shadow-card transition-transform hover:-translate-y-1 active:translate-y-1 active:shadow-button-active h-64">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🎮</span>
              </div>
              <h2 className="text-3xl font-black text-gray-800 mb-1">Join</h2>
              <p className="text-gray-500 font-bold">Play a game</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 text-white/50 text-sm font-bold">
        Designed for Fun Learning
      </div>
    </div>
  )
}

export default Mainpage
