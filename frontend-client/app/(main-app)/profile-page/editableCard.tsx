import { useState } from "react";
import { Card, Placeholder } from "react-bootstrap"
import ActionBar from "./actionBar";

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

  return (
    <div className="profile-field">
      <h4>{field}</h4>
      { isLoading 
        ? <Placeholder as={Card.Text} animation="glow"><Placeholder xs={12}/></Placeholder>
        : <> 
          { inEditingState 
            ? <div id="edit-area">
                <textarea
                  className="input-field"
                  value={value}
                  maxLength = {maxChars}
                  rows = {2}
                  cols = {75}
                  onChange={(event) => setEditedValue(event.target.value)}
                ></textarea>
              </div>
            : value
          }
          <ActionBar
            editMode={inEditingState}
            onEditChanges={handleEdit}
            onSaveChanges={handleSaveChanges}
            onCancelChanges={handleCancelChanges}
          /> 
        </>
      }
    </div>
  );
}

export default EditableCard;
