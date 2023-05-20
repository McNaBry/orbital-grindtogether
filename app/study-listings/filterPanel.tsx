"use client"

import { ChangeEvent, useState } from "react"

type FilterPanelProps = {
  filters: string[],
  modifyFilters: (filter:string) => void,
  toggleIsMustInclude: () => void;
  toggleIsAddFilter: () => void;
}

function FilterTags({ filters } : Pick<FilterPanelProps, 'filters'>) {
  let tagBoxes = filters.map((filter) => {
    return <span className="badge" key={filter}>{filter}</span>
  })

  return (
    <div className="tag-row">
    {tagBoxes}
    </div>
  )
}

export default function FilterPanel({ filters, modifyFilters, toggleIsMustInclude, toggleIsAddFilter } : FilterPanelProps) {
  const [inputFilter, setInputFilter] = useState('')
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputFilter(e.target.value);
  };

  return (
    <div className="container col-4" id="filter-container">
      <h3>Filter Panel</h3>
      <input
        type="text"
        className="form-control"
        placeholder="Enter desired filter"
        onChange={handleChange}
      />
      <br/>
      <button className="btn btn-primary" type="submit" onClick={() => modifyFilters(inputFilter)}>Add filter</button>
      <br/>
      <FilterTags filters={...filters} />
    </div>
  )
}