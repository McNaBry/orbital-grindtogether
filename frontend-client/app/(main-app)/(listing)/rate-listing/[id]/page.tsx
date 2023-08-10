"use client"

import rateStyles from "./rate-listing.module.css"
import RatingBar from "./ratingBar"
import Notif from "../../../notif"
import { useState } from "react"
import { Button } from "react-bootstrap"
import { useRouter, useSearchParams } from "next/navigation"

function Disclaimer() {
  return (
    <div id={rateStyles["disclaimer-container"]}>
      <p id={rateStyles["disclaimer"]}>
        1. Your rating will be counted only if you have liked the current listing.
        <br/><br/>
        2. If the listing has more than one session, do come back to this page to rate this particular 
        user again.
        <br/><br/>
        3. We will only take into consideration your latest rating.
      </p>
    </div>
  )
}

export default function RateListing({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: any
}) {
  const urlParams = useSearchParams()
  const router = useRouter()
  const [msg, setMsg] = useState("")
  const [success, setSuccess] = useState(false)
  return (
    <div id={rateStyles["rate-listing-container"]}>
      <h1 style={{ color: "white", textAlign: "center" }}>Rate Listing</h1>
      <Disclaimer />
      <RatingBar
        listingID={params.id}
        creatorID={urlParams.get("creatorID") || ""}
        setMsg={(msg: string) => setMsg(msg)}
        setSuccess={(success: boolean) => setSuccess(success)}
      />
      <Notif
        msg={msg}
        success={success}
        setMsg={(msg: string) => setMsg(msg)}
      />
    </div>
  )
}
