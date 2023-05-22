"use client";

import { useState, ChangeEvent } from "react";
import Password from "../sign-up/password";
import Email from "../sign-up/email";
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
      <Link className="click-signup" href="sign-up">
        Sign up
      </Link>
    </p>
  );
}

function SignInPage() {
  const [password, setPassword] = useState("");

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className="signinpage row">
      <div className="left-half col-6"/>
      <div className="right-half col-6">
        <WelcomeBack />
        <Email />
        <Password value={password} onChange={handlePasswordChange} />
        <Login />
        <NoAccount />
      </div>
    </div>
  );
}

export default SignInPage;
