import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase/Firebase';
import { createUser } from '../Api/Api'
import { Question } from '../../context/QuestionContext';
import { FcGoogle } from 'react-icons/fc';

function SignInWithGoogle() {
  const { setQuiz } = useContext(Question);
  const navigate = useNavigate()

  function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      console.log(result);
      const user = result.user
      if (result.user) {
        const userData = {
          uid: user.uid,
          mail: user.email,
          firstName: user.displayName,
          lastName: "",
        };

        setQuiz(prevQuiz => ({
          ...prevQuiz,
          creatorId: user.uid,
        }));

        const dataRecieved = await createUser(userData);
        console.log(dataRecieved);
        navigate('/dashboard')
      }
    })
  }

  return (
    <div className="w-full">
      <button
        onClick={googleLogin}
        className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
      >
        <FcGoogle className="text-2xl" />
        <span>Continue with Google</span>
      </button>
    </div>
  )
}

export default SignInWithGoogle