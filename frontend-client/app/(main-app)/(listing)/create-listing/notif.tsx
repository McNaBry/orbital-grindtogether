import { Toast, ToastContainer } from "react-bootstrap"

function Notif({ msg, success }: { msg: string; success: boolean }) {
  return (
    <ToastContainer
      position="bottom-end"
      style={{ position: "fixed", margin: "20px" }}
    >
      <Toast
        bg={success ? "success" : "danger"}
        autohide={true}
        show={msg == "" ? false : true}
      >
        <Toast.Body style={{ color: "white" }}>{msg}</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default Notif
