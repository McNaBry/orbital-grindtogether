"use client"

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import cardStyles from "./studyCard.module.css";
import classnames from "classnames"

function LikeButton() {
  const [likeStatus, setLikeStatus] = useState(false);

  const handleLikeStatus = () => {
    setLikeStatus(!likeStatus);
  };

  const likeClass = classnames(
    cardStyles["like-button"],
    likeStatus ? cardStyles["like-active"] : ""
  )

  return (
    <button 
      className={likeClass} 
      onClick={handleLikeStatus}>
      <FontAwesomeIcon icon={faHeart} />
      <p className={cardStyles["like-button-text"]}>{likeStatus ? "Liked" : "Like"}</p>
    </button>
  );
}

export default LikeButton;