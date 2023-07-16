"use client"

import { 
  Option, 
  SelectMultiOption, 
  SelectMultiOptionProps 
} from "../create-listing/select"
import { Container } from "react-bootstrap"
import viewStyles from "./studyListings.module.css"
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
    <Container id={viewStyles["filter-container"]}>
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
    </Container>
  )
}