import { useState, ChangeEvent } from "react";
import EyeForPassword from "./eyeForPassword";
import styles from "./auth.module.css";

interface ConfirmPasswordInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password";
}

function ConfirmPasswordInput({
  value,
  onChange,
  type,
}: ConfirmPasswordInputProps) {
  return (
    <input
      type={type}
      name="confirmPw"
      className="form-control"
      id="confirm-password"
      placeholder="Confirm your password"
      value={value}
      onChange={onChange}
    />
  );
}

function ConfirmPassword({ value, onChange }: ConfirmPasswordInputProps) {
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <>
      <label htmlFor="confirm-password" className={styles["form-label"]}>
        Confirm Password
      </label>
      <div className={styles["password-input"]}>
        <ConfirmPasswordInput
          value={value}
          onChange={onChange}
          type={isConfirmPasswordVisible ? "text" : "password"}
        />
        <EyeForPassword
          isVisible={isConfirmPasswordVisible}
          setVisible={togglePasswordVisibility}
        />
      </div>
    </>
  );
}

export default ConfirmPassword;
