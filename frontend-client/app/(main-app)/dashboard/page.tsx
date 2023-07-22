'use client'

import styles from './dashboard.module.css'

import useSWR from 'swr'
import StudyListings from '../(listing)/study-listings/studyListings'
import { StudyListing } from '../(components)/studyCard'
import { useState } from 'react'
 
type ListingProps = {
  data: Array<StudyListing[]>, 
  error: any, 
  isLoading: any, 
  emptyFilters: {[id:string] : string[]}
}

function LikedListings({ data, error, isLoading, emptyFilters } : ListingProps) {
  return (
    <>
      <h3 style={{textAlign:"center", marginBottom: "15px"}}>Your Liked Listings</h3>
      { error 
        ? <h5 style={{textAlign:"center"}}>Error.</h5>
        : isLoading
          ? <h5 style={{textAlign:"center"}}>Loading data...</h5>
          : data[0].length == 0
            ? <h5 style={{textAlign:"center"}}>No Listings Found.</h5>
            : <StudyListings 
              page={-1} 
              limit={0} 
              filters={emptyFilters} 
              sortFunction={(a: StudyListing, b: StudyListing) => -1}
              sortReverse={true}
              data={data[0]} 
              variant="dashboard-display" 
            />
      }
    </>
  )
}

function CreatedListings({ data, error, isLoading, emptyFilters } : ListingProps) {
  return (
    <>
      <h3 style={{textAlign:"center", marginBottom: "15px"}}>Your Created Listings</h3>
      { error 
        ? <h5 style={{textAlign:"center"}}>Error.</h5>
        : isLoading
          ? <h5 style={{textAlign:"center"}}>Loading data...</h5>
          : data[1].length == 0
            ? <h5 style={{textAlign:"center"}}>No Listings Found.</h5>
            : <StudyListings 
              page={-1} 
              limit={0} 
              filters={emptyFilters} 
              sortFunction={(a: StudyListing, b: StudyListing) => -1}
              sortReverse={true}
              data={data[1]} 
              variant="modify" 
            />
      }
    </>
  )
}

type ListingViewerProps = {
  option: string, 
  data: Array<StudyListing[]>, 
  error: any, 
  isLoading: any
}

function ListingViewer({ option, data, error, isLoading } : ListingViewerProps) {
  const emptyFilters = {"modules":[], "locations":[], "faculties":[]}
  return (
    <div id={styles["listing-viewer"]}>
    { option === "liked"
      ? <div id={styles["listing-container"]}>
         <LikedListings data={data} error={error} isLoading={isLoading} emptyFilters={emptyFilters} />
        </div>
      : <div id={styles["listing-container"]}>
          <CreatedListings data={data} error={error} isLoading={isLoading} emptyFilters={emptyFilters} />
        </div>
    }
    </div>
  )
}

function SelectorContainer({ toggleState, viewState } : { toggleState: (state: string) => void, viewState: string }) {
  return (
    <div id={styles["selector-container"]}>
      <button 
        className={viewState == "liked" ? styles["active-selector"] : styles["selector"]} 
        onClick={() => toggleState("liked")}>Liked</button>
      <button 
        className={viewState == "created" ? styles["active-selector"] : styles["selector"]} 
        onClick={() => toggleState("created")}>Created</button>
    </div>
  )
}

export default function Dashboard() {
  const fetcher = async (url:string) => {
    return await fetch(url, { method: "POST", credentials: "include" }).then(res => res.json())
  }

  const { data, isLoading, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/get-dashboard-listings`, 
    fetcher,  {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    })
  
  const [viewState, setViewState] = useState<string>("liked")
  const toggleState = (state: string) => setViewState(state)
  
  return (
    <div id={styles["dashboard-container"]}>
      <h1 style={{textAlign:"center"}}>Dashboard</h1>
      <SelectorContainer toggleState={toggleState} viewState={viewState} />
      <ListingViewer option={viewState} data={data} error={error} isLoading={isLoading} />
    </div>
  )
}