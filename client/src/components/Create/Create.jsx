import React from 'react'
import LeftSidebar from './LeftSidebar'
import Mainbody from './Mainbody'
import Navbar from './Navbar'
import RightSidebar from './RightSidebar'

export default function Create() {
  return (
    <div className='flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans'>
      <Navbar />
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <LeftSidebar />
        <Mainbody />
        <RightSidebar />
      </div>
    </div>
  )
}
