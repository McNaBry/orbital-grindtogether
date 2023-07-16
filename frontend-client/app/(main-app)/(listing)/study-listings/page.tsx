"use client"

import { useState } from "react"
import useSWR from 'swr'

import { Option } from "../create-listing/select"
import { ActionMeta } from "react-select"

import { testData } from "./data"

import StudyListings from "./studyListings"
import FilterPanel from "./filterPanel"
import ListingPageControl from "./listingPageControl"
import SortOptionsButton from "./sortOptionsButton"
import SortDirectionButton from "./sortDirectionButton"
import { Row, Container } from "react-bootstrap"
import viewStyles from './studyListings.module.css'

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
            data={error ? testData : (isLoading ? testData : data)}
            variant="display" />
        </div>
        <div className="col-lg-4 col-12" style={{padding: "0px", marginBottom: "10px"}}>
          <FilterPanel handleChange={handleMultipleOptionChange} />
        </div>
        {/* <SortOptionsButton />
        <SortDirectionButton /> */}
      </Row>
      <ListingPageControl page={page} setPage={setPage} />
    </div>
  )
}