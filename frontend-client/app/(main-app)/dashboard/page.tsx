'use client'

import styles from './dashboard.module.css'

import { Container, Row } from 'react-bootstrap'
import useSWR from 'swr'
import StudyListings from '../(listing)/study-listings/studyListings'
import { StudyListing } from '../(listing)/studyCard'
import { useEffect, useState } from 'react'
import { useAuth } from "../../authProvider"
 
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
        ? <h6 style={{textAlign:"center"}}>Error.</h6>
        : isLoading
          ? <h6 style={{textAlign:"center"}}>Loading data...</h6>
          : data[0].length == 0
            ? <h6 style={{textAlign:"center"}}>No Listings Found.</h6>
            : <StudyListings page={-1} limit={0} filters={emptyFilters} data={data[0]} variant="display" />}
    </>
  )
}

function CreatedListings({ data, error, isLoading, emptyFilters } : ListingProps) {
  return (
    <>
      <h3 style={{textAlign:"center"}}>Your Created Listings</h3>
      { error 
        ? <h6 style={{textAlign:"center"}}>Error.</h6>
        : isLoading
          ? <h6 style={{textAlign:"center"}}>Loading data...</h6>
          : data[1].length == 0
            ? <h6 style={{textAlign:"center"}}>No Listings Found.</h6>
            :<StudyListings page={-1} limit={0} filters={emptyFilters} data={data[1]} variant="modify" />}
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
    <Container style={{marginTop:"20px"}}>
    { option === "liked"
      ? <LikedListings data={data} error={error} isLoading={isLoading} emptyFilters={emptyFilters} />
      : <CreatedListings data={data} error={error} isLoading={isLoading} emptyFilters={emptyFilters} />
    }
    </Container>
  )
}

export default function Dashboard() {
  const fetcher = async (url:string) => {
    const userID = window.localStorage.getItem("uid")
    if (userID == null || userID == "") return [[], []]
    return await fetch(url + `?userID=${userID}`, { method: "POST" }).then(res => res.json())
  }

  const { data, isLoading, error } = useSWR(`${process.env.API_URL}/get-dashboard-listings`, 
    fetcher,  {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    })
  
  const [viewState, setViewState] = useState<string>("liked")
  
  return (
    <Container id={styles["dashboard-container"]}>
      <h1 style={{textAlign:"center"}}>Dashboard</h1>
      <div id={styles["selector-container"]}>
        <button className={styles["selector"]} onClick={() => setViewState("liked")}>Liked</button>
        <button className={styles["selector"]} onClick={() => setViewState("created")}>Created</button>
      </div>
      <ListingViewer option={viewState} data={data} error={error} isLoading={isLoading} />
    </Container>
  )
}