import cardStyles from "./studyCard.module.css";
import { Spinner } from "react-bootstrap"

function LoadingLikeButton({ likeStatus } : { likeStatus: boolean }) {
  return (
    <button className = {cardStyles["loading-like-button"]}>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        <span style={{marginLeft: "5px"}}>{!likeStatus ? "Liking..." : "Unliking..."}</span>
    </button>
  )
}

export default LoadingLikeButton