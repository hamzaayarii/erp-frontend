import { BsPersonBoundingBox } from 'react-icons/bs'

const Card = () => {
  return (
    <div className='w-72 h-20 rounded-[15px] bg-white flex flex-row justify-between items-center px-5'>
       <div> 
            <h1 className='font-bold text-[#A0AEC0]'>Candidates</h1>
            <p className='font-extrabold text-[#2D3748]'>5</p>
        </div>
        <div className='bg-[#4A74E0] rounded-xl p-2 w-10 h-10 flex flex-row justify-between items-center'> <BsPersonBoundingBox className="w-6 h-6 fill-white"/> </div>
    </div>
  )
}

export default Card