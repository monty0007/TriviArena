import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { auth } from '../Firebase/Firebase'
import { useNavigate } from 'react-router-dom'
import SignInWithGoogle from './SignInWithGoogle'
import { toast } from "react-toastify";

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
      toast.success("User logged in Successfully",{
        position: "top-center"
      });
      navigate('/dashboard')
    } catch (error) {
      console.log(error.message)
      toast.error("Login failed: " + error.message),{
        position: "top-center"
      };
    }
  }

  return (
    <div className="form-container sign-in-container">
      <form className='login-form' onSubmit={handleSubmit}>
        <h3>Login</h3>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
        <p className="forgot-password">
          New user ? <br></br> <a href="/register">Register Here</a>
        </p>
        <SignInWithGoogle/>
      </form>
    </div>
  )
}

export default Login
