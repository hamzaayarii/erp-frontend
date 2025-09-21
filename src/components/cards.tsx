import React from 'react'
import { BsPersonBoundingBox } from 'react-icons/bs'

const Cards = () => {
  return (
    <div className='flex flex-row gap-6 justify-start items-center'>
      {/* Candidates */}
      <div className='w-72 h-20 rounded-[15px] bg-white flex flex-row justify-between items-center px-5'>
        <div> 
          <h1 className='font-bold text-[#A0AEC0]'>Candidates</h1>
          <p className='font-extrabold text-[#2D3748]'>5</p>
        </div>
        <div className='bg-[#4A74E0] rounded-xl p-2 w-10 h-10 flex flex-row justify-between items-center'> 
          <BsPersonBoundingBox className="w-6 h-6 fill-white"/> 
        </div>
      </div>

      {/* Interns */}
      <div className='w-72 h-20 rounded-[15px] bg-white flex flex-row justify-between items-center px-5'>
        <div> 
          <h1 className='font-bold text-[#A0AEC0]'>Interns</h1>
          <p className='font-extrabold text-[#2D3748]'>12</p>
        </div>
        <div className='bg-[#4A74E0] rounded-xl p-2 w-10 h-10 flex flex-row justify-between items-center'> 
          <BsPersonBoundingBox className="w-6 h-6 fill-white"/> 
        </div>
      </div>

      {/* Project In Progress */}
      <div className='w-72 h-20 rounded-[15px] bg-white flex flex-row justify-between items-center px-5'>
        <div> 
          <h1 className='font-bold text-[#A0AEC0]'>Project In Progress</h1>
          <p className='font-extrabold text-[#2D3748]'>8</p>
        </div>
        <div className='bg-[#4A74E0] rounded-xl p-2 w-10 h-10 flex flex-row justify-between items-center'> 
          <BsPersonBoundingBox className="w-6 h-6 fill-white"/> 
        </div>
      </div>

      {/* Program In Progress */}
      <div className='w-72 h-20 rounded-[15px] bg-white flex flex-row justify-between items-center px-5'>
        <div> 
          <h1 className='font-bold text-[#A0AEC0]'>Program In Progress</h1>
          <p className='font-extrabold text-[#2D3748]'>3</p>
        </div>
        <div className='bg-[#4A74E0] rounded-xl p-2 w-10 h-10 flex flex-row justify-between items-center'> 
          <BsPersonBoundingBox className="w-6 h-6 fill-white"/> 
        </div>
      </div>

      {/* Topics In Progress */}
      <div className='w-72 h-20 rounded-[15px] bg-white flex flex-row justify-between items-center px-5'>
        <div> 
          <h1 className='font-bold text-[#A0AEC0]'>Topics In Progress</h1>
          <p className='font-extrabold text-[#2D3748]'>15</p>
        </div>
        <div className='bg-[#4A74E0] rounded-xl p-2 w-10 h-10 flex flex-row justify-between items-center'> 
          <BsPersonBoundingBox className="w-6 h-6 fill-white"/> 
        </div>
      </div>
    </div>
  )
}

export default Cards