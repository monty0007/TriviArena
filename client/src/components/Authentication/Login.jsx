import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { auth } from '../Firebase/Firebase'
import { useNavigate } from 'react-router-dom'
import SignInWithGoogle from './SignInWithGoogle'
import { toast } from 'react-toastify'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  //Need to imlement toast later on
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log('User logged in Succesfully')
      toast.success('User logged in Successfully', {
        position: 'top-center',
      })
      navigate('/dashboard')
    } catch (error) {
      console.log(error.message)
      toast.error('Login failed: ' + error.message),
        {
          position: 'top-center',
        }
    }
  }

  return (
    <div className="form-container sign-in-container">
      {/* <div className="banner"> */}
        {/* <img src="quiz.png" alt="" /> */}
      {/* </div> */}
      {/* <div className="details"> */}
        <form className="login-form" onSubmit={handleSubmit}>
          <h3>Welcome Back!</h3>
          <p>Continue with Google or enter your details.</p>


          <SignInWithGoogle />

          <div className="text">
            {/* <label>Email address</label> */}
            <p>Username</p>
            <input
              type="email"
              className="form-control"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="text">
            {/* <label>Password</label> */}
            <p>Password</p>
            <input
              type="password"
              className="form-control"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="button">
              Login
            </button>
          </div>
          <p className="forgot-password">
            Don't have an account? <a href="/register">Register Here</a>
          </p>
        </form>
      </div>
    // </div>
  )
}

export default Login
