import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "./auth.module.css"

interface EyeForPasswordProps {
  isVisible: boolean;
  setVisible: () => void;
}

function EyeForPassword({ isVisible, setVisible }: EyeForPasswordProps) {
    return (
      <div className={styles["eye-password"]} onClick={setVisible}>
        <FontAwesomeIcon
          icon={isVisible ? faEye : faEyeSlash}
          className={styles["eye-icon"]}
        />
      </div>
    );
}

export default EyeForPassword;
