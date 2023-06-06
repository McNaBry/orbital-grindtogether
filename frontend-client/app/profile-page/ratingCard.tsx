import React, {useState} from "react"
import "./profilepage.css";
import fullStarIcon from "/images/star-full-icon.png"
import halfStarIcon from "/images/star-half-icon.png"
import emptyStarIcon from "/images/star-empty-icon.png"

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
            if (rating >= i + 1) {
              stars.push(<img className="star-icon" src={fullStarIcon} alt="Full Star" />);
            } else if (rating >= i + 0.5) {
              stars.push(<img className="star-icon" src={halfStarIcon} alt="Half Star" />);
            } else {
              stars.push(<img className="star-icon" src={emptyStarIcon} alt="Empty Star" />);
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
                {getStars(rating)}
                </div>
            </div>
          </div>
        </div>
      );
}

export default RatingCard;