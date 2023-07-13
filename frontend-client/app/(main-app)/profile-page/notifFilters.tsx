"use client"

import { useState } from "react"
import { Card, Badge, Button } from "react-bootstrap"
import { tagData } from "../(listing)/study-listings/data"
import {
  Option,
  SelectMultiOption
} from "../(listing)/create-listing/select"
import { ActionMeta } from "react-select"
import ActionBar from "./actionBar"

const mappedTagData : {[key:string]: string} = {}

for (const key in tagData) {
  tagData[key].forEach(item => mappedTagData[item] = key)
}

type NotifFiltersProps = {
  filters: string[];
  onSave: (value: string[]) => void;
}

export default function NotifFilters({ filters, onSave } : NotifFiltersProps) {
  // Toggle edit mode
  const [ editMode, setEditMode ] = useState<boolean>(false)
  // Hook to stage/store our updated filters
  // Default to empty array so that we can check if no new filters have been added/deleted
  const [ newFilters, setNewFilters ] = useState<string[]>([])

  // Changes the updated filters to temporarily store the new changes
  function handleMultipleOptionChange(type: string, option: readonly Option[], actionMeta: ActionMeta<Option>) {
    const values = option.map(item => item.value)
    setNewFilters(values)
  }

  const handleEdit = () => {
    setEditMode(true)
  }

  const handleSaveChanges = () => {
    onSave(newFilters)
    setNewFilters([])
    setEditMode(false)
  }

  const handleCancelChanges = () => {
    setNewFilters([])
    setEditMode(false)
  }

  const tags = filters.map(item => {
    return <Badge key={item} className={mappedTagData[item] + " " + "tag"}>{ item }</Badge>
  })
  
  return (
    <Card>
      <Card.Body>
        <Card.Title>Notification Filters</Card.Title>
        <Card.Text id="notif-tag-row">
          { tags }
        </Card.Text>
        { editMode
          ? <SelectMultiOption
              params={{
                name: "Filters",
                type: "filters",
                defaultValue: filters.map(tag => ({ value: tag, label: tag })),
                options: Object.keys(mappedTagData).map(tag => ({ value: tag, label: tag })),
                handleChange: handleMultipleOptionChange
              }} 
            />
          : <></>
        }
        <ActionBar
          editMode={editMode}
          onEditChanges={handleEdit}
          onSaveChanges={handleSaveChanges}
          onCancelChanges={handleCancelChanges}
        />
      </Card.Body>
    </Card>
  )
}