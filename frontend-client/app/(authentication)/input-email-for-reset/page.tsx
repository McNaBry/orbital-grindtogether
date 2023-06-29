'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Email from '../email';
import SuddenlyRemember from '../suddenlyRemember';
import CreateStatus from '../createStatus';

import { Container, Button, Card, Form } from 'react-bootstrap'
import "../reusable.css"

function SendRequestForReset() {
  return (
    <Button
      type="submit"
      className="mb-3"
      id="request-for-reset"
    > Request reset link </Button>
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
      }).then(payload => {
        setMsg("The link will be sent to the email if it is valid.")
        setSuccess(true)
      });

      // if (res.ok) {
      //   setMsg("Request successful! Check your email.")
      //   setSuccess(true);
      // } else if (res.status == 500) {
      //   setMsg("Email was not found in database.");
      //   setSuccess(false);
      // } else {
      //   setMsg("How the fuck did you end up here.");
      //   setSuccess(false);
      // }
    } catch (error) {
      setMsg("Unexpected error. Please reload the page.")
      setSuccess(false)
    }

    // even if successful user should check their email and click the link provided
    //setSuccess(false);
  }

  return (
    <Container className="input-email-for-reset-page">
      <Card style={{ width: "22rem" }}>
        <Card.Img variant="top" src="images/padlock.png" alt="padlock" />
        <Card.Body>
          <Card.Title>Reset Password</Card.Title>
          <Card.Text> Enter your email and we will send you instructions on how to reset your password. </Card.Text>
          <Form onSubmit = {submitForm}>
            <Email />
            <SendRequestForReset />
          </Form>
          <CreateStatus msg = {msg} success = {success} dismissAlert={dismissAlert}/>
          <SuddenlyRemember />
        </Card.Body>
      </Card>
    </Container>
  );
}

export default InputEmailForReset;
