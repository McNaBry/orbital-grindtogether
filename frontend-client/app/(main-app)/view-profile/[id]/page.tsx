"use client"

import { useEffect, useState } from "react"
import { Rating, RoundedStar } from '@smastrom/react-rating'
import profileStyles from "../../profile-page/profile-page.module.css"
import viewProfileStyles from "./view-profile.module.css"
import { Button, Placeholder } from "react-bootstrap"
import { useRouter, useSearchParams } from "next/navigation"

const myStyles = {
  itemShapes: RoundedStar,
  activeFillColor: ['#e7040f', '#ff6300', '#f1c40f', '#61bb00', '#19a974'],
  inactiveFillColor: '#ecf0f1'
  // activeStrokeColor: "#FFFFFF"
}

function NoProfilePic() {
  return <div id={profileStyles["no-profile-pic"]}></div>
}

function ProfilePic({ profilePic }: { profilePic: string }) {
  return (
    <>
      {profilePic ? (
        <div id={profileStyles["profile-pic"]}>
          <img style={{width: "250px", height: "250px"}} alt="" src={profilePic} />
        </div>
      ) : (
        <NoProfilePic />
      )}
    </>
  )
}

function NameTele({
  isLoading,
  name,
  teleHandle,
}: {
  isLoading: boolean
  name: string
  teleHandle: string
}) {
  return (
    <div id={viewProfileStyles["name-email-container"]}>
      {isLoading ? (
        <Placeholder animation="glow">
          <Placeholder xs={12} />
        </Placeholder>
      ) : (
        <div id={viewProfileStyles["name-tele-container"]}>
          <p id={viewProfileStyles["name-field"]}>{name}</p>
          <p
            style={{ marginBottom: "0px" }}
            id={viewProfileStyles["tele-field"]}
          >
            {teleHandle}
          </p>
        </div>
      )}
    </div>
  )
}

function StudentDetails({
  isLoading,
  course,
  year,
}: {
  isLoading: boolean
  course: string
  year: number
}) {
  return (
    <>
      {isLoading ? (
        <Placeholder animation="glow">
          <Placeholder xs={12} />
        </Placeholder>
      ) : (
        <p id={viewProfileStyles["student-details"]}>
          Y{year} {course} student.
        </p>
      )}
    </>
  )
}

function Bio({ isLoading, bio }: { isLoading: boolean; bio: string }) {
  return (
    <>
      {isLoading ? (
        <Placeholder animation="glow">
          <Placeholder xs={12} />
        </Placeholder>
      ) : (
        <p id={viewProfileStyles["bio-field"]}>{bio}</p>
      )}
    </>
  )
}

function RatingField({ isLoading, rating, raterCount }: { isLoading: boolean, rating: number, raterCount: number }) {
  return (
    <>
      {isLoading ? (
        <Placeholder animation="glow">
          <Placeholder xs={12} />
        </Placeholder>
      ) : (
        <>
          <p style={{marginBottom: "0.4rem"}} id={viewProfileStyles["rating-field"]}> 
            { rating < 0
              ? "No Ratings Found"
              : `Rating: ${rating}/5 (${raterCount} ${raterCount > 1 ? "ratings" : "rating"})`
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
        </>
      )}
    </>
  )
}

function ReturnToInterestedUserList() {
  const router = useRouter()
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    router.back()
  }
  return <Button variant="dark" onClick={handleClick}> Go Back </Button>
}

function ReportUser({ name, userID, listingUID } : { name: string, userID: string, listingUID: string }) {
  const router = useRouter()
  return (
    <Button 
      style={{marginLeft: "10px"}} 
      variant="danger"
      onClick={() => router.push(`/report-user?name=${name}&userID=${userID}&listingUID=${listingUID}`)}
    >
      Report User
    </Button>
  )
}

type ViewProfileProps = {
  params: { id: string }
  searchParams: any
}

export default function ViewProfile({
  params,
  searchParams,
}: ViewProfileProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [fields, setFields] = useState({
    fullName: "",
    bio: "",
    year: 0,
    course: "",
    teleHandle: "@",
    rating: 0,
    numOfRaters: 0
  })
  const [profilePic, setProfilePic] = useState("")
  const urlParams = useSearchParams()

  // UseEffect hook to fetch profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = params.id
        if (!uid || uid == undefined) return
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/view-profile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: uid }),
            credentials: "include",
          }
        )

        if (response.status == 200) {
          const data = await response.json()
          setFields(data)
          setProfilePic(data.profilePic || "")
          setIsLoading(false)
        } else {
          console.log("Profile fetch error")
        }
      } catch (error) {
        console.log("User not found.")
      }
    }

    fetchData()
  }, [])

  return (
    <div id={viewProfileStyles["view-profile-container"]}>
      <ProfilePic profilePic={profilePic} />
      <NameTele
        isLoading={isLoading}
        name={fields.fullName}
        teleHandle={fields.teleHandle}
      />
      <div id={viewProfileStyles["sub-details-container"]}>
        <StudentDetails
          isLoading={isLoading}
          course={fields.course}
          year={fields.year}
        />
        <Bio isLoading={isLoading} bio={fields.bio} />
        <RatingField isLoading={isLoading} rating={fields.rating} raterCount={fields.numOfRaters} />
        <div id={viewProfileStyles["view-profile-button-container"]}>
          <ReturnToInterestedUserList />
          <ReportUser 
            name={fields.fullName}
            userID={params.id} 
            listingUID={urlParams.get("listingUID") || ""} 
          />
        </div>
      </div>
    </div>
  )
}
