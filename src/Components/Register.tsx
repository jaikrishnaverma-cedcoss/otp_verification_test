import React, { useState } from "react";
import { OtpLayout } from "./OtpLayout";

const Register = () => {
  const [modalState, setModalState] = useState<boolean>(false);
  const [otpLength, setOtpLength] = useState(5);
  const [currentOtp, setCurrentOtp] = useState<number | null>(null);

  // this function is responsible for generate otp
  const GenerateOtp = () => {
    let max = "";
    let min = "1";
    for (let i = 1; i <= otpLength; i++) {
      max += 9;
      if (i !== 1) min += 0;
    }
    let otp: number =
      Math.random() * (parseInt(max) - parseInt(min)) + parseInt(min);
    otp = parseInt(otp.toString());
    setCurrentOtp(otp);
  };

  // this function is responsible for generate otp and open Modal
  const modalOpener = () => {
    GenerateOtp();
    setModalState(true);
  };

  // take otp length from user and little-bit secure from inspectMode by regex
  const takeLength = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let reg = /^[4-8]{1}$/;
    let val = e.target.value.toString();
    if (e.target.value.toString().length > 1)
      val = e.target.value.toString().substring(e.target.value.length - 1);
    if (val.match(reg)) {
      setOtpLength(parseInt(val));
    }
  };

  return (
    <>
      {" "}
      <div className="container">
        <h2>Register Component</h2>
        <label className="">Select Length Of OTP: </label>
        <select
          name="take"
          className="otpLength"
          defaultValue={5}
          onChange={takeLength}
          id=""
        >
          {[4, 5, 6, 7, 8].map((x, i) => (
            <option key={x + i} value={x}>
              {x} digit OTP
            </option>
          ))}
        </select>
        <div>
          <button className="btn btn-primary pointer" onClick={modalOpener}>
            Validate OTP
          </button>
        </div>
        {/* model can itself open and closed with respect to open:boolean */}
        {/* give conditional rendering just for unmount properly remove all ref and variable memory free */}
        {modalState && (
          <OtpLayout
            open={modalState}
            GenerateOtp={GenerateOtp}
            currentOtp={currentOtp}
            closeModal={setModalState}
          />
        )}
      </div>
    </>
  );
};

export default Register;
