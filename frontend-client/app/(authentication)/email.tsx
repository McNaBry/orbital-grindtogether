import { useState, ChangeEvent } from "react";
import styles from "./auth.module.css";

interface EmailProps {
  onChange: (email: string) => void;
}

function Email({ onChange }: EmailProps) {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <>
      <label htmlFor="email" className={styles["form-label"]}>
        Email
      </label>
      <input
        type="email"
        name="email"
        className="form-control"
        id="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
      ></input>
    </>
  );
}

export default Email;
