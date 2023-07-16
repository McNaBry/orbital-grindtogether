import { useEffect, useState } from "react";
import { Card, Placeholder } from "react-bootstrap"
import EditButton from "./editButton"
import SaveCancelBar from "./saveCancelBar";

interface EditableCardProps {
  isLoading: boolean;
  field: string;
  value: string | number;
  maxChars : number;
  onSave: (value: string | number) => void;
}

function EditableCard({ isLoading, field, value, maxChars, onSave }: EditableCardProps) {
  const [inEditingState, setInEditingState] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleEdit = () => setInEditingState(true);

  const handleSaveChanges = () => {
    setInEditingState(false);
    onSave(editedValue);
  };

  const handleCancelChanges = () => {
    setInEditingState(false);
  }

  // Sync component with data sent from server
  useEffect(() => setEditedValue(value), [value])

  return (
    <div className="profile-field">
      <div className="profile-header-container">
        <h4 style={{color: "white"}}>{field}</h4>
        { isLoading ? <></> : <>{ inEditingState ? <></> : <EditButton onEditChanges={handleEdit} /> }</> }
      </div>
      { isLoading 
        ? <Placeholder as={Card.Text} animation="glow"><Placeholder xs={12}/></Placeholder>
        : <> 
          { inEditingState 
            ? <>
                <div id="edit-area">
                  <textarea
                    className="input-field"
                    value={editedValue}
                    maxLength = {maxChars}
                    rows = {2}
                    cols = {75}
                    onChange={(event) => setEditedValue(event.target.value)}
                  ></textarea>
                </div>
                <SaveCancelBar
                  onSaveChanges={handleSaveChanges}
                  onCancelChanges={handleCancelChanges}
                /> 
              </>
            : value
          }
        </>
      }
    </div>
  );
}

export default EditableCard;
