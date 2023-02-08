import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { inputsType, MyOtpLayoutProps } from "../Types/Types";

const successClass = "alert-input-success";
const errorClass = "alert-input-danger";
const initialInput: inputsType = {
  digit: [],
  statusClass: "",
};

export const OtpLayout = ({
  GenerateOtp,
  currentOtp,
  closeModal,
}: MyOtpLayoutProps) => {
  const emptyLengthArray=(currentOtp)?currentOtp.toString().split("").map((x) =>""):[]
  const [state, setState] = useState({ counter: 4, msg: "", loader: false });
  const [timer, setTimer] = useState<number>(6);
  const [inputs, setInputs] = useState<inputsType>({ ...initialInput ,digit:emptyLengthArray });

  // ref array for all inputs
  const digit = useRef<HTMLInputElement[]>([]);

  // ()=> responsible for resend otp
  const  resendOtp = () => {
    if (timer === 0 && state.counter > 0) {
      if (state.counter >= 0) {
        GenerateOtp();
        state.counter = state.counter - 1;
      }
      if (state.counter === -1) {
        setTimer(0);
      } else setTimer(6);

      setState({ ...state, msg: "One-time passcode sent successfully!" });
      // reset all inputs array and statusClass
      setInputs({ ...initialInput });

      // auto hide message after resend success notification
      setTimeout(() => {
        setState({ ...state, msg: "" });
      }, 1200);
      
      
    }
  };

  // ()=> responsible  fill the digit array with empty string
  const filler = () => {
    setTimeout(() => {
      digit.current[0]?.focus();
    }, 200);
  };

  //  Default focus on first input when component mount
  useEffect(() => {
    filler();
  }, []);

  //   responsible for timer when generateOtp function calls
  useEffect(() => {
    let interval: any = null;
    interval = setInterval(() => {
      setTimer((prev) => (prev === 0 ? 0 : prev - 1));
    }, 1000);
    filler();
    setInputs({...inputs,digit:emptyLengthArray})
    // callback function for clear interval when component unmount
    return () => {
      clearInterval(interval);
    };
  }, [GenerateOtp]);

  // ()=> responsible to handle all input digits and focus
  const inputDigits = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    let val = e.currentTarget.value;
    // cutting the string to single digit
    if (val.length > 1) {
      val = val[val.length - 1];
      if (val === inputs.digit[i]) val = e.currentTarget.value[0];
    }
    // now here the test condtion
    if (/^[0-9]{1}$/.test(val) || val === "") {
      if (val) digit.current[i + 1]?.focus();

      inputs.digit[i] = val;
      state.msg = "";
      inputs.statusClass = "";

      // check all value filled
      if (inputs.digit.reduce((final, current) => final && current)) {
        // status hold the value of otp matched or not
        let status =
          inputs.digit.toString().replaceAll(",", "") ===
          currentOtp?.toString();
        inputs.statusClass = status ? successClass : errorClass;

        // if otp matched successfully
        if (status) {
          state.msg = "Enter one time passcode is Correct!";
          state.loader = true;
          digit.current.forEach((x, index) => {
            digit.current[index]?.blur();
          });
          //  after 1000 ms modal will closed automatically
          setTimeout(() => {
            closeModal(false);
          }, 1000);
        } else {
          state.msg = "Entered One-time passcode is incorrect!";
        }
      }
      setInputs({ ...inputs });
      setState({ ...state });
    }
  };

  // ()=> responsible to handle input backSpace & del and focus
  const handleBackspace = (e: any, i: number) => {
    let key = e.key === "Backspace" || e.key === "Delete";
    if (key && !inputs.digit[i]) digit.current[i - 1]?.focus();
    else if (e.key === "ArrowLeft") digit.current[i - 1]?.focus();
    else if (e.key === "ArrowRight") digit.current[i + 1]?.focus();
  };

  console.log(inputs)
  return (
    <>
      <div className="container container--modal">
        <div className="card">
          <div className="card__heading">
            <p>
              Verify Email Address
              <span>({currentOtp})</span>
            </p>
            <button
              className="btn btn--cross pointer"
              onClick={() => closeModal(false)}
            >
              X
            </button>
          </div>
          <div className="card__body">
            <p className="body__p">Enter Your Code Here:</p>
            <div className="card__boxes">
              {/* to generate input element dynamically */}
              {currentOtp
                ?.toString()
                .split("")
                .map((d, i) => (
                  <input
                    key={d + i}
                    ref={(el: HTMLInputElement) => {
                      digit.current[i] = el;
                    }}
                    className={`${inputs.statusClass}`}
                    name="digit1"
                    onChange={(e) => {
                      inputDigits(e, i);
                    }}
                    onKeyDown={(e) => handleBackspace(e, i)}
                    value={inputs.digit[i]}
                    onKeyUp={(e)=>{
                      // just for handle backspace when cursor placed before digit 
                      if (e.key === "Backspace" && inputs.digit[i] === digit.current[i].value && inputs.digit[i]!=='') {
                        digit.current[i - 1]?.focus()
                        inputs.digit[i - 1] = "";
                        setInputs({ ...inputs });
                      } 
                    }}
                    type="text"
                  />
                ))}

              <div className="card__spinner">
                {state.loader && (
                  <img
                    className="spinner__icon"
                    src="Spinner-1s-200px.gif"
                    alt="loader"
                  />
                )}
              </div>
            </div>
            <p className={`msg-${inputs.statusClass} notification`}>
              {state.msg}
            </p>

            <div className="card__details">
              <p className={`info `}>
                <span
                  onClick={ resendOtp}
                  className={`resend ${
                    (timer > 0 || state.counter === 0) && "disabled"
                  }`}
                >
                  Resend One-Time Passcode.
                </span>
                <span
                  className={`attempts  ${
                    state.counter === 0 && "msg-alert-input-danger"
                  }`}
                >
                  ({state.counter} attempts left)
                </span>
              </p>
              {/* here time formate done while renderning jsx ex: 0:2 => 00:02 */}
              <p className="details__timer">{`
                ${parseInt((timer / 60).toString()) < 10 ? "0" : ""}${parseInt(
                (timer / 60).toString()
              )} :
                ${parseInt((timer % 60).toString()) < 10 ? "0" : ""}${
                timer % 60
              }`}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpLayout;