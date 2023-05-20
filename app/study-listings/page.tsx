"use client"

import { useState } from "react"
import './study_listing.css'
import StudyListings, { StudyListing } from "./studyListings"
import FilterPanel from "./filterPanel"

const data : { [id: string] : StudyListing } = {
  invite_1: {
    title:    "Study @ Terrace",
    desc:     "Let's have some fun grinding together!",
    tags:     ["CS2040S", "COM3", "SOC"],
    date:     "24/10/2023",
    freq:     "Every Week",
    interest: "20",
    id: 1001
  },

  invite_2: {
    title:    "Study @ Basement1",
    desc:     "Seeking for people willing to carry my assignment",
    tags:     ["CS1231S", "COM3", "SOC"],
    date:     "24/10/2023",
    freq:     "Every Week",
    interest: "0",
    id: 1002
  },

  invite_3: {
    title:    "Study @ ASL2",
    desc:     "Anyone wants to be my study date?",
    tags:     ["CS3230", "COM3", "Study-Date", "SOC"],
    date:     "25/10/2023",
    freq:     "Once",
    interest: "2",
    id: 1003
  }
}

export default function ListingsPage() {
  const [filters, setFilters] = useState<Array<string>>(new Array<string>())
  const [isMustInclude, setIsMustInclude] = useState<boolean>(false)
  const [isAddFilter, setIsAddFilter] = useState<boolean>(true)

  function modifyFilters(filter:string) {
    if (filter == '') return

    const newFilters = filters.slice()
    if (isAddFilter) {
      if (newFilters.includes(filter)) return
      newFilters.push(filter)
    } else {
      if (!newFilters.includes(filter)) return
      delete newFilters[newFilters.indexOf(filter)]
    }

    setFilters(newFilters)
    console.log("New filter: " + newFilters)
  }

  const toggleIsMustInclude = () => setIsMustInclude(!isMustInclude)
  const toggleIsAddFilter = () => setIsAddFilter(!isAddFilter)

  return (
    <div className="container">
      <div className="" style={{backgroundColor: "orange"}}>
        <h1>Study Listings</h1>
        <h5>Showing 1 result</h5>
      </div>
      <div className="row">
        <FilterPanel 
          filters={filters} 
          modifyFilters={modifyFilters} 
          toggleIsMustInclude={toggleIsMustInclude} 
          toggleIsAddFilter={toggleIsAddFilter}
        />
        <StudyListings filters={filters} data={data} />
      </div>
    </div>
  )
}