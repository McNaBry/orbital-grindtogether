"use client"

import { useState } from "react"
import { Option } from "../create-listing/select"
import StudyListings from "./studyListings"
import FilterPanel from "./filterPanel"
import ListingPageControl from "./listingPageControl"
import useSWR from 'swr'
import { ActionMeta } from "react-select"
import { testData } from "./data"

import './studyListings.css'

export default function ListingsPage() {
  // For pagination.
  const [page, setPage] = useState<number>(1)

  // Filters which are mutated by the FilterPanel component
  const [filters, setFilters] = useState<{ [key:string] : Array<string>}>({
    "modules"   : [],
    "locations" : [],
    "faculties" : []
  })

  // Method to fetch data from the server
  const fetcher = async (url:string) => fetch(url, {method: 'POST'}).then(res => {
    return res.json()
  })

  // useSWR hook that wraps around the fetcher method
  const { data, error, isLoading } = useSWR("http://localhost:5000/get-listings", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  })

  // Function that mutates the filters and is passed into FilterPanel
  function handleMultipleOptionChange(type: string, option: readonly Option[], actionMeta: ActionMeta<Option>) {
    const values = option.map(item => item.value)
    setFilters(prevFilters => ({
      ...prevFilters,
      [type]: values
    }))
  }

  return (
    <div className="container">
      <h1 style={{color:"white"}}>Status: {error ? "error" : (isLoading ? "loading..." : "done")}</h1>
      <div id="header-container">
        <h1>Study Listings</h1>
        <ListingPageControl page={page} setPage={setPage} />
      </div>
      <div className="row">
        <StudyListings page={page} limit={5} filters={filters} data={error ? testData : (isLoading ? testData : data)} />
        <FilterPanel handleChange={handleMultipleOptionChange} />
      </div>
      <ListingPageControl page={page} setPage={setPage} />
    </div>
  )
}