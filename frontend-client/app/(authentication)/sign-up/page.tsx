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

import { Button, Spinner } from "react-bootstrap";

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

function CreateAccount({ isLoading } : { isLoading: boolean }) {
  return (
    <>
      { isLoading
        ? <Button disabled type="submit" className="mb-3" id={styles["create-account"]} style={{width: "180px"}}>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            <span style={{marginLeft: "5px"}}>Creating...</span>
          </Button>

        : <Button type="submit" className="mb-3" id={styles["create-account"]}>
            Create Account
          </Button>
      }
    </>
  )
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
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    if (!ValidatePassword({
      pw: formData.get('password'), 
      confirmPw: formData.get('confirmPw'), 
      setMsg: setMsg, 
      setSuccess: setSuccess})
    ) {
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.get('fullName'),
          email: formData.get('email'),
          password: formData.get('password')
        }),
        credentials: "include"
      })

      if (res.status == 200) {
        setMsg("Account has been successfully created!")
        setSuccess(true)
        await new Promise(r => setTimeout(r, 2000))
        router.push("/sign-in")
      } else {
        setMsg("Account not created. Issue with server")
        setSuccess(false)
        router.push("/sign-up")
      }

    } catch (error) {
      console.log(error)
      setMsg("Account not created. Issue with server connection.")
      setSuccess(false)
      setIsLoading(false)
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
        <CreateAccount isLoading={isLoading} />
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