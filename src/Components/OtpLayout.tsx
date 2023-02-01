import React, { useEffect, useRef, useState } from "react";
import { MyOtpLayoutProps } from "../Types/Types";
const initialInput={
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
    digit5: "",
    statusClass: "",
  }

export const OtpLayout = ({
  open,
  GenerateOtp,
  currentOtp,
  closeModal,
}: MyOtpLayoutProps) => {
  const [state, setState] = useState({ counter: 5 ,msg:''});
  const [inputs, setInputs] = useState(initialInput);
  const digit1 = useRef<HTMLInputElement>(null);
  const digit2 = useRef<HTMLInputElement>(null);
  const digit3 = useRef<HTMLInputElement>(null);
  const digit4 = useRef<HTMLInputElement>(null);
  const digit5 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      digit1.current?.focus();
    }, 800);
  }, []);

  useEffect(()=>{
setInterval(()=>{

},1000)
  },[GenerateOtp])

  const ResendOtp = () => {
    if (state.counter > 0) GenerateOtp();
    if(state.counter!==0)
    state.counter = state.counter - 1;
    setState({...state})
    setInputs(initialInput)
    
  };

  const InputDigits = (e: any) => {
    if (!e.target.value) return;
    let val = e.target.value;
    if (val.length > 1) val = val.split("")[val.length - 1];
    const successClass = "alert-input-success";
    const errorClass = "alert-input-danger";
    
    switch (e.target.name) {
      case "digit1":
        {
          inputs.digit1 = val;
          digit2.current?.focus();
        }
        break;
      case "digit2":
        {
          inputs.digit2 = val;
          digit3.current?.focus();
        }
        break;
      case "digit3":
        {
          inputs.digit3 = val;
          digit4.current?.focus();
        }
        break;
      case "digit4":
        {
          inputs.digit4 = val;
          digit5.current?.focus();
        }
        break;
      case "digit5": {
        inputs.digit5 = val;
        let status= (inputs.digit1 +inputs.digit2 +inputs.digit3 +inputs.digit4 +val === currentOtp?.toString())
        inputs.statusClass = (status)? successClass: errorClass;
        (status)?
        state.msg='Enter one time passcode is Correct!'
        :state.msg='Enter one time passcode is Incorrect!'
      }
    }
    setInputs({ ...inputs });
    setState({...state})
  };

  const handleBackspace = (e: any) => {
    if (e.key !== "Backspace" || !e.target.value) return;
    switch (e.target.name) {
      case "digit1":
        {
          inputs.digit1 = "";
          digit1.current?.focus();
        }
        break;
      case "digit2":
        {
          inputs.digit2 = "";
          digit1.current?.focus();
        }
        break;
      case "digit3":
        {
          inputs.digit3 = "";
          digit2.current?.focus();
        }
        break;
      case "digit4":
        {
          inputs.digit4 = "";
          digit3.current?.focus();
        }
        break;
      case "digit5": {
        inputs.digit5 = "";
        digit4.current?.focus();
      }
    }setInputs({ ...inputs });
  };



  return (
    <>
      <div className={`container modal ${open ? "" : "modal-hidden"}`}>
        <div className="modal-card">
          <div className="heading">
            <p>
              Verify Email Address{" "}
              <span style={{ margin: "0px 10px" }}>({currentOtp})</span>
            </p>
            <button className="btn" onClick={() => closeModal(false)}>
              X
            </button>
          </div>
          <div className="body">
            <p>Enter Your Code Here:</p>
            <div className="boxes">
              <input
                ref={digit1}
                className={`${inputs.statusClass}`}
                name="digit1"
                onKeyDown={(e) => handleBackspace(e)}
                onChange={(e) => InputDigits(e)}
                value={inputs.digit1}
                type="number"
              />
              <input
                ref={digit2}
                className={`${inputs.statusClass}`}
                name="digit2"
                onKeyDown={(e) => handleBackspace(e)}
                onChange={(e) => InputDigits(e)}
                value={inputs.digit2}
                type="number"
              />
              <input
                ref={digit3}
                className={`${inputs.statusClass}`}
                name="digit3"
                onKeyDown={(e) => handleBackspace(e)}
                onChange={(e) => InputDigits(e)}
                value={inputs.digit3}
                type="number"
              />
              <input
                ref={digit4}
                className={`${inputs.statusClass}`}
                name="digit4"
                onKeyDown={(e) => handleBackspace(e)}
                onChange={(e) => {
                  InputDigits(e);
                }}
                value={inputs.digit4}
                type="number"
              />
              <input
                ref={digit5}
                className={`${inputs.statusClass}`}
                name="digit5"
                onKeyDown={(e) => handleBackspace(e)}
                onChange={(e) => InputDigits(e)}
                value={inputs.digit5}
                type="number"
              />
            </div>
            <p className={`msg-${inputs.statusClass}`} >{state.msg}</p>
            <div className="card-details">
               
              <p className="info" onClick={ResendOtp}>
                Resend One-Time Passcode.{" "}
                <span className="attempts">({state.counter} attempts left)</span>
              </p>
              <p className="timer">00:23</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
