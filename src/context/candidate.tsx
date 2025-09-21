import { createContext ,useContext, useState} from "react";
import { LooseValue } from "react-calendar/dist/cjs/shared/types";

type candidateType={name:string,lastname:string,email:string,phone:string,address:string,institute:string,position:string,date:string,country:string,state:string,city:string,skills:string[],endDate:string} 
type ErrorsType = {name:string,lastname:string,email:string,phone:string,address:string,institute:string,position:string,date:string,country:string,state:string,city:string,skills:string,endDate:string,resume:string,interviewDate:string,slots:string}
type candidateContextProps=candidateType&{setCandidateByField:(fieldName:fieldName,value:string)=>void}&{setSkills:(skills:string[])=>void}&{resume:File|null,setResume:(file:File|null)=>void}&{interviewDate:LooseValue,setInterviewDate:(date:LooseValue)=>void}&{slots:string[],setSlots:(slots:string[])=>void}&{errors:ErrorsType,setErrors:React.Dispatch<React.SetStateAction<ErrorsType>>}
export type fieldName= "name" | "lastname" | "email" | "phone" | "address" | "institute" | "position" | "date" | "country" | "state" | "city" | "endDate"

export const CandidateContext = createContext<candidateContextProps>({
    name:"",
    lastname:"",
    email:"",
    phone:"",
    address:"",
    institute:"",
    position:"",
    date:"",
    country:"",
    state:"",
    city:"",
    skills:[],
    endDate:"",
    setCandidateByField:()=>{},
    setSkills:()=>{},
    resume:null,
    setResume:()=>{},
    interviewDate:"",
    setInterviewDate:()=>{},
    slots:[],
    setSlots:()=>{},
    errors:{name:"",lastname:"",email:"",phone:"",address:"",institute:"",position:"",date:"",country:"",state:"",city:"",skills:"",endDate:"",resume:"",interviewDate:"",slots:""},
    setErrors:()=>{}
});

    export const CandidateProvider = ({children}:{children:React.ReactNode}) => {
        const [candidate, setCandidate] = useState<candidateType>({
            name:"",
            lastname:"",
            email:"",
            phone:"",
            address:"",
            institute:"",
            position:"Candidature spontannée",
            date:"",
            country:"",
            state:"",
            city:"",
            skills:[],
            endDate:""
        });
       const setCandidateByField=(fieldName:fieldName,value:string)=>{
        setCandidate((prev:candidateType)=>{
            return ({
                ...prev,
                [fieldName]:value
        })
        })
       }

        const [resume,setResume]=useState<File|null>(null)
        const [interviewDate,setInterviewDate]=useState<LooseValue>("")
        const [slots,setSlots]=useState<string[]>([])

        const [errors,setErrors]=useState({
            name:"",
            lastname:"",
            email:"",
            phone:"",
            address:"",
            institute:"",
            position:"",
            date:"",
            country:"",
            state:"",
            city:"",
            skills:"",
            endDate:"",
            resume:"",
            interviewDate:"",
            slots:""
        })

        return ( 
            <CandidateContext.Provider value={{...candidate,setCandidateByField,setSkills:(skills:string[])=>setCandidate(prev=>({...prev,skills})),resume,setResume,interviewDate,setInterviewDate,slots,setSlots,errors,setErrors}}>
                {children}
            </CandidateContext.Provider>
        );
    }

    export const useCandidate=()=>{
        const context = useContext(CandidateContext)
        if (!context){
            throw new Error("useCandidate must be inside candidate provider")
        }
        return context
}