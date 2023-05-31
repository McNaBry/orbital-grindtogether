"use client";

import { useState, ChangeEvent, FormEvent, MouseEventHandler } from "react";
import styles from "../auth.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation"

import Password from "../password";
import Email from "../email";
import EyeForPassword from "../eyeForPassword";

import * as pc from "./passwordChecks.js";

function GetStarted() {
  return <h2 className={styles["get-started"]}> Get Started </h2>;
}

function Name() {
  return (
    <>
      <label htmlFor="full-name" className={styles["form-label"]}>
        Full Name
      </label>
      <input
        type="text"
        name="fullName"
        className="form-control"
        id="full-name"
        placeholder="Enter your full name"
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
      name="confirmPw"
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
      <label htmlFor="confirm-password" className={styles["form-label"]}>
        Confirm Password
      </label>
      <div className={styles["password-input"]}>
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

type CreateStatusProps = {
  msg: string,
  success: boolean,
  dismissAlert: MouseEventHandler<HTMLButtonElement>
}
function CreateStatus({ msg, success, dismissAlert }: CreateStatusProps) {
  return (
    <>
    {!success && msg && (
      <div
        className={"alert alert-dismissible fade show " + styles["alert-danger"]}
        role="alert"
      >
        <img
          src={"images/danger.svg"}
          className="bi flex-shrink-0 me-2"
          id={styles["danger-icon"]}
        />
        {msg}
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={dismissAlert}
        ></button>
      </div>
    )}
    {success && msg && (
      <div
        className={"alert alert-dismissible fade show " + styles["alert-success"]}
        role="alert"
      >
        <img
          src="images/success.svg"
          className="bi flex-shrink-0 me-2"
          id={styles["success-icon"]}
        />
        {msg}
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
  )
}

type ValidatePasswordParams = {
  pw: FormDataEntryValue | null,
  confirmPw: FormDataEntryValue | null,
  setMsg: (msg: string) => void,
  setSuccess: (success: boolean) => void
}
function ValidatePassword(details: ValidatePasswordParams) {
  const {pw, confirmPw, setMsg, setSuccess} = details
  if(!pw || !confirmPw) return false

  if (!pc.checkPassword(pw, confirmPw)) {
    setMsg("Passwords entered do not match")
  } else if (!pc.atLeast8Char(pw)) {
    setMsg("Password should be at least 8 characters long")
  } else if (!pc.atLeastOneCap(pw)) {
    setMsg("Password should at least have one capital letter")
  } else if (!pc.atLeastOneLower(pw)) {
    setMsg("Password should at least have one lowercase letter")
  } else if (!pc.atLeastOneNumber(pw)) {
    setMsg("Password should at least have one number")
  } else if (!pc.atLeastOneSpecial(pw)) {
    setMsg("Password should at least have one special character")
  } else {
    return true
  }
  setSuccess(false)
  return false
}

function CreateAccount() {
  return (
    <button
      type="submit"
      className="btn mb-3"
      id={styles["create-account"]}
    > Create Account </button>
  );
}

function AlreadyHaveAccount() {
  return (
    <div className={styles["check-have-account"]}>
      <p> Already have an account? </p>
      <Link href="sign-in" id={styles["login-link"]}> Login </Link>
    </div>
  );
}

function SignUpPage() {
  const router = useRouter()

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [msg, setMsg] = useState<string>("")
  const [success, setSuccess] = useState<boolean>(false)

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
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (!ValidatePassword({
      pw: formData.get('password'), 
      confirmPw: formData.get('confirmPw'), 
      setMsg: setMsg, 
      setSuccess: setSuccess})
    ) return
    let res: Response;
    try {
      res = await fetch('http://localhost:5000/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.get('fullName'),
          email: formData.get('email'),
          password: formData.get('password')
        })
      })
    } catch (error) {
      setMsg("Account not created. Issue with server connection")
      setSuccess(false)
      return
    }

    if (res.ok) {
      setMsg("Account has been successfully created!")
      setSuccess(true)
      router.push("/study-listings")
    } else {
      setMsg("Account not created. Issue with server")
      setSuccess(false)
      router.push("/sign-up")
    }
  }

  return (
    <div className={"row " + styles["sign-up-page"]}>
      <div className="col-1 col-md-6" />
      <div className={"col-10 col-md-5 " + styles["right-half"]}>
        <GetStarted />
        <form onSubmit={submitForm}>
        <div className={styles["form-fields"]}>
          <Name />
          <Email />
          <Password value={password} onChange={handlePasswordChange} />
          <ConfirmPassword
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        <CreateAccount />
        <CreateStatus 
          msg={msg} 
          success={success} 
          dismissAlert={dismissAlert} />
        </form>
        <AlreadyHaveAccount />
      </div>
      <div className="col-1 col-md-1"></div>
    </div>
  );
}

export default SignUpPage;
