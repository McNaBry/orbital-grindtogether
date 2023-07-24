"use client"

import { useState } from "react"
import useSWR from 'swr'
import { Option } from "../../(components)/select"
import { ActionMeta } from "react-select"

import { testData } from "./data"

import ListingPageControl from "./listingPageControl"
import StudyListings from "./studyListings"
import SortPanel, { SortFunction } from "./sortPanel"
import FilterPanel from "./filterPanel"

import { Row } from "react-bootstrap"
import viewStyles from './studyListings.module.css'
import { StudyListing } from "../../(components)/studyCard"

const SortFunctions : SortFunction[] = [
  (a: StudyListing, b: StudyListing) => {
    if (a.date == null && b.date == null) return -1
    // In ascending order, listings with null date will be in front
    else if (a.date == null) return -1
    else if (b.date == null) return 1
    return a.date <= b.date ? -1 : 1 
  },

  (a: StudyListing, b: StudyListing) => {
    if (a.dateCreated == null && b.dateCreated == null) return -1
    // In ascending order, listings with null date will be in front
    else if (a.dateCreated == null) return -1
    else if (b.dateCreated == null) return 1
    return a.dateCreated <= b.dateCreated ? -1 : 1 
  },

  (a: StudyListing, b: StudyListing) => {
    return a.creatorName <= b.creatorName ? -1 : 1 
  },

  (a: StudyListing, b: StudyListing) => {
    return a.interest <= b.interest ? -1 : 1 
  },
]

export default function ListingsPage() {
  // For pagination.
  const [page, setPage] = useState<number>(1)

  // Filters which are mutated by the FilterPanel component
  // The filters are passed into StudyListings
  const [filters, setFilters] = useState<{ [key:string] : Array<string>}>({
    "modules"   : [],
    "locations" : [],
    "faculties" : []
  })

  const [sortOption, setSortOption] = useState<number>(1)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  // Method to fetch data from the server
  const fetcher = async (url:string) => fetch(url, {method: 'POST', credentials: "include"})
    .then(res => {
      return res.json()
    })

  // useSWR hook that wraps around the fetcher method
  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/get-listings`, fetcher, {
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
    <div id={viewStyles["study-listings-container"]}>
      {/* <h1 style={{color:"white"}}>Status: {error ? "error" : (isLoading ? "loading..." : "done")}</h1> */}
      <div id="header-container">
        <h1 style={{color: "white", textAlign: "center"}}>Study Listings</h1>
        <ListingPageControl page={page} setPage={setPage} />
      </div>
      <Row id={viewStyles["listings-filter-container"]}>
        <div className="col-lg-8 col-12">
          <StudyListings 
            page={page} 
            limit={5} 
            filters={filters} 
            sortFunction={SortFunctions[sortOption]}
            sortReverse={sortDirection}
            data={error ? testData : (isLoading ? testData : data)}
            variant="display" />
        </div>
        <div className="col-lg-4 col-12" style={{padding: "0px", marginBottom: "10px"}}>
          <FilterPanel handleChange={handleMultipleOptionChange} />
          <SortPanel 
            setSortDirection={(direction: boolean) => setSortDirection(direction)}
            setSortOption={(index: number) => setSortOption(index)}
          />
        </div>
      </Row>
      <ListingPageControl page={page} setPage={setPage} />
    </div>
  )
}