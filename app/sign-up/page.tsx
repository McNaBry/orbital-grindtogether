"use client";

import { useState, ChangeEvent } from "react";
import Password from "./password";
import EyeForPassword from "./eyeforpassword";
import "./signup.css";
import * as pc from "./passwordchecks.js";

function GetStarted() {
  return <h2 className="get-started"> Get Started </h2>;
}

function Name() {
  return (
    <>
      <label htmlFor="full-name" className="form-label">
        Full Name
      </label>
      <input
        type="text"
        className="form-control"
        id="full-name"
        placeholder="Enter your full name"
      ></input>
    </>
  );
}

function Email() {
  return (
    <>
      <label htmlFor="email" className="form-label">
        Email
      </label>
      <input
        type="email"
        className="form-control"
        id="email"
        placeholder="Enter your email"
      ></input>
    </>
  );
}

interface ConfirmPasswordInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password";
}

function ConfirmPasswordInput({
  value,
  onChange,
  type,
}: ConfirmPasswordInputProps) {
  return (
    <input
      type={type}
      className="form-control"
      id="confirm-password"
      placeholder="Confirm your password"
      value={value}
      onChange={onChange}
    />
  );
}

function ConfirmPassword({ value, onChange }: ConfirmPasswordInputProps) {
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <>
      <label htmlFor="confirm-password" className="form-label">
        Confirm Password
      </label>
      <div className="password-input">
        <ConfirmPasswordInput
          value={value}
          onChange={onChange}
          type={isConfirmPasswordVisible ? "text" : "password"}
        />
        <EyeForPassword
          isVisible={isConfirmPasswordVisible}
          setVisible={togglePasswordVisibility}
        />
      </div>
    </>
  );
}

function CreateAccount({ password, confirmPassword }) {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [failureStatus, setFailureStatus] = useState(false);

  const handleCreateAccount = () => {
    if (!pc.checkPassword(password, confirmPassword)) {
      setErrorMsg("Passwords entered do not match");
      setSuccessStatus(false);
      setFailureStatus(true);
    } else if (!pc.atLeast8Char(password)) {
      setErrorMsg("Password should be at least 8 characters long");
      setSuccessStatus(false);
      setFailureStatus(true);
    } else if (!pc.atLeastOneCap(password)) {
      setErrorMsg("Password should at least have one capital letter");
      setSuccessStatus(false);
      setFailureStatus(true);
    } else if (!pc.atLeastOneLower(password)) {
      setErrorMsg("Password should at least have one lowercase letter");
      setSuccessStatus(false);
      setFailureStatus(true);
    } else if (!pc.atLeastOneNumber(password)) {
      setErrorMsg("Password should at least have one number");
      setSuccessStatus(false);
      setFailureStatus(true);
    } else if (!pc.atLeastOneSpecial(password)) {
      setErrorMsg("Password should at least have one special character");
      setSuccessStatus(false);
      setFailureStatus(true);
    } else {
      setSuccessMsg("Account has been successfully created!");
      setSuccessStatus(true);
      setFailureStatus(false);
    }
  };

  const dismissAlert = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setSuccessStatus(false);
    setFailureStatus(false);
  };

  return (
    <>
      <button
        type="submit"
        className="btn mb-3"
        id="create-account"
        onClick={handleCreateAccount}
      >
        Create Account
      </button>
      {failureStatus && errorMsg && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <img
            src={"images/danger.svg"}
            className="bi flex-shrink-0 me-2"
            id="danger-icon"
          />
          {errorMsg}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={dismissAlert}
          ></button>
        </div>
      )}
      {successStatus && successMsg && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          <img
            src="images/success.svg"
            className="bi flex-shrink-0 me-2"
            id="success-icon"
          />
          {successMsg}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={dismissAlert}
          ></button>
        </div>
      )}
    </>
  );
}

function AlreadyHaveAccount() {
  return (
    <p className="checkHaveAccount">
      {" "}
      Already have an account?{" "}
      <a className="checkHaveAccount" target="blank">
        {" "}
        Login{" "}
      </a>{" "}
    </p>
  );
}

function SignUpPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  return (
    <div className="signuppage row">
      <img className="col-6" src="images/aesthetic-library.png" alt="Aesthetic" />
      {/* <div className="picture">
        <img src="images/aesthetic-library.png" alt="Aesthetic" />
      </div> */}
      <div className="right-half col-6">
        <GetStarted />
        <div className="form-fields">
          <Name />
          <Email />
          <Password value={password} onChange={handlePasswordChange} />
          <ConfirmPassword
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        <CreateAccount password={password} confirmPassword={confirmPassword} />
        <AlreadyHaveAccount />
      </div>
    </div>
  );
}

export default SignUpPage;
