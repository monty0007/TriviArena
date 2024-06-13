import React from 'react'
import './Create.css'
import LeftSidebar from './LeftSidebar'
import Mainbody from './Mainbody'
import Navbar from './Navbar'
import RightSidebar from './RightSidebar'

export default function Create() {
  return (
    <div className='create'>
        <Navbar/>
        <div className="bodie">
        <LeftSidebar/>
        <Mainbody/>
        <RightSidebar/>
        </div>
    </div>
  )
}
