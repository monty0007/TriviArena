import React, { useContext } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Question } from '../../context/QuestionContext';
import io from 'socket.io-client';

export default function Navbar() {
  let navigate = useNavigate()
  let location = useLocation()
  const socket = io('http://localhost:3000')

  const {
    mainQuestion
  } = useContext(Question);

  const routeChange = () => {
    navigate('/')
  }

  const handleClick=()=>{
    socket.emit('addQuestion', mainQuestion);
    navigate('/host')
  }

  return (
    <div className='main'>
      <div className="title">
        <img className='img2' src="loading-xrc.png" alt="" />
        <Link className='link' to='/'>XrCentral</Link>
        {/* <h2>XrCentral</h2> */}
      </div>
      <div className=''>
        <button className='navbar-btn' onClick={routeChange}>Exit</button>
        {location.pathname === '/create' && (
          <button className='navbar-btn' onClick={handleClick}>Host</button>
        )}
        <button className='navbar-btn'>Save</button>
      </div>
      <div className='search'>
        <input className='input2' type="text" placeholder='Enter Game Title' />
        <button className='navbar-btn'>Search</button>
      </div>
    </div>
  )
}
