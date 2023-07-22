import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import profileStyles from "./profile-page.module.css"

export default function EditButton({ onEditChanges } : { onEditChanges: () => void}) {
  return (
    <div className="edit-button">
      <FontAwesomeIcon
        icon={faPencil}
        className={profileStyles["pen-icon"]}
        onClick={onEditChanges}
      />
    </div>
  );
}