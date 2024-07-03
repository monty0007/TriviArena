import React, { useEffect, useState } from 'react'
import './App.css'
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

function App() {
  const [user, setUser] = useState()
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user)
    })
  })

  const routes = [
    {
      path: '/',
      element: <Mainpage />,
    },
    {
      path: '/create',
      element: <Create />,
    },
    {
      path: '/join',
      element: <Join />,
    },
    {
      path: '/login',
      element: user ? <Navigate to="/dashboard" /> : <Login />,
      // element: <Login/>
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
    {
      path: '/host',
      element: <Host />,
    },
    {
      path: '/display',
      element: <AfterHost />,
    }
  ]

  const Component = useRoutes(routes)
  return (
    <>
      {Component}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App
