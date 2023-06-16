"use client"

import { 
  Option, 
  SelectFreeOption, SelectMultiOption, 
  SelectFreeOptionProps, SelectMultiOptionProps 
} from "../create-listing/select"
import { tagData } from "./data"

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

function FilterAutoComplete({ name, type, options, handleChange } : SelectMultiOptionProps) {
  return (
    <>
      <label style={{color: "white", marginTop: "10px"}}>{name}</label>
      <SelectMultiOption
        params={{
          name: name,
          type: type,
          options: options,
          handleChange: handleChange
        }}
      />
    </>
  )
}

export default function FilterPanel({ handleChange } : Pick<SelectMultiOptionProps, 'handleChange'>) {

  // function handleFilterChange(event: SyntheticEvent<Element, Event>, value: string[], type: string) {
  //   modifyFilters(value, type)
  // }

  return (
    <div className="container col-4" id="filter-container">
      <FilterAutoComplete 
        name="Module"   
        type="modules"
        options={tagData["modules"].map(value => ({value: value, label: value}))}
        handleChange={handleChange} />
      <FilterAutoComplete 
        name="Location" 
        type="locations"
        options={tagData["locations"].map(value => ({value: value, label: value}))}
        handleChange={handleChange} />
      <FilterAutoComplete 
        name="Faculty"  
        type="faculties"
        options={tagData["faculties"].map(value => ({value: value, label: value}))}
        handleChange={handleChange} />
    </div>
  )
}