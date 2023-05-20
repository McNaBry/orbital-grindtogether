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
      Don't have an account?{" "}
      <Link href="sign-up">
        <a className="click-signup">Sign up</a>{" "}
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
    <div className="signinpage">
      <div className="picture">
        <img src="images/study-aesthetic.png" alt="study-aesthetic" />
      </div>
      <div className="right-half">
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
