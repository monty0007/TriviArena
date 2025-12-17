import React, { useContext } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Question } from '../../context/QuestionContext'
import { updateQuiz, createQuiz } from '../Api/Api'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export default function Navbar(props) {
  let navigate = useNavigate()
  let location = useLocation()

  const { mainQuestion, quiz, setQuiz, displayQuestion, setMainQuestion, setValidationError, setRoom, hasUnsavedChanges, setHasUnsavedChanges, markQuizAsSaved } = useContext(Question)

  const handleSave = async (checkConfirmation = true) => {
    // Check if the necessary fields are filled
    // 0. Initialize consolidated errors object
    let consolidatedErrors = {};

    // 1. Validate Settings
    const { answerTime, questionType, pointType, name } = quiz
    if (!name) consolidatedErrors.name = true;
    if (!questionType) consolidatedErrors.questionType = true;
    if (!pointType) consolidatedErrors.pointType = true;
    if (!answerTime) consolidatedErrors.answerTime = true;

    // 2. Validate Questions (check ALL questions, even if settings failed to show complete picture)
    // Only warn about empty question list if it's truly empty AND we are trying to save
    if (!mainQuestion || mainQuestion.length === 0) {
      // We can't really highlight a missing question list visually other than a toast, 
      // but we'll let the toast handle the blocking for empty list specifically.
      toast.error('Please add at least one question', { position: 'top-center' })
      setValidationError(consolidatedErrors); // Show settings errors if any
      return false
    }

    let firstInvalidQuestion = null;

    for (let i = 0; i < mainQuestion.length; i++) {
      const q = mainQuestion[i];

      // 2a. Check Question Text
      if (!q.question || q.question.trim() === '') {
        consolidatedErrors.question = true; // Use global key for current question view
        if (!firstInvalidQuestion) firstInvalidQuestion = q;
      }

      // 2b. Check Options
      q.answerList.forEach(a => {
        if ((a.name === 'option1' || a.name === 'option2') && (!a.body || a.body.trim() === '')) {
          consolidatedErrors[a.name] = true;
          if (!firstInvalidQuestion) firstInvalidQuestion = q;
        }
      });

      // 2c. Check Correct Answer
      const hasCorrect = q.answerList.some(a => a.isCorrect);
      if (!hasCorrect) {
        consolidatedErrors.correctOption = true;
        if (!firstInvalidQuestion) firstInvalidQuestion = q;
      }

      // Note: In a multi-question scenario, highlighting errors on *other* (non-visible) questions 
      // is tricky with a single `validationError` object unless we scope it by ID. 
      // For now, we will flag the *types* of errors found. 
      // If we find an invalid question, we will switch to it so the user sees the red fields.
      if (firstInvalidQuestion && firstInvalidQuestion.questionIndex === q.questionIndex) {
        // If this is the first bad question, we capture its specific errors into our main error object 
        // so they light up immediately when we switch to it.
        // The current logic above already sets keys like 'question', 'option1', etc. 
        // which naturally apply to the currently displayed question context.
      }
    }

    // 3. Final Decision
    if (Object.keys(consolidatedErrors).length > 0) {
      setValidationError(consolidatedErrors);

      // If we have a bad question, switch to it
      if (firstInvalidQuestion) {
        setDisplayQuestion(firstInvalidQuestion);
      }

      toast.error('Please fix the highlighted errors before saving.', { position: 'top-center' });
      return false;
    }

    // Clear errors if all good
    setValidationError({});

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
      if (checkConfirmation) {
        const result = await Swal.fire({
          title: 'Save Quiz?',
          text: "Are you sure you want to save these changes?",
          icon: 'question',
          showCancelButton: false, // Removed Cancel button
          showDenyButton: true,
          confirmButtonText: 'Yes, Save it!',
          denyButtonText: `Don't save`,
          reverseButtons: true, // Puts confirmation on right, safer
          focusConfirm: false,
          background: '#ffffff',
          backdrop: `rgba(28, 25, 23, 0.4)`, // slight dark overlay
          customClass: {
            popup: 'rounded-2xl shadow-xl border border-gray-100 font-sans',
            title: 'text-2xl font-black text-gray-800',
            htmlContainer: 'text-gray-600',
            confirmButton: 'bg-[#46178f] hover:bg-[#3d1380] text-white font-bold rounded-lg px-6 py-3 shadow-md hover:shadow-lg transition-all',
            denyButton: 'bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg px-6 py-3 shadow-md hover:shadow-lg transition-all',
            // cancelButton removed
            actions: 'gap-4 w-full flex justify-center mt-4'
          }
        })

        if (result.isDenied) {
          Swal.fire({
            title: 'Changes Discarded',
            icon: 'info',
            timer: 1500,
            showConfirmButton: false,
            customClass: {
              popup: 'rounded-2xl font-sans'
            }
          })
          return false
        }

        // If dismissed (clicked outside), return false
        if (!result.isConfirmed && !result.isDenied) return false;
      }

      // Proceed to save (either confirmed or checkConfirmation=false)
      if (quiz._id) {
        // console.log('Updating quiz with id: ', quiz._id)
        await updateQuiz(quiz._id, updatedQuiz)
        toast.success('Quiz Updated Successfully! 🚀', { position: 'top-right' })
      } else {
        // console.log('Creating new quiz')
        await createQuiz(updatedQuiz)
        toast.success('Quiz Created Successfully! 🎉', { position: 'top-right' })
      }

      if (typeof markQuizAsSaved === 'function') {
        markQuizAsSaved(); // <--- Update baseline
      } else {
        setHasUnsavedChanges(false); // Fallback
      }
      return true;

    } catch (error) {
      toast.error('Error saving quiz. Please try again.', { position: 'top-center' })
      console.error('Error saving quiz:', error)
      return false;
    }
  }

  const handleHost = async () => {
    // console.log("Handle Host Clicked");
    // console.log("MainQuestion:", mainQuestion);

    // 1. Unsaved Changes Check
    if (hasUnsavedChanges) {
      const result = await Swal.fire({
        title: 'Unsaved Changes!',
        text: "You have unsaved changes. Do you want to save before hosting?",
        icon: 'warning',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save & Host',
        denyButtonText: 'Host Without Saving',
        confirmButtonColor: '#46178f',
        denyButtonColor: '#6b7280',
        cancelButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-2xl shadow-xl font-sans',
          title: 'font-black text-gray-800',
          actions: 'gap-2',
          confirmButton: 'font-bold rounded-lg px-4 py-2',
          denyButton: 'font-bold rounded-lg px-4 py-2',
          cancelButton: 'font-bold rounded-lg px-4 py-2'
        }
      });

      if (result.isConfirmed) {
        // User wants to save first
        const saved = await handleSave(false); // false = skip second confirmation
        if (!saved) return; // Save failed or invalid, don't host
        // Fall through to host logic below if save succeeded
      } else if (result.isDenied) {
        // User wants to proceed anyway
        // Fall through to host logic below
      } else {
        // Cancel logic
        return;
      }
    }

    if (!mainQuestion || mainQuestion.length === 0) {
      // console.log("Validation Failed: No questions");
      toast.error('Please add at least one question before hosting!', { position: 'top-center' });
      return;
    }

    // Generate new Room ID (4 digits)
    const newRoomId = Math.floor(1000 + Math.random() * 9000).toString();
    // console.log("Generated Room:", newRoomId);

    // Update Context
    setRoom(newRoomId);

    // Persist to SessionStorage for Host.jsx recovery
    sessionStorage.setItem('host_room', newRoomId);
    sessionStorage.setItem('host_questions', JSON.stringify(mainQuestion));
    sessionStorage.setItem('host_quiz', JSON.stringify(quiz));

    // console.log("Session Storage Set. Navigating to /host");

    navigate('/host')
  }

  const routeChange = () => {
    if (location.pathname === '/dashboard') {
      navigate('/')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="w-full bg-white border-b-2 border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
            {/* <img className="h-8 w-auto" src="quiz.png" alt="Logo" /> */}
            <h1 className="text-xl md:text-2xl font-black text-[#46178f] tracking-tight">TriviArena</h1>
          </div>

          <div className="flex items-center gap-2 md:space-x-4">
            {location.pathname === '/create' && (
              <>
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 md:px-4 md:py-2 text-xs md:text-base rounded-md font-bold transition-all h-10 flex items-center justify-center whitespace-nowrap"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-[#46178f] hover:bg-[#3d1380] text-white px-3 py-2 md:px-4 md:py-2 text-xs md:text-base rounded-md font-bold transition-all shadow-button hover:shadow-lg h-10 flex items-center justify-center whitespace-nowrap"
                  onClick={handleHost}
                >
                  Host Game
                </button>
              </>
            )}

            {/* Dashboard Actions */}
            {/* Sample Button moved to Dashboard Header */}

            <button
              className="text-gray-500 hover:text-[#46178f] font-bold transition-colors px-2 py-1 md:px-3 md:py-2 text-sm md:text-base whitespace-nowrap"
              onClick={routeChange}
            >
              Back
            </button>
          </div>
        </div>
      </div>
      {/* Rainbow line equivalent - gradient border bottom is handled by border-white/10, but we can add a thin gradient line if desired */}
      <div className="h-[1px] w-full bg-gradient-to-r from-primary-DEFAULT via-white to-secondary-DEFAULT opacity-50"></div>
    </div>
  )
}
