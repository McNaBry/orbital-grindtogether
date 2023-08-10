import { MouseEventHandler } from "react";
import styles from "./auth.module.css";

type CreateStatusProps = {
  msg: string,
  success: boolean,
  dismissAlert: MouseEventHandler<HTMLButtonElement>
}

function CreateStatus({ msg, success, dismissAlert }: CreateStatusProps) {
  return (
    <>
    {!success && msg && (
      <div
        className={"alert alert-dismissible fade show " + styles["alert-danger"]}
        role="alert"
      >
        <img
          src={"images/danger.svg"}
          className="bi flex-shrink-0 me-2"
          id={styles["danger-icon"]}
        />
        <span data-testid="create-status-msg">{msg}</span>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={dismissAlert}
        ></button>
      </div>
    )}
    {success && msg && (
      <div
        className={"alert alert-dismissible fade show " + styles["alert-success"]}
        role="alert"
      >
        <img
          src="images/success.svg"
          className="bi flex-shrink-0 me-2"
          id={styles["success-icon"]}
        />
        <span data-testid="create-status-msg">{msg}</span>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={dismissAlert}
        ></button>
      </div>
    )}
    </>
  )
}

export default CreateStatus;