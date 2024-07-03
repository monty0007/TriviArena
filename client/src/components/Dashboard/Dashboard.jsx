import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../Firebase/Firebase'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Create/Navbar'
import './Dashboard.css'
import { fetchTeacherQuizes, fetchQuiz } from '../Api/Api'
import { Question } from '../../context/QuestionContext'

function Dashboard() {
  const user = auth.currentUser
  const [userDetails, setUserDetails] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const navigate = useNavigate()

  const {
    quiz,
    setQuiz,
    setMainQuestion,
    displayQuestion,
    setDisplayQuestion,
  } = useContext(Question)

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserDetails(user)
        // Fetch quizzes for the user
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
      // jo main quiz hai usko is quiz ki value se replace kardo same qui ho to hai
      setQuiz(quizData)
      setMainQuestion(quizData.questionList)
      setDisplayQuestion(quizData.questionList[0])
      console.log('old : ', displayQuestion)
      // phir jaha pe poore quiz ko modify karte hai vaha navigate karlo
      navigate('/create')
    }
    // Optionally navigate to a quiz detail page or show details in a modal
    // navigate(`/quiz/${quizId}`);
  }

  async function handleLogout() {
    try {
      await auth.signOut()
      navigate('/login')
      console.log('User logged out successfully')
    } catch (error) {
      console.log('Error logging out: ', error.message)
    }
  }

  const handleCreate = async () => {
    // Reset the quiz to ensure it opens as an empty quiz
    setQuiz({
      name: '',
      creatorId: user.uid,
      creatorName: user.displayName || '',
      numberOfQuestions: 0,
      questionList: [],
    })
    setMainQuestion([])
    setDisplayQuestion(null) // Ensure displayQuestion is handled safely

    navigate('/create')
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        {userDetails ? (
          <>
            <div className="top-right">
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </div>
            <div className="center">
              <h3>
                Welcome {userDetails.firstName || userDetails.displayName}{' '}
                {userDetails.lastName} 🙏🙏
              </h3>
              {/* Additional user details can be displayed here if needed */}
            </div>
            <div className="allquiz">
              <div className="dashboard-button">
                <img
                  className="plus"
                  src="plus.jpg"
                  alt=""
                  onClick={handleCreate}
                />
              </div>
                <h2>Previous Quizzes : </h2>
              <div className="quiz-list">
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <div
                      key={quiz._id}
                      className="quiz-item"
                      onClick={() => handleQuizClick(quiz._id)}
                    >
                      <h4>{quiz.name}</h4>
                      <p>{quiz.description}</p>
                    </div>
                  ))
                ) : (
                  <p>No quizzes available.</p>
                )}
              </div>
              {selectedQuiz && (
                <div className="quiz-detail">
                  <h2>{selectedQuiz.name}</h2>
                  <p>{selectedQuiz.description}</p>
                  {/* Add more details about the selected quiz */}
                </div>
              )}
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
