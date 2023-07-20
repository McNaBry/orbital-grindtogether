"use client"

import { Rating, RatingChange, RoundedStar } from '@smastrom/react-rating'
import rateStyles from "./rate-listing.module.css"
import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from 'react-bootstrap'

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

export default function RatingBar() {
  const [rating, setRating] = useState({
    friendly: 0,
    helpful: 0,
    recommend: 0
  })

  const overallRating = () => 
    Math.round(
      ((rating.friendly + rating.helpful + rating.recommend) / 3) / 0.5
    ) * 0.5

  return (
    <div id={rateStyles["rating-bar"]}>
      <p 
        id={rateStyles["overall-rating"]}
        style={{
          background: myStyles.activeFillColor[
            Math.round(Math.max(0, overallRating() - 1))
          ]
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
      <Button style={{marginTop: "25px"}} variant="success">Submit Rating</Button>
    </div>
  )
}