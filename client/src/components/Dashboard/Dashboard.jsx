import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../Firebase/Firebase'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Create/Navbar'
import { fetchTeacherQuizes, fetchQuiz, deleteQuiz, createQuiz } from '../Api/Api' // Updated Import
import { Question } from '../../context/QuestionContext'
import { sampleQuizzes } from '../../data/sampleQuizzes' // Import Sample Data
import { toast } from 'react-toastify'

import { v4 as uuidv4 } from 'uuid'; // Add UUID import

function Dashboard() {
  const user = auth.currentUser
  const [userDetails, setUserDetails] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [isCreatingSample, setIsCreatingSample] = useState(false); // Rate limiting state
  const navigate = useNavigate()

  const { setQuiz, setMainQuestion, setDisplayQuestion, displayQuestion, setValidationError } = useContext(Question)

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserDetails(user)
        const fetchedQuizzes = await fetchTeacherQuizes(user.uid)
        setQuizzes(fetchedQuizzes)
      }
    })
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleQuizClick = async (quizId) => {
    const quizData = await fetchQuiz(quizId)
    if (quizData) {
      setSelectedQuiz(quizData)
      setQuiz(quizData)
      setMainQuestion(quizData.questionList)
      setDisplayQuestion(quizData.questionList[0])
      setValidationError({}) // Reset validation
      navigate('/create')
    }
  }

  async function handleLogout() {
    try {
      await auth.signOut()
      navigate('/login')
    } catch (error) {
      console.log('Error logging out: ', error.message)
    }
  }

  const handleCreate = async () => {
    console.log("Create New Quiz clicked");

    // Use userDetails (state) as primary source, fallback to auth.currentUser
    const currentUser = userDetails || auth.currentUser;

    if (!currentUser) {
      toast.error("Please wait for login to complete...");
      return;
    }

    setQuiz({
      name: '',
      creatorId: currentUser.uid,
      creatorName: currentUser.displayName || '',
      numberOfQuestions: 0,
      questionList: [],
    })
    setMainQuestion([])
    setDisplayQuestion(null)
    setValidationError({}) // Reset validation
    navigate('/create')
  }

  const handleDelete = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteQuiz(quizId);
        const fetchedQuizzes = await fetchTeacherQuizes(user.uid);
        setQuizzes(fetchedQuizzes);
        toast.success("Quiz deleted successfully");
      } catch (error) {
        console.error("Failed to delete quiz:", error);
        toast.error("Failed to delete quiz");
      }
    }
  }

  const createSampleQuiz = async () => {
    try {
      if (!user) {
        toast.error("You must be logged in to create a quiz");
        return;
      }

      // Check if already creating
      if (isCreatingSample) {
        toast.info("Please wait, generating your quiz... ⏳", { autoClose: 2000 });
        return;
      }

      setIsCreatingSample(true);
      const loadingToast = toast.loading("Creating a random quiz... 🎲");

      // 1. Pick a random quiz from the pool
      const randomIndex = Math.floor(Math.random() * sampleQuizzes.length);
      const randomTemplate = sampleQuizzes[randomIndex];

      // 2. Prepare the payload with CURRENT user details
      const newQuizData = {
        ...randomTemplate,
        _id: uuidv4(), // Generate explicit ID
        creatorId: user.uid,
        creatorName: user.displayName || "Anonymous",
        numberOfQuestions: randomTemplate.questionList.length,
        dateCreated: new Date().toISOString()
      };

      console.log("[CreateSample] Payload:", newQuizData);

      // 3. Create via API
      const result = await createQuiz(newQuizData);
      console.log("[CreateSample] API Result:", result);

      // 4. Refresh List with slight delay to ensure DB write
      setTimeout(async () => {
        const fetchedQuizzes = await fetchTeacherQuizes(user.uid);
        console.log("[CreateSample] Refetched Quizzes:", fetchedQuizzes);
        setQuizzes(fetchedQuizzes);

        // Update toast and reset state
        toast.update(loadingToast, { render: `Generated: ${newQuizData.name} 🎉`, type: "success", isLoading: false, autoClose: 3000 });
        setIsCreatingSample(false);
      }, 1000); // Increased delay slightly for better UX pacing

    } catch (error) {
      console.error("Failed to create sample:", error);
      toast.dismiss(); // Clear loading toast if any
      toast.error("Failed to generate sample quiz");
      setIsCreatingSample(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#2563eb] font-sans pb-10">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userDetails ? (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h1 className="text-4xl font-black text-white mb-2 shadow-text-sm">My Dashboard</h1>
                <p className="text-blue-100 font-medium">Welcome back, <span className="text-white font-bold">{userDetails.firstName || userDetails.displayName}</span></p>
              </div>
              <button
                className="bg-white/10 text-white hover:bg-white hover:text-blue-600 px-6 py-2 rounded-lg transition-all font-bold border border-white/20"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-white rounded-full"></span>
                Your Quizzes
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Create New Card */}
                <div
                  onClick={handleCreate}
                  className="group bg-blue-500 border-dashed border-2 border-white/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-400 hover:border-white transition-all duration-300 min-h-[200px] md:min-h-[250px]"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white group-hover:text-blue-600 text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">Create New Quiz</h3>
                </div>

                {/* Create Sample Button - Moved to Top */}
                <div onClick={createSampleQuiz} className="group bg-green-500 border-dashed border-2 border-white/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-green-400 hover:border-white transition-all duration-300 min-h-[200px] md:min-h-[250px]">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white group-hover:text-green-600 text-white transition-all">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Create Sample Quiz</h3>
                </div>

                {quizzes && quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <div
                      key={quiz._id}
                      onClick={() => handleQuizClick(quiz._id)}
                      className="bg-white rounded-2xl p-6 shadow-card cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col justify-between min-h-[200px] md:min-h-[250px] relative overflow-hidden group border-b-4 border-gray-200 hover:border-blue-500"
                    >
                      {/* Delete Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(quiz._id); }}
                        className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Quiz"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>

                      <div>
                        {/* Quiz Icon Placeholder */}
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600 font-black text-xl">
                          {quiz.name.charAt(0).toUpperCase()}
                        </div>

                        <h4 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">{quiz.name}</h4>

                        <div className="flex gap-2 mb-3">
                          {quiz.questionType === 'TrueFalse' && <span className="text-[10px] uppercase font-bold bg-purple-100 text-purple-600 px-2 py-1 rounded">True/False</span>}
                          {quiz.gameMode === 'RapidFire' && <span className="text-[10px] uppercase font-bold bg-yellow-100 text-yellow-600 px-2 py-1 rounded">Rapid Fire ⚡</span>}
                          {(!quiz.questionType && !quiz.gameMode) && <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">Quiz</span>}
                        </div>

                        <p className="text-gray-500 text-sm line-clamp-2 font-medium">{quiz.description || "No description provided."}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-wide">
                        <span>{quiz.questionList ? quiz.questionList.length : 0} Qs</span>
                        <span className="group-hover:text-blue-600 transition-colors">Open</span>
                      </div>
                    </div>
                  ))
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
