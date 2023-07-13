import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";

type ActionBarProps = {
  // Boolean flag to conditionally render the buttons
  editMode: boolean,
  // Functions to trigger when you click on each button
  onEditChanges:   () => void,
  onSaveChanges:   () => void,
  onCancelChanges: () => void
}

function EditButton({ onEditChanges } : { onEditChanges: () => void}) {
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

function SaveButton({ onSaveChanges } : { onSaveChanges: () => void }) {
  return (
    <Button 
      variant="success" 
      style={{marginRight: "5px"}}
      onClick={onSaveChanges}>
        Save Changes
    </Button>
  )
}

function CancelButton({ onCancelChanges } : { onCancelChanges: () => void }) {
  return (
    <Button 
      variant="danger" 
      onClick={onCancelChanges}>
        Cancel Changes
    </Button>
  )
}

export default function ActionBar({ editMode, onEditChanges, onSaveChanges, onCancelChanges } : ActionBarProps) {
  return (
    <> 
      { editMode
        ? <div id="profile-action-bar">
            <SaveButton onSaveChanges={onSaveChanges} />
            <CancelButton onCancelChanges={onCancelChanges} />
          </div>
        : <div id="profile-action-bar">
            <EditButton onEditChanges={onEditChanges} />
          </div>
      }
    </>
  )
}