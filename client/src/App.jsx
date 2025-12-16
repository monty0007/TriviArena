import React, { useEffect, useState } from 'react'

import Mainpage from './components/Mainpage'
import { Navigate, useRoutes } from 'react-router-dom'
import Create from './components/Create/Create'
import Join from './components/Join/Join'
import Login from './components/Authentication/Login'
import Register from './components/Authentication/Register'
import { ToastContainer } from 'react-toastify'
import Dashboard from './components/Dashboard/Dashboard'
import { auth } from './components/Firebase/Firebase'
import 'react-toastify/dist/ReactToastify.css'
import Host from './components/Host/Host'
import AfterHost from './components/Host/AfterHost'
import Answers from './components/Answers/Answers'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    )
  }

  const routes = [
    {
      path: '/',
      element: <Mainpage />,
    },
    {
      path: '/create',
      element: user ? <Create /> : <Navigate to="/login" replace />,
    },
    {
      path: '/join',
      element: <Join />,
    },
    {
      path: '/login',
      element: user ? <Navigate to="/dashboard" replace /> : <Login />,
    },
    {
      path: '/register',
      element: user ? <Navigate to="/dashboard" replace /> : <Register />,
    },
    {
      path: '/dashboard',
      element: user ? <Dashboard /> : <Navigate to="/login" replace />,
    },
    {
      path: '/host',
      element: user ? <Host /> : <Navigate to="/login" replace />,
    },
    {
      path: '/display',
      element: user ? <AfterHost /> : <Navigate to="/login" replace />,
    }, {
      path: '/answers',
      element: user ? <Answers /> : <Navigate to="/login" replace />,
    }
  ]

  const Component = useRoutes(routes)
  return (
    <>
      {Component}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        toastClassName="shadow-lg"
      />
    </>
  )
}

export default App
