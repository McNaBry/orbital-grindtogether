"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import CreateStatus from "../createStatus";
import Password from "../password";
import { Button, Card, Modal } from "react-bootstrap";
import "../reusable.css"
import Link from "next/link";
import { useRouter } from 'next/navigation';

function DeleteAccount() {
  return (
    <Button type="submit" className="btn" id="delete-account">
      Delete Account
    </Button>
  );
}

function AbortDelete() {
  return (
    <p>
      {" "}
      Having second thoughts? Return to{" "}
      <Link href="profile-page" className="abort-delete-link">
        {" "}
        profile page{" "}
      </Link>{" "}
    </p>
  );
}

type ModalProps = {
  show: boolean,
  onHide: () => void
}

function SuccessDialog({ show, onHide } : ModalProps) {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
    onHide();
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Account successfully deleted
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4> Don&apos;t worry, all your data have also been deleted. </h4>
        <p>
          We are sorry to see you go... See you soon!
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose}> Close </Button>
      </Modal.Footer>
    </Modal>
  );
}

type DeleteAccountProps = {
  params: { id: string },
  searchParams: any
}

function DeleteAccountPage({params, searchParams} : DeleteAccountProps) {
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  const [displayModal, setDisplayModal] = useState(false)
  const urlParams = new URLSearchParams(searchParams)
  const email = urlParams.get("email")

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const dismissAlert = () => {
    setSuccess(false);
    setMsg("");
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email || "",
          password: formData.get('password'),
        }),
        credentials: "include"
      });
      
      switch (res.status) {
        case 200:
          setDisplayModal(true);
          setSuccess(true);
          setMsg("Goodbye! Hope to see you back again one day...");
          break;
        case 400:
          setSuccess(false);
          setMsg("Somehow you are not logged in...");
          break;
        case 401:
          setSuccess(false);
          setMsg("Incorrect password.");
        case 500:
          setSuccess(false);
          setMsg("Deleting your account was unsuccessful.");
          break;
      }
    } catch (error) {
      setSuccess(false);
      setMsg("how did you end up here?");
    }
  };

  return (
    <div className="delete-account-page">
      <form onSubmit={submitForm}>
        <Card style={{ width: "22rem" }}>
          <Card.Img variant="top" src="images/delete.png" />
          <Card.Body>
            <Card.Title> Delete your account </Card.Title>
            <Card.Text>This action is irreversible. If you wish to proceed, please key in your email and password. </Card.Text>
            <Password value={password} onChange={handlePasswordChange} />
            <DeleteAccount />
            <CreateStatus
              msg={msg}
              success={success}
              dismissAlert={dismissAlert}
            />
            <AbortDelete />
            <SuccessDialog
              show={displayModal}
              onHide={() => setDisplayModal(false)}
            />
          </Card.Body>
        </Card>
      </form>
    </div>
  );
}

export default DeleteAccountPage;