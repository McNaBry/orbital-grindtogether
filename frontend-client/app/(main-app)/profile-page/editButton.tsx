import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

export default function EditButton({ onEditChanges } : { onEditChanges: () => void}) {
  return (
    <div className="edit-button">
      <FontAwesomeIcon
        icon={faPencil}
        className="pen-icon"
        onClick={onEditChanges}
      />
    </div>
  );
}