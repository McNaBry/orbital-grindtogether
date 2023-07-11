import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

function EditButton({onClick} : {onClick: () => void}) {
    return (
        <div className="edit-button">
          <FontAwesomeIcon
            icon= {faPencil}
            className="pen-icon"
            onClick = {onClick}
          />
        </div>
      );
}

export default EditButton;