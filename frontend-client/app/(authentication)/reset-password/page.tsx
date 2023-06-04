"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import CreateStatus from "../createStatus";
import Password from "../password";
import ConfirmPassword from "../confirmPassword";
import "./resetpassword.css";

function ResetPassword() {
  return (
    <button type="submit" className="btn" id="reset-password">
      Reset Password
    </button>
  );
}

function SuddenlyRemember() {
  return (
    <p className = "suddenly-remember">
      {" "}
      Suddenly remember your password?{" "}
      <Link className="suddenly-remember-link" href="sign-in">
        {" "}
        Login{" "}
      </Link>
    </p>
  );
}

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const dismissAlert = () => {
    setMsg("");
    setSuccess(false);
  }

  return (
    <div className="resetpasswordpage">
      <div className="card" style={{ width: "18rem" }}>
        <img src="images/padlock.png" className="card-img-top" alt="padlock" />
        <div className="card-body">
          <h5 className="card-title">Reset Password</h5>
          <form>
        <Password value={password} onChange={handlePasswordChange} />
        <ConfirmPassword
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        <ResetPassword />
        <CreateStatus msg={msg} success={success} dismissAlert={dismissAlert} />
        <SuddenlyRemember />
      </form>
        </div>
      </div>
      
    </div>
  );
}

export default ResetPasswordPage;
