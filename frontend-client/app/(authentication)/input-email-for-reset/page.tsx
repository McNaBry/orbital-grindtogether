"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Email from "../email";
import "./inputemailforreset.css"
import SuddenlyRemember from "../suddenlyRemember";
import CreateStatus from "../createStatus";

function SendRequestForReset() {
  return (
    <button
      type="submit"
      className="btn mb-3"
      id = "request-for-reset"
    > Request to reset password </button>
  );
}

function InputEmailForReset() {
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const dismissAlert = () => {
    setSuccess(false);
    setMsg("");
  }

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch('http://localhost:5000/input-email-for-reset', {
        method: "POST",
        headers : {
          "Content-Type": "application/json",
        },
        body : JSON.stringify({
          "email": formData.get("email"),
        })
      });

      if (res.ok) {
        setMsg("Request successful! Check your email.")
        setSuccess(true);
      } else if (res.status == 404) {
        setMsg("Email was not found in database.");
        setSuccess(false);
      } else {
        setMsg("How the fuck did you end up here.");
        setSuccess(false);
      }
    } catch (error) {
      setMsg("I dont know what to do with this information.")
    }

    // even if successful user should check their email and click the link provided
    setSuccess(false);
  }

  return (
    <div className="inputemailforresetpage">
      <div className="card" style={{ width: "18rem" }}>
        <img src="images/padlock.png" className="card-img-top" alt="padlock" />
        <div className="card-body">
          <h5 className="card-title">Reset Password</h5>
          <p> Enter your email and we will send you instructions on how to reset your password. </p>
          <form onSubmit = {submitForm}>
            <Email />
            <SendRequestForReset />
            <CreateStatus msg = {msg} success = {success} dismissAlert={dismissAlert}/>
            <SuddenlyRemember />
          </form>
        </div>
      </div>
    </div>
  );
}

export default InputEmailForReset;
