import React from 'react'
import './Create.css'
import LeftSidebar from './LeftSidebar'
import Mainbody from './Mainbody'
import Navbar from './Navbar'
import RightSidebar from './RightSidebar'
// import { Question } from '../../context/QuestionContext';

export default function Create() {
  // const { quiz } = useContext(Question);
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
