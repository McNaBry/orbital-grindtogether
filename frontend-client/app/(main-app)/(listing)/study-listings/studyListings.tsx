"use client"

import StudyCard, { StudyListing } from "../studyCard"
import { useState } from "react"

type StudyListingsProps = {
  page: number, 
  limit: number,
  filters: { [key:string] : string[] },
  data: StudyListing[],
  variant: string
}

export default function StudyListings({ page, limit, filters, data, variant } : StudyListingsProps) {
  if (data.length == 0 || data == null) return (<h1>Data null error</h1>)

  const filterData = data.filter(listing => {
    const categories = Object.keys(listing.tags)
    for (let i = 0; i < categories.length; i++) {
      const filterArr = filters[categories[i]]
      // No filters found for that category.
      if (filterArr.length == 0) continue
      for (let j = 0; j < filterArr.length; j++) {
        // Check if listing includes one of the filters in the current category.
        if (listing.tags[categories[i]].includes(filterArr[j])) break
        // None of the tags are found in the current category of filters.
        else if (j == filterArr.length - 1) return false
      }
    }

    return true
  })

  const [sortFunction, setSortFunction] = useState(null)

  // Sort functions
  const sortByDate = (a: any, b: any) : number => {
    return a.date - b.date
  }

  const sortByCreatedListingDate = (a: any, b: any) : number => {
    return a.createdListingDate - b.createdListingDate
  }

  // the indexes of the functions here matches the labels in the SortOptionsButton
  const sortFunctions = [sortByDate, sortByCreatedListingDate]

  const handleSort = (sortFunction) => {
    setSortFunction(sortFunction)
  }

  const sortedData = sortFunction ? filterData.slice().sort(sortFunction) : filterData;

  const slicedData = page == -1
    ? filterData
    : filterData.slice((page - 1) * limit, page * limit)

  const listings = slicedData.map((listing) => {
    return <StudyCard key={listing["id"]} listingData={listing} variant={variant} />
  })

  return (
    <div className="container col-8" id="listing-container">
      <div className="row g-0 justify-content-evenly">
        {listings}
      </div>
    </div>
  )
}