import React from 'react'
import { Link } from 'react-router-dom'
import './MainPage.css'


function Mainpage() {
  return (
      <div className="container">
        <div className='title'>
            {/* <h1>TriviArena</h1> */}
            <img className='img1' src="quiz.png" alt="" />
        </div>
        <div className="button">
          <Link to={'/login'}>
            <button className="btn">Create</button>
          </Link>
          
            <Link to={'/join'}>
              <button className="btn">Join</button>
            </Link>
          </div>
        </div>
      
      
  )
}

export default Mainpage
