import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../Firebase/Firebase';
import { setDoc,doc } from "firebase/firestore";
import {createUser} from '../Api/Api'
import { Question } from '../../context/QuestionContext';

function SignInWithGoogle() {
  const {
    quiz,
    setQuiz,
  } = useContext(Question);

  const navigate=useNavigate()

  function googleLogin(){
    const provider=new GoogleAuthProvider();
    signInWithPopup(auth,provider).then(async(result)=>{
        console.log(result);
        const user=result.user
        if(result.user){
            // await setDoc(doc(db, "Users", user.uid),{
            //     email: user.email,
            //     firstName: user.displayName,
            //     lastName: ""
            //   })

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

              const dataRecieved=  await createUser(userData);
              console.log(dataRecieved);
            navigate('/dashboard')
        }
    })
  }

  return (
    <div>
        <p>--Or continue with--</p>
        <div className='google-logo' onClick={googleLogin}>
            <img className='google-image' src="google.png"/>
        </div>
    </div>
  )
}

export default SignInWithGoogle