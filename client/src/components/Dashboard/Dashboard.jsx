import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../Firebase/Firebase'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Create/Navbar'
import { fetchTeacherQuizes, fetchQuiz, deleteQuiz, createQuiz, getUser } from '../Api/Api' // Updated Import
import { Question } from '../../context/QuestionContext'
import { sampleQuizzes } from '../../data/sampleQuizzes' // Import Sample Data
import { toast } from 'react-toastify'

import { v4 as uuidv4 } from 'uuid'; // Add UUID import
import Swal from 'sweetalert2'

function Dashboard() {
  const user = auth.currentUser
  const [userDetails, setUserDetails] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [isCreatingSample, setIsCreatingSample] = useState(false); // Rate limiting state
  const navigate = useNavigate()

  const { setQuiz, setMainQuestion, setDisplayQuestion, displayQuestion, setValidationError, setRoom } = useContext(Question)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        // console.log("Auth User:", currentUser);

        // 1. Fetch deep user details from Backend (MongoDB) to get firstName/lastName
        try {
          const backendUser = await getUser(currentUser.uid);
          // console.log("Backend User:", backendUser);

          if (backendUser) {
            // Merge Firebase auth user with Backend user data
            setUserDetails({ ...currentUser, ...backendUser });
          } else {
            // 404 Case: User exists in Firebase but not MongoDB (e.g. env switch). Auto-Sync!
            // console.log("User missing in DB, syncing...");
            const nameParts = (currentUser.displayName || "").split(" ");
            const firstName = nameParts[0] || "User";
            const lastName = nameParts.slice(1).join(" ") || "";

            const newUserData = {
              uid: currentUser.uid,
              mail: currentUser.email,
              firstName,
              lastName,
            };
            await createUser(newUserData);

            // Use the fresh data
            setUserDetails({ ...currentUser, ...newUserData });
          }

          // 2. Fetch Quizzes
          const fetchedQuizzes = await fetchTeacherQuizes(currentUser.uid)
          setQuizzes(fetchedQuizzes)

        } catch (error) {
          console.error("Error fetching data:", error)
          setUserDetails(currentUser); // Ensure we at least have the auth user
          toast.error("Failed to load full profile")
        }
      } else {
        setUserDetails(null)
        setQuizzes([])
      }
    })
    return () => unsubscribe()
  }, [])

  const handleQuizClick = async (quizId) => {
    const quizData = await fetchQuiz(quizId)
    if (quizData) {
      setSelectedQuiz(quizData)
      setQuiz(quizData)
      setMainQuestion(quizData.questionList)
      setDisplayQuestion(quizData.questionList[0])
      setValidationError({}) // Reset validation

      // Explicitly persist data for refresh safety
      sessionStorage.setItem('creator_quiz', JSON.stringify(quizData))
      sessionStorage.setItem('creator_questions', JSON.stringify(quizData.questionList))

      navigate('/create')
    }
  }

  async function handleLogout() {
    try {
      await auth.signOut()
      navigate('/login')
    } catch (error) {
      // console.log('Error logging out: ', error.message)
    }
  }

  const handleCreate = async () => {
    // console.log("Create New Quiz clicked");

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
    const result = await Swal.fire({
      title: 'Delete Quiz?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusConfirm: false,
      background: '#ffffff',
      backdrop: `rgba(28, 25, 23, 0.4)`,
      customClass: {
        popup: 'rounded-2xl shadow-xl border border-gray-100 font-sans',
        title: 'text-2xl font-black text-gray-800',
        htmlContainer: 'text-gray-600',
        confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg px-6 py-3 shadow-md hover:shadow-lg transition-all',
        cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg px-6 py-3 hover:shadow-md transition-all',
        actions: 'gap-4 w-full flex justify-center mt-4'
      }
    });

    if (result.isConfirmed) {
      try {
        await deleteQuiz(quizId);
        const fetchedQuizzes = await fetchTeacherQuizes(user.uid);
        setQuizzes(fetchedQuizzes);

        // Optional: Show success toast or small swal
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

      // console.log("[CreateSample] Payload:", newQuizData);

      // 3. Create via API
      const result = await createQuiz(newQuizData);
      // console.log("[CreateSample] API Result:", result);

      // 4. Refresh List with slight delay to ensure DB write
      setTimeout(async () => {
        const fetchedQuizzes = await fetchTeacherQuizes(user.uid);
        // console.log("[CreateSample] Refetched Quizzes:", fetchedQuizzes);
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

  const handleHostGame = async (e, quizId) => {
    e.stopPropagation();
    const quizData = await fetchQuiz(quizId)
    if (!quizData) {
      toast.error('Error loading quiz')
      return
    }
    if (!quizData.questionList || quizData.questionList.length === 0) {
      toast.error('Quiz must have at least 1 question to host')
      return
    }

    // Set Context
    setQuiz(quizData)
    setMainQuestion(quizData.questionList)
    setDisplayQuestion(quizData.questionList[0])

    // Generate Room PIN (4 digits)
    const newRoom = Math.floor(1000 + Math.random() * 9000).toString()
    setRoom(newRoom)

    // Persist to SessionStorage to ensure Host page has data immediately and on refresh
    sessionStorage.setItem('host_room', newRoom);
    sessionStorage.setItem('host_questions', JSON.stringify(quizData.questionList));
    sessionStorage.setItem('host_quiz', JSON.stringify(quizData));


    // Navigate to Host
    navigate('/host')
  }

  return (
    <div className="min-h-[100dvh] bg-[#2563eb] font-sans pb-20 overflow-x-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userDetails ? (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h1 className="text-4xl font-black text-white mb-2 shadow-text-sm">My Dashboard</h1>
                <p className="text-blue-100 font-medium">Welcome back, <span className="text-white font-bold">{userDetails.firstName || userDetails.displayName}</span></p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={createSampleQuiz}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-all font-bold shadow-lg hover:shadow-green-500/30 flex items-center gap-2 border border-white/20"
                >
                  <span>🎲</span>
                  <span className="whitespace-nowrap">Generate Sample</span>
                </button>
                <button
                  className="bg-white/10 text-white hover:bg-white hover:text-blue-600 px-6 py-2 rounded-lg transition-all font-bold border border-white/20"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-white rounded-full"></span>
                Your Quizzes
              </h2>

              <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                {/* Create New Card - Mobile: Compact Row, Desktop: Large Card */}
                <div
                  onClick={handleCreate}
                  className="group bg-blue-500 border-dashed border-2 border-white/30 rounded-xl p-4 md:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center cursor-pointer hover:bg-blue-400 hover:border-white transition-all duration-300 md:min-h-[250px] shadow-sm md:shadow-none"
                >
                  <div className="flex items-center gap-3 md:flex-col md:gap-0">
                    <div className="w-10 h-10 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center md:mb-4 group-hover:scale-110 group-hover:bg-white group-hover:text-blue-600 text-white transition-all shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-white">Create New Quiz</h3>
                  </div>
                  <div className="md:hidden text-white/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                  </div>
                </div>


                {quizzes && quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <div
                      key={quiz._id}
                      onClick={() => handleQuizClick(quiz._id)}
                      className="bg-white rounded-xl p-3 md:p-6 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 flex flex-row md:flex-col items-center md:items-start md:justify-between relative overflow-hidden group border-l-4 md:border-l-0 md:border-b-4 border-gray-200 hover:border-blue-500 md:min-h-[250px] gap-3 md:gap-0"
                    >
                      {/* Delete Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(quiz._id); }}
                        className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-1.5 md:p-2 bg-gray-50 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all md:opacity-0 md:group-hover:opacity-100"
                        title="Delete Quiz"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>

                      <div className="flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-0 flex-1 min-w-0">
                        {/* Quiz Icon */}
                        <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-blue-100 rounded-lg flex items-center justify-center md:mb-4 text-blue-600 font-black text-lg md:text-xl border border-blue-50">
                          {quiz.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm md:text-xl font-bold text-gray-800 md:mb-2 leading-tight truncate">{quiz.name}</h4>

                          <div className="flex gap-2 md:mb-3 mt-1 scale-90 md:scale-100 origin-left">
                            {quiz.questionType === 'TrueFalse' && <span className="text-[9px] md:text-[10px] uppercase font-bold bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">True/False</span>}
                            {quiz.gameMode === 'RapidFire' && <span className="text-[9px] md:text-[10px] uppercase font-bold bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded">Rapid Fire</span>}
                            {(!quiz.questionType && !quiz.gameMode) && <span className="text-[9px] md:text-[10px] uppercase font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Quiz</span>}
                            <span className="text-[9px] md:text-xs text-gray-400 font-bold uppercase tracking-wide md:hidden ml-2">{quiz.questionList ? quiz.questionList.length : 0} Qs</span>
                          </div>

                          <p className="text-gray-500 text-sm line-clamp-2 font-medium hidden md:block">{quiz.description || "No description provided."}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleHostGame(e, quiz._id)}
                        className="md:mt-4 w-auto md:w-full bg-[#46178f] hover:bg-[#3d1380] text-white font-bold py-1.5 px-3 md:py-2 rounded-lg transition-colors shadow-sm md:shadow-md z-20 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-base shrink-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden md:inline">Host Game</span>
                        <span className="md:hidden">Host</span>
                      </button>

                      <div className="mt-4 pt-4 border-t border-gray-100 justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-wide w-full hidden md:flex">
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
    </div >
  )
}

export default Dashboard
