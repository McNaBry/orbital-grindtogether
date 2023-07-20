"use client"

import rateStyles from "./rate-listing.module.css"
import RatingBar from './ratingBar'
import Notif from "../../../notif"
import { useState } from "react"

function Disclaimer() {
  return (
    <p id={rateStyles["disclaimer"]}>
      Note that your rating will be counted only if you have liked the listing.
    </p>
  )
}

export default function RateListing({ params, searchParams } : { params : {id: string}, searchParams: any }) {  
  const urlParams = new URLSearchParams(searchParams)
  const [ msg, setMsg ] = useState("")
  const [ success, setSuccess ] = useState(false)
  return (
    <div id={rateStyles["rate-listing-container"]}>
      <h1 style={{color: "white", textAlign: "center"}}>Rate Listing</h1>
      <Disclaimer />
      <RatingBar 
        listingID={params.id} 
        creatorID={urlParams.get("creatorID") || ""} 
        setMsg={(msg: string) => setMsg(msg)}
        setSuccess={(success: boolean) => setSuccess(success)}
      />
      <Notif msg={msg} success={success} setMsg={(msg: string) => setMsg(msg)} />
    </div>
  )
}