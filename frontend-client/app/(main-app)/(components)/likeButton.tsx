"use client"

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { StudyListing } from "./studyCard"
import { mutate } from "swr"
import LoadingLikeButton from "../(listing)/loadingLikeButton";
import cardStyles from "../(components)/studyCard.module.css";
import classnames from "classnames"

function LikeButton({ listingData, variant } : { listingData: StudyListing, variant: string }) {
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
        listingUID: listingData.id,
        action: !listingData.liked ? "like" : "unlike"
      }),
      credentials: "include"
    })
    if (likeListingRes.status == 200) {
      console.log("Like/Liked success")
      // Change swr mutate key depending on which API endpoint the data is fetched from
      if (variant == "display") {
        await mutate(`${process.env.NEXT_PUBLIC_API_URL}/get-listings`, (prevData: any) => {
          const index = prevData.findIndex((item: any) => item.id == listingData.id)
          const updatedData = prevData;
          updatedData[index] = {
            ...updatedData[index],
            liked: !likeStatus
          }
  
          return updatedData
        })
      } else if (variant == "dashboard-display") {
        await mutate(`${process.env.NEXT_PUBLIC_API_URL}/get-dashboard-listings`, (prevData: any) => {
          const index = prevData[0].findIndex((item: any) => item.id == listingData.id)
          const updatedData = prevData;
          updatedData[0][index] = {
            ...updatedData[0][index],
            liked: !likeStatus
          }
  
          return updatedData
        })
      }
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