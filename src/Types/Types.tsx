import { Dispatch, SetStateAction } from "react"

export type MyOtpLayoutProps={
open:boolean
GenerateOtp:()=>void
closeModal:Dispatch<SetStateAction<boolean>>
currentOtp:number|null
}