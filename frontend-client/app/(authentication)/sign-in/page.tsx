"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import Password from "../password"
import Email from "../email"
import styles from "./signin.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import CreateStatus from "../createStatus"
import { useAuth } from '../../authProvider'
// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

function WelcomeBack() {
  return <h2 id={styles["welcome-back"]}> Welcome Back! </h2>;
}

function Login() {
  return (
    <button type="submit" className="btn mb-3" id={styles["login"]}>
      Login
    </button>
  );
}

function NoAccount() {
  return (
    <p style={{color: "white"}}>
      {" "}
      Don&#39;t have an account?{" "}
      <Link 
        className={styles["sign-up-link"]}
        href="sign-up">
        Sign up
      </Link>
    </p>
  );
}

function ForgetPassword() {
  return (
    <p style={{color: "white"}}>
      Forgot your password? 
      <Link 
        className={styles["reset-password-link"]} 
        href = "input-email-for-reset"> Reset </Link>
    </p>
  )
}

function SignInPage() {
  const router = useRouter()
  const auth = useAuth()
  
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [success, setSuccess] = useState(false)

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const dismissAlert = () => {
    setMsg("");
    setSuccess(false)
  }

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
  
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
        credentials: "include"
      }).then(response => {
        console.log(response.headers)
        return response
      })
  
      // if (res.status == 200) {
      //   setMsg("Sign in successful! Please wait...")
      //   setSuccess(true)
      //   // Store sign in token ID for future reference
      //   await res.json().then(async data => {
      //     await auth.signIn(data.tokenID)
      //   })
      //   router.push("/dashboard")
      //   return
      // } else {
      //   setMsg("Cannot login. Please try again.")
      // }


      // else if (res.status === 404) {
      //   setMsg("Email cannot be found in the database. Please create an account.");
      // } else if (res.status === 401) {
      //   setMsg("Password is incorrect.");
      // } 
    } catch (error) {
      console.error("An error occurred:", error);
      setMsg("Cannot login. Please try again later.")
    }
  
    setSuccess(false)
    router.push("/sign-in")
  };

  return (
    <div className={"row " + styles["sign-in-page"]}>
      <div className={styles["left-half"] + " col-1 col-md-6"}/>
      <div className={styles["right-half"] + " col-10 col-md-5"}>
        <form onSubmit = {submitForm}>
          <WelcomeBack />
          <Email />
          <Password value={password} onChange={handlePasswordChange} />
          <Login />
          <CreateStatus msg={msg} 
          success={success} 
          dismissAlert={dismissAlert}/>
          <NoAccount />
          <ForgetPassword />
        </form>
      </div>
      <div className="col-1"/>
    </div>
  );
}

export default SignInPage
