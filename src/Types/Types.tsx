import { Dispatch, SetStateAction } from "react"

export type MyOtpLayoutProps={
open:boolean
GenerateOtp:()=>void
closeModal:Dispatch<SetStateAction<boolean>>
currentOtp:number|null
}

export type typeInitialInput= {
    digit1: string;
    digit2: string;
    digit3: string;
    digit4: string;
    digit5: string;
    statusClass: string;
}