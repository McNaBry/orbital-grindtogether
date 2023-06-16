"use client"

import { useState } from "react"
import { Option } from "../create-listing/select"
import './studyListings.css'
import StudyListings from "./studyListings"
import FilterPanel from "./filterPanel"
import useSWR from 'swr'
import { ActionMeta } from "react-select"
import { testData } from "./data"

export default function ListingsPage() {
  const fetcher = async (url:string) => fetch(url, {method: 'POST'}).then(res => {
    console.log(res)
    return res.json()
  })
  const { data, error, isLoading } = useSWR('http://localhost:5000/get-listings', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })

  const [filters, setFilters] = useState<{ [key:string] : Array<string>}>({
    "modules"   : [],
    "locations" : [],
    "faculties" : []
  })

  function handleMultipleOptionChange(type: string, option: readonly Option[], actionMeta: ActionMeta<Option>) {
    const values = option.map(item => item.value)
    setFilters(prevFilters => ({
      ...prevFilters,
      [type]: values
    }))
  }

  return (
    <div className="container">
      <h1 style={{color:"white"}}>Stuff: {error ? "error" : (isLoading ? "loading..." : data.name)}</h1>
      <div style={{ display:"flex", width:"auto", justifyContent:"center", padding:"10px", color:"white"}}>
        <h1>Study Listings</h1>
      </div>
      <div className="row">
        <StudyListings filters={filters} data={testData} />
        <FilterPanel handleChange={handleMultipleOptionChange} />
      </div>
    </div>
  )
}