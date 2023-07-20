"use client"

import { Rating, RoundedStar } from "@smastrom/react-rating"
import { FormEvent, useEffect, useState } from "react"
import { Button, Spinner } from "react-bootstrap"
import rateStyles from "./rate-listing.module.css"
import { useRouter } from "next/navigation"

const myStyles = {
  itemShapes: RoundedStar,
  activeFillColor: ["#e7040f", "#ff6300", "#f1c40f", "#61bb00", "#19a974"],
  inactiveFillColor: "#ecf0f1",
  // activeStrokeColor: "#FFFFFF"
}

type RatingSubBarProps = {
  desc: string
  value: number
  onChange: (value: number) => void
}

function RatingSubBar({ desc, value, onChange }: RatingSubBarProps) {
  return (
    <div className={rateStyles["rating-sub-bar"]}>
      <div style={{ color: "white" }}>{desc}</div>
      <Rating
        style={{ maxWidth: 250 }}
        value={value}
        onChange={onChange}
        itemStyles={myStyles}
        transition="colors"
      />
    </div>
  )
}

type RatingBarProps = {
  listingID: string
  creatorID: string
  setMsg: (msg: string) => void
  setSuccess: (success: boolean) => void
}

export default function RatingBar({
  listingID, 
  creatorID,
  setMsg,
  setSuccess,
}: RatingBarProps) {
  
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [rating, setRating] = useState({
    friendly: 0,
    helpful: 0,
    recommend: 0,
  })

  const overallRating = () =>
    Math.round(
      (rating.friendly + rating.helpful + rating.recommend) / 3 / 0.5
    ) * 0.5

  useEffect(() => {
    async function fetchRatings() {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingID: listingID }),
        credentials: "include"
      })
        .then(async (payload) => {
          const json = await payload.json()
          console.log(json)
          setRating(json)
        })
        .catch((error) => console.log(error))
      setIsLoading(false)
    }
    fetchRatings()
  }, [])

  const handleSubmitRating = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (
      creatorID == "" ||
      creatorID == undefined ||
      listingID == "" ||
      listingID == undefined
    ) {
      console.log("Cannot find listingID or creatorID")
      return
    }
    try {
      setIsLoading(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/update-rating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...rating,
            creatorID: creatorID,
            listingID: listingID,
            overall: overallRating(),
          }),
          credentials: "include"
        }
      )
      if (res.status == 200) {
        setMsg("Rating was successfully submitted.")
        setSuccess(true)
      } else {
        setMsg("Rating was not successfully submitted.")
        setSuccess(false)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmitRating} id={rateStyles["rating-bar"]}>
      <p
        id={rateStyles["overall-rating"]}
        style={{
          background:
            myStyles.activeFillColor[
              Math.round(Math.max(0, overallRating() - 1))
            ], // Change colour based on rating
        }}
      >
        Overall Rating: {overallRating()}/5
      </p>
      <RatingSubBar
        desc="Rate how friendly the group/date was:"
        value={rating.friendly}
        onChange={(value: number) =>
          setRating((prevRating) => ({ ...prevRating, friendly: value }))
        }
      />
      <RatingSubBar
        desc="Rate how helpful the group/date was:"
        value={rating.helpful}
        onChange={(value: number) =>
          setRating((prevRating) => ({ ...prevRating, helpful: value }))
        }
      />
      <RatingSubBar
        desc="Would you recommend this study group/date to your friends?"
        value={rating.recommend}
        onChange={(value: number) =>
          setRating((prevRating) => ({ ...prevRating, recommend: value }))
        }
      />
      <div id={rateStyles["button-bar"]}>
        <Button style={{ marginRight: "10px" }} variant="dark" onClick={() => router.back()}>
          Back
        </Button>
        <Button disabled={isLoading} type="submit" variant="success">
          { isLoading 
            ? <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                /> 
                <span style={{marginLeft: "5px"}}>Please Wait</span> 
              </>
            : "Submit Rating"
          }
        </Button>
      </div>
    </form>
  )
}
