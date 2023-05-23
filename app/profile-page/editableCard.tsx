import React, { useState } from "react";
import SaveChanges from "./saveChanges";
import EditButton from "./editButton";

interface EditableCardProps {
  field: string;
  value: string | number;
  maxChars : number;
  onSave: (value: string | number) => void;
}

function EditableCard({ field, value, maxChars, onSave }: EditableCardProps) {
  const [inEditingState, setEditingState] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleEdit = () => {
    setEditingState(true);
  };

  const handleSaveChanges = () => {
    setEditingState(false);
    onSave(editedValue);
  };

  return (
    <div>
      <div className="col-sm-6 editable-card">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{field}</h5>
            {inEditingState ? (
              <div className = "card-content">
                <textarea
                  value={editedValue}
                  maxlength = {maxChars}
                  rows = {2}
                  cols = {75}
                  onChange={(event) => setEditedValue(event.target.value)}
                ></textarea>
                <SaveChanges onClick={handleSaveChanges} />
              </div>
            ) : (
              <div className = "card-content">
                <p>{value}</p>
                <EditButton onClick={handleEdit} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditableCard;
