import React from 'react'
import './Join.css'

export default function Join() {
  return (
    <div className="container">
      <img className='img1' src="loading-xrc.png" alt="" />
      <h1>XrCentral</h1>
      <div className="box">
        <div className="pin">
          <input className='input' type="number" placeholder="Game Pin" />
        </div>
        <div className='button'>
          <button className="btn">Join</button>
        </div>
      </div>
    </div>
  )
}
