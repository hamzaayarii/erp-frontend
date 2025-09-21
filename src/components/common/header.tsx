import React from 'react'
import { BsPersonCircle } from 'react-icons/bs'
import { IoNotifications } from 'react-icons/io5'
import { AiFillSetting } from 'react-icons/ai'
import { RiShutDownLine } from 'react-icons/ri'
import { FaLock } from 'react-icons/fa'
import { BiSearch } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-row justify-between items-center'>
      <div>Pages / <span className='font-bold text-[#2D3748]'>{title}</span></div>
      
      <div className='w-96 relative'>
        <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className='flex flex-row gap-4 justify-center items-center'>
      <div className='flex flex-col items-center'>
          <RiShutDownLine className="w-6 h-6 fill-[#718096]"/>
          <div className='flex items-center'>
            <span className='w-4 h-4' />
            <FaLock className="w-3 h-3 fill-[#E53E3E]" />
          </div>
        </div>
        <div className='flex flex-col items-center'>
          <IoNotifications className="w-6 h-6 fill-[#718096]"/>
          <div className='flex items-center'>
            <span className='w-4 h-4' />
            <FaLock className="w-3 h-3 fill-[#E53E3E]" />
          </div>
        </div>
        <button
          type="button"
          className='flex flex-col items-center cursor-pointer focus:outline-none'
          onClick={() => navigate('/dashboard/Settings')}
          aria-label="Open settings"
          title="Settings"
        >
          <AiFillSetting className="w-6 h-6 fill-[#718096]"/>
          <div className='flex items-center'>
            <span className='w-4 h-4' />
            <FaLock className="w-3 h-3 fill-[#E53E3E]" />
          </div>
        </button>
        <div className='flex flex-col items-center'>
          <BsPersonCircle className="w-6 h-6 fill-[#718096]" />
          <div className='flex items-center'>
            <span className='w-4 h-4' />
            <FaLock className="w-3 h-3 fill-[#E53E3E]" />
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Header