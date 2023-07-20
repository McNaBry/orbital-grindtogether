"use client"

import Image from "next/image"
import { Rating, RoundedStar } from '@smastrom/react-rating'
import profileStyles from "./profile-page.module.css";

const fullStarIcon = "/images/star-full-icon.png"
const halfStarIcon = "/images/star-half-icon.png"
const emptyStarIcon = "/images/star-empty-icon.png"

const myStyles = {
  itemShapes: RoundedStar,
  activeFillColor: ['#e7040f', '#ff6300', '#f1c40f', '#61bb00', '#19a974'],
  inactiveFillColor: '#ecf0f1'
  // activeStrokeColor: "#FFFFFF"
}

function RatingCard({ rating, raterCount } : { rating: number, raterCount: number }) {
    // const getStars = (rating: number) => {
    //   const stars = []

    //   const makeStar = (key:number, src:string, alt:string) => 
    //     <Image key={key} width={25} height={25} 
    //       className="star-icon" src={src} alt={alt} />
      
    //   for (let i = 0; i < 5; i += 1) {      
    //     if (rating >= i + 1) {
    //         stars.push(makeStar(i, fullStarIcon, "Full Star"))
    //       } else if (rating >= i + 0.5) {
    //         stars.push(makeStar(i, halfStarIcon, "Half Star"))
    //       } else {
    //         stars.push(makeStar(i, emptyStarIcon, "Empty Star"))
    //       }
    //   }
    //   return stars;
    // }

    return (
      <div className={profileStyles["profile-field"]}>
          <h4> Rating </h4>
          <p style={{marginBottom: "0.4rem"}}> 
          { rating < 0
            ? "No Ratings Found"
            : `${rating}/5 (${raterCount} ${raterCount > 1 ? "ratings" : "rating"})`
          }
          </p>
          <div className={profileStyles["stars-container"]}>
          <Rating 
            readOnly
            style={{ maxWidth: 120 }} 
            value={rating} 
            itemStyles={myStyles}
            transition='colors' 
          />
          </div>
      </div>
    );
}

export default RatingCard;