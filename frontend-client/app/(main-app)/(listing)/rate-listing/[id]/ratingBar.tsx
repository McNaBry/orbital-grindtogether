"use client"

import { Rating, RoundedStar } from '@smastrom/react-rating'
import { FormEvent, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import rateStyles from "./rate-listing.module.css"

const myStyles = {
  itemShapes: RoundedStar,
  activeFillColor: ['#e7040f', '#ff6300', '#f1c40f', '#61bb00', '#19a974'],
  inactiveFillColor: '#ecf0f1'
  // activeStrokeColor: "#FFFFFF"
}

type RatingSubBarProps = {
  desc: string,
  value: number,
  onChange: (value: number) => void
}

function RatingSubBar({ desc, value, onChange } : RatingSubBarProps) {
  return (
    <div className={rateStyles["rating-sub-bar"]}>
      <div style={{color: "white"}}>{desc}</div>
      <Rating 
        style={{ maxWidth: 250 }} 
        value={value} 
        onChange={onChange} 
        itemStyles={myStyles}
        transition='colors' />
    </div>
  )
}

export default function RatingBar(
  { listingID, 
    creatorID, 
    setMsg, 
    setSuccess 
  } : {
    listingID: string, 
    creatorID: string,
    setMsg: (msg: string) => void,
    setSuccess: (success: boolean) => void
  }) {

  const [rating, setRating] = useState({
    friendly: 0,
    helpful: 0,
    recommend: 0
  })

  const overallRating = () => 
    Math.round(
      ((rating.friendly + rating.helpful + rating.recommend) / 3) / 0.5
    ) * 0.5
  
  useEffect(() => {
    async function fetchRatings() {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-rating`, {
        method: "POST",
        credentials: "include"
      }).then(async (payload) => {
        const json = await payload.json()
        console.log(json)
        setRating(json)
      }).catch(error => console.log(error))
    }
    fetchRatings()
  }, [])
  
  const handleSubmitRating = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (creatorID == "" || creatorID == undefined || listingID == "" || listingID == undefined) {
      console.log("Cannot find listingID or creatorID")
      return
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-rating`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...rating,
          creatorID: creatorID,
          listingID: listingID,
          overall: overallRating()
        }),
        credentials: "include"
      })
      if (res.status == 200) {
        setMsg("Rating submission successful")
        setSuccess(true)
      } else {
        setMsg("Rating submission failed")
        setSuccess(false)
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmitRating} id={rateStyles["rating-bar"]}>
      <p 
        id={rateStyles["overall-rating"]}
        style={{
          background: myStyles.activeFillColor[
            Math.round(Math.max(0, overallRating() - 1))
          ] // Change colour based on rating
        }}
      >  
        Overall Rating: { overallRating() }/5</p>
      <RatingSubBar 
        desc="Rate how friendly the group/date was:"
        value={rating.friendly}
        onChange={(value: number) => 
          setRating(prevRating => ({...prevRating, friendly: value})
        )}
      />
      <RatingSubBar 
        desc="Rate how friendly the group/date was:"
        value={rating.helpful}
        onChange={(value: number) => 
          setRating(prevRating => ({...prevRating, helpful: value})
        )}
      />
      <RatingSubBar 
        desc="Would you recommend this study group/date to your friends?"
        value={rating.recommend}
        onChange={(value: number) => 
          setRating(prevRating => ({...prevRating, recommend: value})
        )}
      />
      <Button type="submit" style={{marginTop: "25px"}} variant="success">Submit Rating</Button>
    </form>
  )
}