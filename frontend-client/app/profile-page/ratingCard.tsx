import React, {useState} from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";

interface RatingProp {
    rating: Number;
}

function RatingCard({rating} : RatingProp) {
    const [currentRating, setRating] = useState(0);

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    }

    const getStars = (rating: number) => {
        const stars = []
        
        for (let i = 0; i < 5; i += 1) {
            if (rating > i + 1) {
                stars.push(<FontAwesomeIcon className= "full-star-icon" icon={faStar}/>)
            } else if (rating >= i + 0.5) {
                stars.push(<FontAwesomeIcon className= "half-star-icon" icon={faStarHalfAlt}/>)
            } else {
                stars.push(<FontAwesomeIcon className= "empty-star-icon" icon={faStar} opacity = {0.25}/>)
            }
        }
        return stars;
    }

    return (
        <div className="col-sm-6 non-editable-card">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title"> Rating </h5>
              <p> {rating} / 5 </p>
              <div className = "stars-container">
                {getStars(currentRating)}
                </div>
            </div>
          </div>
        </div>
      );
}

export default RatingCard;