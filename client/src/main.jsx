import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import QuestionContext from './context/QuestionContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <QuestionContext>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </QuestionContext>
  // </React.StrictMode>
)
