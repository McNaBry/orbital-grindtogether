import React, {useState} from "react"
import { Card } from "react-bootstrap"
import Image from "next/image"
import "./profile-page.css";

const fullStarIcon = "/images/star-full-icon.png"
const halfStarIcon = "/images/star-half-icon.png"
const emptyStarIcon = "/images/star-empty-icon.png"

function RatingCard({rating} : {rating: number}) {
    const [currentRating, setRating] = useState(0);

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    }

    const getStars = (rating: number) => {
      const stars = []

      const makeStar = (key:number, src:string, alt:string) => 
        <Image key={key} width={25} height={25} 
          className="star-icon" src={src} alt={alt} />
      
      for (let i = 0; i < 5; i += 1) {      
        if (rating >= i + 1) {
            stars.push(makeStar(i, fullStarIcon, "Full Star"))
          } else if (rating >= i + 0.5) {
            stars.push(makeStar(i, halfStarIcon, "Half Star"))
          } else {
            stars.push(makeStar(i, emptyStarIcon, "Empty Star"))
          }
      }
      return stars;
    }

    return (
      <div className="profile-field">
          <h4> Rating </h4>
          <p style={{marginBottom: "0.4rem"}}> {rating} / 5 </p>
          <div className="stars-container">
            {getStars(rating)}
          </div>
      </div>
    );
}

export default RatingCard;