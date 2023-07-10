"use client"

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Spinner, Button } from "react-bootstrap" 
import { StudyListing } from "./studyCard"
import { mutate } from "swr"
import cardStyles from "./studyCard.module.css";
import classnames from "classnames"

function LoadingLikeButton({ likeStatus } : { likeStatus: boolean }) {
  return (
    <Button variant="danger" disabled>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        <span style={{marginLeft: "5px"}}>{!likeStatus ? "Liking..." : "Unliking..."}</span>
    </Button>
  )
}

function LikeButton({ listingData } : { listingData: StudyListing }) {
  const [likeStatus, setLikeStatus] = useState(listingData.liked);
  const [loading, setLoading] = useState(false)

  const handleLikeStatus = async () => {
    setLoading(true)
    const likeListingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/like-listing`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: window.localStorage.getItem("uid"),
        listingUID: listingData.id,
        action: !listingData.liked ? "like" : "unlike"
      })
    })
    if (likeListingRes.status == 200) {
      console.log("Like/Liked success")
      await mutate(`${process.env.NEXT_PUBLIC_API_URL}/get-listings`, (prevData: any) => {
        const index = prevData.findIndex((item: any) => item.id == listingData.id)
        const updatedData = prevData;
        updatedData[index] = {
          ...updatedData[index],
          liked: !likeStatus
        }

        return updatedData
      })
      setLikeStatus(!likeStatus)
      setLoading(false)
    } else {
      console.log("Like/Liked failed")
      setLoading(false)
    }
  };

  const likeClass = classnames(
    cardStyles["like-button"],
    likeStatus ? cardStyles["like-active"] : ""
  )

  return (
    <>
    { loading
      ? <LoadingLikeButton likeStatus={likeStatus} />
      : <button 
          className={likeClass} 
          onClick={handleLikeStatus}>
          <FontAwesomeIcon icon={faHeart} />
          <p className={cardStyles["like-button-text"]}>{likeStatus ? "Liked" : "Like"}</p>
        </button>
    }
    </>
  );
}

export default LikeButton;