import { React, useState, ChangeEvent } from "react";
"Use Client"
import EyeForPassword from "./EyeForPassword";

interface PasswordInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password";
}

function PasswordInput({ value, onChange, type }: PasswordInputProps) {
  return (
    <input
      type={type}
      className="form-control"
      id="password"
      placeholder="Enter your password"
      value={value}
      onChange={onChange}
    />
  );
}

function Password({ value, onChange}: PasswordInputProps) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <div>
      <label htmlFor="password" className="form-label">
        Password
      </label>
      <div className="password-input">
        <PasswordInput
          value={value}
          onChange={onChange}
          type={isPasswordVisible ? "text" : "password"}
        />
        <EyeForPassword
          isVisible={isPasswordVisible}
          setVisible={togglePasswordVisibility}
        />
      </div>
    </div>
  );
}

export default Password;
