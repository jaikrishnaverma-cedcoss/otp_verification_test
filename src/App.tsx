import React from "react";
import "./App.css";
import Register from "./Components/Register";

function App() {
  return (
    <>
      <div className="container">
        <Register />
        <p>Note: once you are start</p>
        <p>1. Your state preserved untill otp validation not successfully done.</p>
        <p>2. Once you <span className="msg-alert-input-success">complete otp verification</span> Then Modal unmounted and all <span className="msg-alert-input-danger">states & ref free after 1000 ms.</span></p>
        <p>3. For ongoing otp validation click "Finish remaining OTP Verification".</p>
        {/* <p>4. </p> */}
      </div>
    </>
  );
}

export default App;
