import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface EyeForPasswordProps {
  isVisible: boolean;
  setVisible: () => void;
}

function EyeForPassword({ isVisible, setVisible }: EyeForPasswordProps) {
    return (
      <div className="eye-password" onClick={setVisible}>
        <FontAwesomeIcon
          icon={isVisible ? faEye : faEyeSlash}
          className="eye-icon"
        />
      </div>
    );
}

export default EyeForPassword;
