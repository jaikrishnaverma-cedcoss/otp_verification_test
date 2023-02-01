import React, { useEffect, useRef, useState } from "react";
import {  MyOtpLayoutProps, typeInitialInput } from "../Types/Types";
const initialInput:typeInitialInput = {
  digit1: "",
  digit2: "",
  digit3: "",
  digit4: "",
  digit5: "",
  statusClass: "",
};

export const OtpLayout = ({open, GenerateOtp, currentOtp, closeModal}: MyOtpLayoutProps) => {
  const successClass = "alert-input-success";
  const errorClass = "alert-input-danger";
  const [state, setState] = useState({counter: 5, msg: "", loader:false ,modal:true});
  const [timer, setTimer] = useState<number>(60);
  const [inputs, setInputs] = useState<typeInitialInput>({...initialInput});
  const digit1 = useRef<HTMLInputElement>(null);
  const digit2 = useRef<HTMLInputElement>(null);
  const digit3 = useRef<HTMLInputElement>(null);
  const digit4 = useRef<HTMLInputElement>(null);
  const digit5 = useRef<HTMLInputElement>(null);


  //  Default focus on first input when component mount
  useEffect(() => {
    setTimeout(() => {
      digit1.current?.focus();
    }, 800);
  }, []);


//   responsible for timer when generateOtp function calls
  useEffect(() => {
    let interval:any  = null;
    interval = setInterval(() => {
      setTimer((prev) => (prev == 0 ? 0 : prev - 1));
      console.log('first')
    }, 1000);
    // callback function for clear interval when component unmount
    return () => {
      clearInterval(interval);
    };
  }, [GenerateOtp]);


  // responsible for resend otp
  const ResendOtp = () => {
    if(timer===0 && state.counter>0){
    if (state.counter > 0) GenerateOtp();
    if (state.counter !== 0) state.counter = state.counter - 1;
    if(state.counter === 0){
        setTimer(0)
    }else
    setTimer(60)
    setState({ ...state,msg:'One-time passcode sent successfully!' });
    setInputs({...initialInput});
  }
};


  // responsible to handle all input digits and focus
  const InputDigits = (e:any) => {
    if (!e.target.value) return;
    let val = e.target.value;
    if (val.length > 1) val = val.split("")[val.length - 1];
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
        // status hold the value of otp matched or not
        let status =
          inputs.digit1 +
            inputs.digit2 +
            inputs.digit3 +
            inputs.digit4 +
            val ===
          currentOtp?.toString();
        inputs.statusClass = status ? successClass : errorClass;
        digit5.current?.blur()
        
        // if otp matched
        if(status){
            (state.msg = "Enter one time passcode is Correct!");
             state.loader=true
            //  after 1000 ms modal will closed automatically
            setTimeout(()=>{
              closeModal(false)
            },1000)
        }else{
            (state.msg = "Enter one time passcode is Incorrect!");
        }
      }
    }
    setInputs({ ...inputs });
    setState({ ...state });
  };


  //  to handle input backSpace and focus
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
    }
    setInputs({ ...inputs });
  };
  if(!state.modal){
    return <button className="btn" onClick={() => setState({...state,modal:true})}>Finish remaining OTP verification</button>
  }
  
return (
    <>
      <div className={`container modal ${state.modal ? "" : "modal-hidden"}`}>

            <div className="modal-card">
            <div className="heading">
              <p >
                Verify Email Address{" "}
                <span style={{ margin: "0px 10px" }}>({currentOtp})</span>
              </p>
              <button className="btn" onClick={() => setState({...state,modal:false})}>
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
              <p className={`msg-${inputs.statusClass} notification`} >{state.msg}</p>
              <div className="spinner-box">
              {    (state.loader)&&<img className="loader" src="Spinner-1s-200px.gif" alt="loader" />}
              </div>
              <div className="card-details">
                <p className={`info ${(timer>0 || state.counter===0)&&'disabled'}`} onClick={ResendOtp}>
                  Resend One-Time Passcode.{" "}
                  <span className="attempts">
                    ({state.counter} attempts left)
                  </span>
                </p>
                {/* here time formate done while renderning jsx ex: 0:2 => 00:02 */}
                <p className="timer">{`
                ${(parseInt((timer / 60).toString())<10)?'0':''}${parseInt((timer / 60).toString())} :
                ${(parseInt((timer % 60).toString())<10)?'0':''}${timer % 60}`}</p>
              </div>
            </div>
          </div>
        
       
      </div>
    </>
  );
};
