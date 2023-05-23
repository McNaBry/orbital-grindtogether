import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { MouseEvent } from "react"

function EditButton({onClick} : MouseEvent) {
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