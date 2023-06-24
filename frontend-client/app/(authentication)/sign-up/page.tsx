"use client";

import { useState, ChangeEvent, FormEvent, MouseEventHandler } from "react";
import styles from "../auth.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation"

import Password from "../password";
import ConfirmPassword from "../confirmPassword"
import Email from "../email";
import CreateStatus from "../createStatus";
import ValidatePassword from "../validatePassword"
import { useAuth } from "../../authProvider"

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
  const auth = useAuth()

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
      setMsg("Account not created. Issue with server connection.")
      setSuccess(false)
      return
    }

    if (res.ok) {
      setMsg("Account has been successfully created!")
      setSuccess(true)
      router.push("/dashboard")
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