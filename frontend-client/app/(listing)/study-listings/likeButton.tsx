import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./likeButton.css";

function LikeButton() {
  const [likeStatus, setLikeStatus] = useState(false);

  const handleLikeStatus = () => {
    setLikeStatus(!likeStatus);
  };

  return (
    <button className={`like-button ${likeStatus ? "active" : ""}`} onClick={handleLikeStatus}>
      <FontAwesomeIcon icon={faHeart} className="heart-icon" />
    </button>
  );
}

export default LikeButton;