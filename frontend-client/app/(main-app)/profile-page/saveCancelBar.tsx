import { Button } from "react-bootstrap";
import profileStyles from "./profile-page.module.css"

type SaveCancelBarProps = {
  // Functions to trigger when you click on each button
  onSaveChanges:   () => void,
  onCancelChanges: () => void
}

function SaveButton({ onSaveChanges } : { onSaveChanges: () => void }) {
  return (
    <Button 
      variant="success" 
      style={{marginRight: "5px", marginBottom: "5px"}}
      onClick={onSaveChanges}>
        Save
    </Button>
  )
}

function CancelButton({ onCancelChanges } : { onCancelChanges: () => void }) {
  return (
    <Button 
      variant="danger" 
      style={{marginBottom: "5px"}}
      onClick={onCancelChanges}>
        Cancel
    </Button>
  )
}

export default function ActionBar({ onSaveChanges, onCancelChanges } : SaveCancelBarProps) {
  return (
    <div id={profileStyles["profile-action-bar"]}>
      <SaveButton onSaveChanges={onSaveChanges} />
      <CancelButton onCancelChanges={onCancelChanges} />
    </div>
  )
}