"use client"

import { useState } from "react"
import { Card, Placeholder } from "react-bootstrap"
import { tagData } from "../(listing)/study-listings/data"
import {
  Option,
  SelectMultiOption
} from "../(components)/select"
import { ActionMeta } from "react-select"
import EditButton from "./editButton"
import SaveCancelBar from "./saveCancelBar"
import profileStyles from "./profile-page.module.css"

const mappedTagData : {[key:string]: string} = {}

for (const key in tagData) {
  tagData[key].forEach(item => mappedTagData[item] = key)
}

type NotifFiltersProps = {
  isLoading: boolean,
  filters: string[];
  onSave: (value: string[]) => void;
}

export default function NotifFilters({ isLoading, filters, onSave } : NotifFiltersProps) {
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
    if (newFilters.length > 0) onSave(newFilters)
    setNewFilters([])
    setEditMode(false)
  }

  const handleCancelChanges = () => {
    setNewFilters([])
    setEditMode(false)
  }

  const tags = filters.map(item => {
    return <span 
      key={item} 
      className={"badge " + profileStyles[mappedTagData[item]] + " " + profileStyles["tag"]}>
        { item }
      </span>
  })
  
  return (
    <div className={profileStyles["profile-field"]}>

      <div className={profileStyles["profile-header-container"]}>
        <h4 style={{color: "white"}}>Notification Filters</h4>
        { isLoading ? <></> : <>{ editMode ? <></> : <EditButton onEditChanges={handleEdit} /> }</> }
      </div>

      { isLoading 
        ? <Placeholder as={Card.Text} animation="glow"><Placeholder xs={12}/></Placeholder>
        : <>
          <div id={profileStyles["notif-tag-row"]}>{ tags }</div>
          { editMode
            ? <>
                <div style={{color: "black", margin: "5px 0px"}}>
                <SelectMultiOption
                  params={{
                    name: "Filters",
                    type: "filters",
                    defaultValue: filters.map(tag => ({ value: tag, label: tag })),
                    options: Object.keys(mappedTagData).map(tag => ({ value: tag, label: tag })),
                    handleChange: handleMultipleOptionChange
                  }} 
                />
                </div>
                <SaveCancelBar
                  onSaveChanges={handleSaveChanges}
                  onCancelChanges={handleCancelChanges}
                />
              </>
            : <></>
          }
        </>
      }

    </div>
  )
}