import React from 'react'
import { Link } from 'react-router-dom'
import './MainPage.css'


function Mainpage() {
  return (
      <div className="container">
        <div className='title'>
            <img className='img1' src="loading-xrc.png" alt="" />
            <h1>XRCentral</h1>
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
