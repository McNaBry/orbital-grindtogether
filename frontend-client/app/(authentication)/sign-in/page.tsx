"use client";

import { useState, ChangeEvent } from "react";
import Password from "../password";
import Email from "../email";
import "./signin.css";
import Link from "next/link";

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

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className="signinpage row">
      <div className="left-half col-1 col-md-6"/>
      <div className="right-half col-10 col-md-5">
        <form action="http://localhost:5000/auth" method="post">
          <WelcomeBack />
          <Email onChange = {handleEmailChange}/>
          <Password value={password} onChange={handlePasswordChange} />
          <Login />
          <NoAccount />
        </form>
      </div>
      <div className="col-1"/>
    </div>
  );
}

export default SignInPage;
