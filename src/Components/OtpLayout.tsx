import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { MyOtpLayoutProps, typeInitialInput } from "../Types/Types";
type inp = {
  digit: string[];
  statusClass: string;
};
const initialInput: inp = {
  digit: [],
  statusClass: "",
};
export const OtpLayout = ({
  GenerateOtp,
  currentOtp,
  closeModal,
}: MyOtpLayoutProps) => {
  const successClass = "alert-input-success";
  const errorClass = "alert-input-danger";
  const [state, setState] = useState({
    counter: 4,
    msg: "",
    loader: false,
    modal: true,
  });
  const [timer, setTimer] = useState<number>(60);
  const [inputs, setInputs] = useState<inp>({ ...initialInput });

  const digit = useRef<HTMLInputElement[]>([]);

  // responsible for resend otp
  const ResendOtp = () => {
    if (timer === 0 && state.counter > 0) {
      if (state.counter >= 0) GenerateOtp();
      if (state.counter !== -1) state.counter = state.counter - 1;
      if (state.counter === -1) {
        setTimer(0);
      } else setTimer(60);
      setTimeout(() => {
        setState({ ...state, msg: "" });
      }, 1200);
      setState({ ...state, msg: "One-time passcode sent successfully!" });
      setInputs({ ...initialInput });
    }
  };

  // fill the digit array to empty with the length of otp
  const filler = () => {
    inputs.digit = [];
    currentOtp
      ?.toString()
      .split("")
      .map((x) => {
        inputs.digit.push("");
      });
    setInputs({ ...inputs });
  };

  //  Default focus on first input when component mount
  useEffect(() => {
    filler();
    setTimeout(() => {
      digit.current[0]?.focus();
    }, 100);
  }, []);

  //   responsible for timer when generateOtp function calls
  useEffect(() => {
    let interval: any = null;
    interval = setInterval(() => {
      setTimer((prev) => (prev == 0 ? 0 : prev - 1));
    }, 1000);
    filler();
    // callback function for clear interval when component unmount
    return () => {
      clearInterval(interval);
    };
  }, [GenerateOtp]);

  // responsible to handle all input digits and focus
  const InputDigits = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    if (
      /^[0-9]{1}$/.test(e.currentTarget.value) ||
      e.currentTarget.value === ""
    ) {
      if (e.currentTarget.value) {
        digit.current[i + 1]?.focus();
        if (i < inputs.digit.length - 1) inputs.digit[i + 1] = "";
      }
      inputs.digit[i] = e.currentTarget.value;
      state.msg = "";
      inputs.statusClass = "";
      if (inputs.digit.reduce((final, current) => final && current)) {
        // status hold the value of otp matched or not
        let status =
          inputs.digit.toString().replaceAll(",", "") ===
          currentOtp?.toString();
        inputs.statusClass = status ? successClass : errorClass;
        // if otp matched
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
          state.msg = "Enter one time passcode is Incorrect!";
        }
      }
      setInputs({ ...inputs });
      setState({ ...state });
    }
  };

  //  to handle input backSpace and focus
  const handleBackspace = (e: any, i: number) => {
    console.log(e.target.value);
    if (e.key === "Backspace" && !inputs.digit[i])
      digit.current[i - 1]?.focus();
    else if (e.key === "ArrowLeft") digit.current[i - 1]?.focus();
    else if (e.key === "ArrowRight") digit.current[i + 1]?.focus();
    // else if(e.target.value.length==1 && e.key === "Backspace" )
    //   digit.current[i-1]?.focus()
  };

  return (
    <>
      <div className={`container modal ${state.modal ? "" : "modal-hidden"}`}>
        <div className="modal-card">
          <div className="heading">
            <p>
              Verify Email Address
              <span>({currentOtp})</span>
            </p>
            <button className="btn btn-cross" onClick={() => closeModal(false)}>
              X
            </button>
          </div>
          <div className="body">
            <p>Enter Your Code Here:</p>
            <div className="boxes">
              {currentOtp
                ?.toString()
                .split("")
                .map((d, i) => (
                  <input
                    key={d.toString() + i}
                    ref={(el: HTMLInputElement) => {
                      digit.current[i] = el;
                    }}
                    className={`${inputs.statusClass}`}
                    name="digit1"
                    onChange={(e) => {
                      InputDigits(e, i);
                    }}
                    onKeyDown={(e) => handleBackspace(e, i)}
                    value={inputs.digit[i]}
                    type="text"
                    minLength={1}
                    maxLength={1}
                  />
                ))}
              <div className="spinner-box">
                {state.loader && (
                  <img
                    className="loader"
                    src="Spinner-1s-200px.gif"
                    alt="loader"
                  />
                )}
              </div>
            </div>
            <p className={`msg-${inputs.statusClass} notification`}>
              {state.msg}
            </p>

            <div className="card-details">
              <p className={`info `} onClick={ResendOtp}>
                <span
                  className={`resend ${
                    (timer > 0 || state.counter === 0) && "disabled"
                  }`}
                >
                  Resend One-Time Passcode.
                </span>
                <span className={`attempts ${state.counter == 0 && "warning"}`}>
                  ({state.counter} attempts left)
                </span>
              </p>
              {/* here time formate done while renderning jsx ex: 0:2 => 00:02 */}
              <p className="timer">{`
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
