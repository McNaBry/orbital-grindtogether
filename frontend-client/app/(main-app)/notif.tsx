"use client"

import { useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

type NotifProps = {
  msg: string,
  success: boolean,
  setMsg: (msg: string) => void 
}

// Component for pop up notifs
export default function Notif({ msg, success, setMsg } : NotifProps) {
  useEffect(() => {
    if (msg == "") return
    async function wait() {
      await new Promise(resolve => setTimeout(resolve, 5000))
      setMsg("")
    }
    wait()
  }, [msg])
  return (
    <ToastContainer position="bottom-end" style={{position: "fixed", margin: "20px"}}>
      <Toast bg={success ? "success" : "danger"} autohide={true} show={msg == "" ? false : true}>
          <Toast.Body style={{color: "white"}}>{msg}</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}