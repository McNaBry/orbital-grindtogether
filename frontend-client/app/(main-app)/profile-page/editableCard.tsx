import React, { useState } from "react";
import SaveChanges from "./saveChanges";
import EditButton from "./editButton";
import { Card } from "react-bootstrap"

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
    <Card>
      <Card.Body>
        <Card.Title>{field}</Card.Title>
        {inEditingState ? (
          <Card.Text id="edit-area">
            <textarea
              value={editedValue}
              maxLength = {maxChars}
              rows = {2}
              cols = {75}
              onChange={(event) => setEditedValue(event.target.value)}
            ></textarea>
            <SaveChanges onClick={handleSaveChanges} />
          </Card.Text>
        ) : (
          <Card.Text>
            {value}
            <EditButton onClick={handleEdit} />
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
}

export default EditableCard;
