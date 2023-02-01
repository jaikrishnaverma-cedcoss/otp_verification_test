import React, { useState } from 'react'
import { OtpLayout } from './OtpLayout'

const Register = () => {
    const [modalState,setModalState]=useState<boolean>(false)
    const [currentOtp,setCurrentOtp]=useState<number|null>(null)
    
    // this function is responsible for generate otp 
    const GenerateOtp=()=>{
      let otp:number=Math.random()*(99999-10000)+10000
      otp=parseInt(otp.toString())
      setCurrentOtp(otp)
    }

    // this function is responsible for generate otp and open Modal
    const modalOpener=()=>{
        GenerateOtp()
        setModalState(true)
    }

  return (
   <>
   <button className="btn btn-primary" onClick={modalOpener}>Validate OTP</button>
   {/* model can itself open and closed with respect to open:boolean */}
    {// give conditional rendering just for unmount properly remove all ref and variable memory free
        (modalState)&&<OtpLayout open={modalState}  GenerateOtp={GenerateOtp}  currentOtp={currentOtp} closeModal={setModalState}/>
    }
   
   </>
  )
}

export default Register