"use client"

import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../authProvider"

import Password from "../password"
import Email from "../email"
import Link from "next/link"
import CreateStatus from "../createStatus"
import { Row, Button, Spinner } from "react-bootstrap"
import styles from "./signin.module.css"

function WelcomeBack() {
  return <h2 id={styles["welcome-back"]}> Welcome Back! </h2>;
}

function Login({ isLoading } : { isLoading: boolean }) {
  return (
    <>
      { isLoading
        ? <Button disabled type="submit" className="mb-3" id={styles["login"]} style={{width: "180px"}}>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            <span style={{marginLeft: "5px"}}>Logging in...</span>
          </Button>

        : <Button type="submit" className="mb-3" id={styles["login"]}>
            Login
          </Button>
      }
    </>
  )
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
  
  const [password, setPassword] = useState<string>("")
  const [msg, setMsg] = useState<string>("")
  const [success, setSuccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Check if user is signed in
  useEffect(() => {
    async function checkSignIn() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/validate-token`, {
        method: "POST",
        credentials: "include"
      })
      
      if (res.status == 200) {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    }
    checkSignIn()
  }, [])

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const dismissAlert = () => {
    setMsg("");
    setSuccess(false)
  }

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
  
    try {
      const res = await fetch(`${window.origin}/api/sign-in`, {
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
  
      if (res.status == 200) {
        setMsg("Sign in successful! Please wait...")
        setSuccess(true)
        await res.json().then(async data => {
          await auth.signIn(data.fullName)
        })
        router.push("/dashboard")
        return
      } else {
        setMsg("Cannot login. Please try again.")
      }
    } catch (error) {
      console.error("An error occurred:", error)
      setMsg("Cannot login. Please try again later.")
    }
  
    setSuccess(false)
    setIsLoading(false)
    router.push("/sign-in")
  };

  return (
    <Row className={styles["sign-in-page"]}>
      <div className={styles["left-half"] + " col-1 col-md-6"}/>
      <div className={styles["right-half"] + " col-10 col-md-5"}>
        <form onSubmit = {submitForm}>
          <WelcomeBack />
          <Email />
          <Password value={password} onChange={handlePasswordChange} />
          <Login isLoading={isLoading} />
          <CreateStatus msg={msg} 
            success={success} 
            dismissAlert={dismissAlert}/>
          <NoAccount />
          <ForgetPassword />
        </form>
      </div>
      <div className="col-1"/>
    </Row>
  );
}

export default SignInPage
