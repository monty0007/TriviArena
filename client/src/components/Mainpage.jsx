
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { auth } from './Firebase/Firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

function Mainpage() {
  const [user, setUser] = React.useState(null)
  const [showDropdown, setShowDropdown] = React.useState(false)
  const dropdownRef = React.useRef(null)

  const handleLogout = () => {
    signOut(auth)
    setShowDropdown(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  // Custom scroll listener for reveal effects could go here, 
  // but we'll use CSS classes and simple layout for robustness.

  return (
    <div className="min-h-screen bg-[#2563eb] font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-6 absolute top-0 w-full z-50 left-0 right-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform">
            <span className="text-2xl">🧠</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-sm">TriviArena</h1>
        </div>
        <div className="flex gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all border border-white/20 group cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-white text-sm font-bold leading-tight">{user.displayName || "User"}</p>
                  <p className="text-blue-200 text-xs font-medium">Menu &darr;</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white/20">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email ? user.email.charAt(0).toUpperCase() : "U"}
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 animate-fade-in-up z-50">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 font-bold transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    📊 Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 font-bold transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2 text-blue-100 hover:text-white font-bold transition-colors hidden md:block">Log In</Link>
              <Link to="/register" className="bg-white text-blue-600 px-5 py-2 rounded-full font-bold shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-purple-500/30 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
        </div>

        <div className="inline-block bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-8 border border-white/20 shadow-xl animate-fade-in-up">
          <span className="text-white font-bold text-sm tracking-wide uppercase">🚀 Ready for liftoff?</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-tight animate-fade-in-up delay-100 drop-shadow-md">
          Your Quiz Playground <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-purple-200">Trivia Gaming</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-blue-100 font-medium leading-relaxed mb-12 animate-fade-in-up delay-200">
          Make quizzes. Join games. Beat your friends.
          All in real-time, all in one place.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300 w-full max-w-md md:max-w-none">
          <Link to="/login" className="w-full md:w-auto bg-white text-blue-600 px-8 py-4 rounded-xl font-black text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
            Dashboard
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link to="/join" className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2">
            Join Game
            <span className="text-xl">🎮</span>
          </Link>
        </div>

        {/* Floating Question Marks (Background) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-0">
          <div className="absolute top-[15%] left-[10%] text-white/10 text-9xl font-black animate-bounce-slow rotate-12">?</div>
          <div className="absolute top-[40%] right-[15%] text-white/5 text-8xl font-black animate-pulse-slow -rotate-12">?</div>
          <div className="absolute bottom-[20%] left-[20%] text-white/5 text-7xl font-black animate-float rotate-45">?</div>
        </div>

        {/* Scroll Indicator */}

      </div>

      {/* --- STATS SECTION --- */}
      <div className="py-20 bg-black/10 border-y border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatItem number="10K+" label="Active Players" />
          <StatItem number="500+" label="Quizzes Created" />
          <StatItem number="0s" label="Lag Time" />
          <StatItem number="∞" label="Fun Moments" />
        </div>
      </div>

      {/* --- ABOUT SECTION --- */}
      <div className="py-32 px-6 bg-[#2563eb] relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#1d4ed8] p-8 rounded-2xl border border-white/10 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                  <div className="bg-white/10 p-4 rounded-xl border border-white/20"><span className="text-3xl">🚀</span></div>
                  <div className="bg-white/10 p-4 rounded-xl border border-white/20"><span className="text-3xl">🎯</span></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/10 p-4 rounded-xl border border-white/20"><span className="text-3xl">🎨</span></div>
                  <div className="bg-white/10 p-4 rounded-xl border border-white/20"><span className="text-3xl">🏆</span></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-white">
              More Than Just A <span className="text-cyan-200">Quiz App</span>
            </h2>
            <p className="text-lg text-blue-100 mb-6 leading-relaxed">
              TriviArena isn't just about answering questions; it's about the thrill of the race. We've built a platform that combines the excitement of live gaming with the utility of educational assessments.
            </p>
            <ul className="space-y-4">
              <ListItem text="Instant verification of answers" />
              <ListItem text="Live leaderboards that update in real-time" />
              <ListItem text="Teacher-controlled pacing for classrooms" />
              <ListItem text="Mobile-optimized for players on any device" />
            </ul>
          </div>
        </div>
      </div>

      {/* --- HOW IT WORKS --- */}
      <div className="py-32 px-6 bg-gradient-to-b from-[#2563eb] to-[#1e40af] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-white">How It Works</h2>
            <p className="text-xl text-blue-200">Start your first game in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <StepCard
              number="01"
              title="Create"
              desc="Sign up and build your custom quiz with our easy editor. diverse question types supported."
              color="from-pink-500 to-rose-500"
            />
            <StepCard
              number="02"
              title="Host"
              desc="Launch a live lobby. Share the unique PIN with your audience on the big screen."
              color="from-purple-500 to-indigo-500"
            />

            <StepCard
              number="03"
              title="Play"
              desc="Players join via their phones. Watch the leaderboard climb as they answer!"
              color="from-cyan-500 to-blue-500"
            />
          </div>
        </div>
      </div>

      {/* --- FOOTER MARQUEE --- */}
      <div className="bg-black py-8 overflow-hidden relative border-t border-white/10">
        <style>
          {`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: flex;
                width: fit-content;
                animation: marquee 40s linear infinite;
              }
            `}
        </style>

        <div className="animate-marquee">
          <span className="text-6xl md:text-8xl font-black text-white/10 px-10 whitespace-nowrap">
            TRIVIARENA • LIVE GAMING • LEARN FUN • TRIVIARENA • JOIN NOW • WIN BIG • TRIVIARENA • LIVE GAMING • LEARN FUN
          </span>
          <span className="text-6xl md:text-8xl font-black text-white/10 px-10 whitespace-nowrap">
            TRIVIARENA • LIVE GAMING • LEARN FUN • TRIVIARENA • JOIN NOW • WIN BIG • TRIVIARENA • LIVE GAMING • LEARN FUN
          </span>
        </div>
      </div>

    </div>
  )
}

// Subcomponents
function StatItem({ number, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-5xl font-black text-white mb-2">{number}</span>
      <span className="text-blue-200/60 font-bold uppercase text-xs tracking-wider">{label}</span>
    </div>
  )
}

function ListItem({ text }) {
  return (
    <li className="flex items-center gap-3 text-blue-100 font-medium">
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-sm">✓</div>
      {text}
    </li>
  )
}

function StepCard({ number, title, desc, color }) {
  return (
    <div className="relative group p-8 rounded-3xl bg-[#1d4ed8] border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2 shadow-lg">
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl font-black text-white mb-8 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all`}>
        {number}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-blue-100/80 leading-relaxed">
        {desc}
      </p>
    </div>
  )
}

export default Mainpage
