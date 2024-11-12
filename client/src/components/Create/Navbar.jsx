import React, { useContext } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Question } from '../../context/QuestionContext'
import io from 'socket.io-client'
import { updateQuiz, createQuiz } from '../Api/Api'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export default function Navbar() {
  let navigate = useNavigate()
  let location = useLocation()
  // const socket = io('https://socket-kahoot.onrender.com');

  const { mainQuestion, quiz, setQuiz, displayQuestion, setMainQuestion } =
    useContext(Question)

  const handleSave = async () => {
    // Check if the necessary fields are filled
    const { answerTime, questionType, pointType, name } = quiz
    if (!answerTime || !questionType || !pointType || !name) {
      toast.error('Please fill all the required fields', {
        position: 'top-center',
      })
      return
    }

    const updatedQuestions = mainQuestion.map((question) =>
      question.questionIndex === displayQuestion.questionIndex
        ? displayQuestion
        : question
    )

    setMainQuestion(updatedQuestions)

    const newQuizId = quiz._id || uuidv4()
    const updatedQuiz = {
      ...quiz,
      _id: newQuizId,
      questionList: updatedQuestions,
      numberOfQuestions: updatedQuestions.length,
    }

    setQuiz(updatedQuiz)

    try {
      const result = await Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      })

      if (result.isConfirmed) {
        if (quiz._id) {
          console.log('Updating quiz with id: ', quiz._id)
          await updateQuiz(quiz._id, updatedQuiz)
          toast.success('Data Updated Successfully', {
            position: 'top-right',
          })
        } else {
          console.log('Creating new quiz')
          await createQuiz(updatedQuiz)
          toast.success('Data Saved Successfully', {
            position: 'top-right',
          })
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    } catch (error) {
      toast.error('Error saving quiz. Please try again.', {
        position: 'top-center',
      })
      console.error('Error saving quiz:', error)
    }
  }

  const handleHost = () => {
    navigate('/host')
  }

  const routeChange = () => {
    navigate('/')
  }

   // Determine the navbar background color based on the current route
   const navbarStyle = { 
    backgroundColor: location.pathname === '/dashboard' ? '#00e7b5' : 'white',
    borderBottomColor: location.pathname === '/dashboard' ? 'white' : 'black',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
  }

  return (
    <div>
      <div className="main" style={navbarStyle}>
        <div className="title">
          <img className="img2" src="quiz.png" alt="" />
          {/* <Link className='link' to='/'>XRCentral</Link> */}
        </div>
        <div>
          {location.pathname === '/create' && (
            <>
              <button className="navbar-btn" onClick={handleSave}>
                Save
              </button>
              <button className="navbar-btn" onClick={handleHost}>
                Host
              </button>
            </>
          )}
        </div>
        <div>
          <button className="navbar-btn" onClick={routeChange}>
            Exit
          </button>
        </div>
        {/* <div className='search'>
        <input className='input2' type="text" placeholder='Enter Game Title' />
        <button className='navbar-btn'>Search</button>
      </div> */}
      </div>

      <div className="rainbow-line"></div>
    </div>
  )
}
