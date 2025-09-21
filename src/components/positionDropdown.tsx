import Select from 'react-select'
import { useCandidate } from '../context/candidate'

const options = [
  { value: 'Candidature spontannée', label: 'Candidature spontannée'},
  { value: 'Front-end developer', label: 'Front-end developer' },
  { value: 'Back-end Developer', label: 'Back-end Developer' }
]

const Dropdown = () => {

  const {setCandidateByField}=useCandidate()

  return (
    <div className='flex flex-col gap-2 w-full'>
        <label >Applied Position <span className='text-red-600'>*</span></label>
        <Select 
        defaultValue={options[0]}
        options={options}  
        onChange={(e)=>e && setCandidateByField("position",e.value)}
        />
    </div>
    )
}

export default Dropdown