"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Password from "../password";
import Email from "../email";
import "./signin.css";
import Link from "next/link";
import { useRouter } from "next/navigation"
import CreateStatus from "../createStatus";

function WelcomeBack() {
  return <h2 className="welcome-back"> Welcome Back! </h2>;
}

function Login() {
  return (
    <button type="submit" className="btn mb-3" id="login">
      Login
    </button>
  );
}

function NoAccount() {
  return (
    <p>
      {" "}
      Don&#39;t have an account?{" "}
      <Link className="sign-up-link" href="sign-up">
        Sign up
      </Link>
    </p>
  );
}

function ForgetPassword() {
  return (
    <p>
      Forgot your password? <Link className = "reset-password-link" href = "input-email-for-reset"> Reset </Link>
    </p>
  )
}

function SignInPage() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter()

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const dismissAlert = () => {
    setMsg("");
    setSuccess(false);
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
  
    try {
      const res = await fetch('http://localhost:5000/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      });
  
      if (res.status == 200) {
        setMsg("Account has been successfully created!");
        setSuccess(true);
        router.push("/study-listings");
        return;
      } else if (res.status === 404) {
        setMsg("Email cannot be found in the database. Please create an account.");
      } else if (res.status === 401) {
        setMsg("Password is incorrect.");
      } else {
        setMsg("Cannot login due to unforeseen circumstances. Please try again later.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setMsg("Cannot login. Try again later.");
    }
  
    setSuccess(false);
    router.push("/sign-in");
  };

  return (
    <div className="signinpage row">
      <div className="left-half col-1 col-md-6"/>
      <div className="right-half col-10 col-md-5">
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

export default SignInPage;
