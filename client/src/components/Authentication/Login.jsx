import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { auth } from '../Firebase/Firebase'
import { useNavigate, Link } from 'react-router-dom'
import SignInWithGoogle from './SignInWithGoogle'
import { toast } from 'react-toastify'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log('User logged in Succesfully')
      toast.success('User logged in Successfully', { position: 'top-center' })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.log(error.message)
      toast.error('Login failed: ' + error.message, { position: 'top-center' })
    }
  }

  return (
    <div className="min-h-screen bg-[#2563eb] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Navigation - Top Left Back Button */}
      <nav className="absolute top-0 left-0 w-full p-6 z-20 flex justify-start items-center pointer-events-none">
        <Link to="/" className="pointer-events-auto text-white hover:bg-white/10 px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 border border-transparent hover:border-white/20">
          <span>←</span> Back
        </Link>
      </nav>
      {/* Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[5%] w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-[5%] right-[5%] w-32 h-32 bg-white/10 rounded-lg transform rotate-12"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-card p-8 md:p-10 z-10 relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-800 mb-2">Log in</h1>
          <p className="text-gray-500 font-medium">Welcome back!</p>
        </div>

        <SignInWithGoogle />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 font-bold">OR</span>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-gray-100 border-2 border-transparent text-gray-800 rounded px-4 py-3 focus:outline-none focus:bg-white focus:border-gray-300 transition-colors font-medium placeholder-gray-400"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full bg-gray-100 border-2 border-transparent text-gray-800 rounded px-4 py-3 focus:outline-none focus:bg-white focus:border-gray-300 transition-colors font-medium placeholder-gray-400"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#333] hover:bg-black text-white font-bold text-lg py-3 px-4 rounded shadow-button active:shadow-button-active active:translate-y-1 transition-all"
          >
            Log in
          </button>

          <p className="text-center text-gray-500 text-sm mt-6 font-medium">
            New here? <Link to="/register" className="text-blue-600 hover:underline font-bold">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
