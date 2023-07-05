"use client"

import { Suspense, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Spinner, Button } from "react-bootstrap" 
import cardStyles from "./studyCard.module.css";
import classnames from "classnames"

function LoadingLikeButton({ likeStatus } : { likeStatus: boolean }) {
  return (
    <Button className = {cardStyles["loading-like-button"]} variant="danger" disabled>
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

function LikeButton({ listingUID } : { listingUID: string}) {
  const [likeStatus, setLikeStatus] = useState(false);
  const [loading, setLoading] = useState(false)

  const handleLikeStatus = async () => {
    setLoading(true)
    const likeListingRes = await fetch("http://localhost:5000/like-listing", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: window.localStorage.getItem("uid"),
        listingUID: listingUID,
        action: !likeStatus ? "like" : "unlike"
      })
    })
    if (likeListingRes.status == 200) {
      console.log("Like/Liked success")
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