import { Dispatch, SetStateAction } from "react"

export type MyOtpLayoutProps={
open:boolean
GenerateOtp:()=>void
closeModal:Dispatch<SetStateAction<boolean>>
currentOtp:number|null
}

export type ModalStateTypes = {
    digit: string[];
    statusClass: string;
    counter: number,
    msg: string,
    loader: boolean,
  };