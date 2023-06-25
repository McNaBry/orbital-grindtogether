import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "./studyCard.module.css";
import classnames from "classnames"

function LikeButton() {
  const [likeStatus, setLikeStatus] = useState(false);

  const handleLikeStatus = () => {
    setLikeStatus(!likeStatus);
  };

  const likeClass = classnames(
    styles["like-button"],
    likeStatus ? styles["like-active"] : ""
  )

  return (
    <button 
      className={likeClass} 
      onClick={handleLikeStatus}>
      <FontAwesomeIcon icon={faHeart} />
      <p className={styles["like-button-text"]}>{likeStatus ? "Liked" : "Like"}</p>
    </button>
  );
}

export default LikeButton;