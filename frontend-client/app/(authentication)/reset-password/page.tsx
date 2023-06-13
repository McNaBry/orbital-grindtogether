"use client";

import { useState, ChangeEvent, useEffect, FormEvent } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import CreateStatus from "../createStatus"
import Password from "../password"
import ConfirmPassword from "../confirmPassword"
import SuddenlyRemember from "../suddenlyRemember"
import LoadingForm from "./loadingForm"

import { Button, Card, Form } from "react-bootstrap"
import "./resetPassword.css"
import Link from "next/link";

function ResetPassword() {
  return (
    <Button type="submit" className="mb-3" id="reset-password">
      Reset Password
    </Button>
  );
}

async function validateOobCode(oobCode: string | null) {
  try {
    const res = await fetch('http://localhost:5000/validate-oob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        oobCode: oobCode
      }),
    })
    await new Promise(resolve => setTimeout(resolve, 200))
    return res.ok ? true : false
  } catch (error) {
    console.log(error)
    return false
  }
}

function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [isOobValid, setIsOobValid] = useState(false)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const validate = async () => {
      await validateOobCode(searchParams.get('oobCode')).then(payload => {
        setIsOobValid(payload)
        setIsLoading(false)
      }) 
    }
    validate()
  }, [])

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const res = await fetch('http://localhost:5000/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        oobCode: searchParams.get('oobCode'),
        newPassword: formData.get('password')
      })
    });
    
    if (res.ok) {
      setMsg("Reset successful. Redirecting you...")
      setSuccess(true)
      router.push("/sign-in")
    } else {
      setMsg("Reset failed. Please try again...")
      setSuccess(false)
    }
  }

  return (
    <div className="reset-password-page">
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src="images/padlock.png" alt="padlock" />
        <Card.Body>
          <Card.Text>Email: <i>{searchParams.get('email') ?? "No email provided"}</i></Card.Text>
          { isLoading
            ? <LoadingForm /> 
            : isOobValid
              ? <>
                  <Card.Title>Reset Password</Card.Title>
                  <Form onSubmit={handleSubmit}>
                    <Password value={password} onChange={handlePasswordChange} />
                    <ConfirmPassword
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                    <ResetPassword />
                  </Form>
                </>
              : <>
                  <Card.Text> Invalid Code: <i>{searchParams.get('oobCode') ?? "Missing Code"}.</i> </Card.Text>
                  <Card.Text> Please request a new one <Link href="/input-email-for-reset">here</Link> </Card.Text>
                </>
          }
          <CreateStatus msg={msg} success={success} dismissAlert={dismissAlert} />
          <SuddenlyRemember />
        </Card.Body>
      </Card>
    </div>
  );
}

export default ResetPasswordPage;