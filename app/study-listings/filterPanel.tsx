"use client"

import { ChangeEvent, useState } from "react"

type FilterPanelProps = {
  filters: string[][],
  modifyFilters: (filter:string, isAdd:boolean, isMustInclude:boolean) => void,
}

function FilterTags({ filters } : Pick<FilterPanelProps, 'filters'>) {
  const mustIncludeFilters = filters[0].map((filter) => {
    return <span className="badge" key={filter}>{filter}</span>
  })

  const canIncludeFilters = filters[1].map((filter) => {
    return <span className="badge" key={filter}>{filter}</span>
  })

  return (
    <div id="filter-tags">
      <div className="">
        <p style={{ marginBottom : "0rem" }}>Must be included:</p>
        {mustIncludeFilters}
      </div>
      <div className="">
      <p style={{ marginBottom : "0rem" }}>Can be included:</p>
        {canIncludeFilters}
      </div>
    </div>
  )
}

export default function FilterPanel({ filters, modifyFilters } : FilterPanelProps) {
  const [inputFilter, setInputFilter] = useState('')
  const [isAddFilter, setIsAddFilter] = useState<boolean>(true)
  const [isMustInclude, setIsMustInclude] = useState<boolean>(false)

  const toggleIsAddFilter = () => setIsAddFilter(!isAddFilter)
  
  const handleChange = (event:ChangeEvent<HTMLInputElement>) => {
    setInputFilter(event.target.value);
  };

  const handleClick = () => {
    modifyFilters(inputFilter, isAddFilter, isMustInclude)
    setInputFilter('')
  }

  return (
    <div className="container col-4" id="filter-container">
      <h3>Filter Panel</h3>
      <input
        type="text"
        className="form-control"
        placeholder="Enter desired filter"
        value={inputFilter}
        onChange={handleChange}
      />
      <button 
        className="btn btn-primary" 
        type="submit" 
        onClick={handleClick}
      > Add filter </button>
      <div className="form-check form-switch">
        <input className="form-check-input" type="checkbox" role="switch" id="includeFilterSwitch"
          onChange={() => setIsMustInclude(!isMustInclude)}/>
        <label className="form-check-label" htmlFor="includeFilterSwitch">Must include filter</label>
      </div>
      <FilterTags filters={...filters} />

    </div>
  )
}