"use client"

import { 
  SelectMultiOption, 
  SelectMultiOptionProps 
} from "../create-listing/select"
import { tagData } from "./data"

function FilterAutoComplete({ name, type, options, defaultValue, handleChange } : SelectMultiOptionProps) {
  return (
    <>
      <label style={{color: "white", marginTop: "10px"}}>{name}</label>
      <SelectMultiOption
        params={{
          name: name,
          type: type,
          options: options,
          defaultValue: defaultValue,
          handleChange: handleChange
        }}
      />
    </>
  )
}

export default function FilterPanel({ handleChange } : Pick<SelectMultiOptionProps, 'handleChange'>) {
  return (
    <div className="container col-4" id="filter-container">
      <FilterAutoComplete 
        name="Module"   
        type="modules"
        options={tagData["modules"].map(value => ({value: value, label: value}))}
        defaultValue={[]}
        handleChange={handleChange} />
      <FilterAutoComplete 
        name="Location" 
        type="locations"
        options={tagData["locations"].map(value => ({value: value, label: value}))}
        defaultValue={[]}
        handleChange={handleChange} />
      <FilterAutoComplete 
        name="Faculty"  
        type="faculties"
        options={tagData["faculties"].map(value => ({value: value, label: value}))}
        defaultValue={[]}
        handleChange={handleChange} />
    </div>
  )
}