"use client"

import { ChangeEvent, SyntheticEvent, useState } from "react"
import { Autocomplete, TextField } from "@mui/material"
import { data } from "./data"

// function FilterTags({ filters } : Pick<FilterPanelProps, 'filters'>) {
//   const mustIncludeFilters = filters[0].map((filter) => {
//     return <span className="badge" key={filter}>{filter}</span>
//   })

//   const canIncludeFilters = filters[1].map((filter) => {
//     return <span className="badge" key={filter}>{filter}</span>
//   })

//   return (
//     <div id="filter-tags">
//       <div className="">
//         <p style={{ marginBottom : "0rem" }}>Must be included:</p>
//         {mustIncludeFilters}
//       </div>
//       <div className="">
//       <p style={{ marginBottom : "0rem" }}>Can be included:</p>
//         {canIncludeFilters}
//       </div>
//     </div>
//   )
// }

type FilterAutoCompleteProps = {
  label: string,
  type: string,
  options: string[],
  handleFilterChange: (event:SyntheticEvent<Element, Event>, value:string[], type:string) => void
}

function FilterAutoComplete({ label, type, options, handleFilterChange } : FilterAutoCompleteProps) {
  return (
    <label style={{marginBottom: "5px"}}>{label}
      <Autocomplete
        multiple
        id="multiple-limit-tags"
        options={options}
        sx={{ width: "100%", marginTop: "8px"  }}
        renderInput={(params) => <TextField {...params} label={label} />}
        onChange={(event, value) => handleFilterChange(event, value, type)}
      /> </label>
  )
}

type FilterPanelProps = {
  modifyFilters: (filterArray:string[], type:string) => void,
}

export default function FilterPanel({ modifyFilters } : FilterPanelProps) {

  function handleFilterChange(event: SyntheticEvent<Element, Event>, value: string[], type: string) {
    modifyFilters(value, type)
  }

  return (
    <div className="container col-4" id="filter-container">
      <FilterAutoComplete 
        label="Module"   
        type="modules"
        options={Array.from(data["modules"])}
        handleFilterChange={handleFilterChange} />
      <FilterAutoComplete 
        label="Location" 
        type="locations"
        options={Array.from(data["locations"])}
        handleFilterChange={handleFilterChange} />
      <FilterAutoComplete 
        label="Faculty"  
        type="faculties"
        options={Array.from(data["faculties"])}
        handleFilterChange={handleFilterChange} />
    </div>
  )
}