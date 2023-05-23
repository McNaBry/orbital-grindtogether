"use client"

import { useState } from "react"
import './studyListings.css'
import StudyListings, { StudyListing } from "./studyListings"
import FilterPanel from "./filterPanel"

const data : { [id: string] : StudyListing } = {
  invite_1: {
    title:    "Study @ Terrace",
    desc:     "Let's have some fun grinding together!",
    tags:     {"modules": ["CS2040S"], "locations": ["COM3"], "faculties": ["SOC"]},
    date:     "24/10/2023",
    freq:     "Every Week",
    interest: "20",
    id: 1001
  },

  invite_2: {
    title:    "Study @ Basement1",
    desc:     "Seeking for people willing to carry my assignment",
    tags:     {"modules": ["CS1231S"], "locations": ["COM3"], "faculties": ["SOC"]},
    date:     "24/10/2023",
    freq:     "Every Week",
    interest: "0",
    id: 1002
  },

  invite_3: {
    title:    "Study @ ASL2",
    desc:     "Anyone wants to be my study date?",
    tags:     {"modules": ["HSI1000"], "locations": ["COM3"], "faculties": ["CHS"]},
    date:     "25/10/2023",
    freq:     "Once",
    interest: "2",
    id: 1003
  },

  invite_4: {
    title:    "Grind Sesh",
    desc:     "NUS Grind Sesh by your favourite boi",
    tags:     {"modules": ["CS2040S", "CS2030S", "CS2100"], "locations": ["COM3"], "faculties": ["SOC"]},
    date:     "25/10/2023",
    freq:     "Every Week",
    interest: "50",
    id: 1003
  },

  invite_5: {
    title:    "Chill study",
    desc:     "Talk, study and chill",
    tags:     {"modules": ["IS2218"], "locations": ["Terrace"], "faculties": ["SOC"]},
    date:     "25/10/2023",
    freq:     "Once",
    interest: "2",
    id: 1003
  }
}

export default function ListingsPage() {
  const [filters, setFilters] = useState<{ [key:string] : Array<string>}>({
    "modules"   : [],
    "locations" : [],
    "faculties" : []
  })

  function modifyFilters(filterArray:string[], type:string) {
    setFilters(prevFilters => ({
      ...prevFilters,
      [type]: filterArray
    }))
  }

  return (
    <div className="container">
      <div style={{ display:"flex", width:"auto", justifyContent:"center", padding:"10px", color:"white"}}>
        <h1>Study Listings</h1>
      </div>
      <div className="row">
        <FilterPanel
          modifyFilters={modifyFilters}
        />
        <StudyListings filters={filters} data={data} />
      </div>
    </div>
  )
}