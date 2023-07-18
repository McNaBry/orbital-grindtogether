"use client"

import { MouseEventHandler, useEffect, useState } from "react"
import profileStyles from "../../profile-page/profile-page.module.css"
import viewProfileStyles from "./view-profile.module.css"
import { Button, Placeholder } from "react-bootstrap"
import { useRouter } from "next/navigation"

type ViewProfileProps = {
  params: { id: string }
  searchParams: any
}

function NoProfilePic() {
  return <div id={profileStyles["no-profile-pic"]}></div>
}

function ProfilePic({ profilePic }: { profilePic: string }) {
  return (
    <>
      {profilePic ? (
        <div id={profileStyles["profile-pic"]}>
          <img src={profilePic} />
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

function Rating({ isLoading, rating }: { isLoading: boolean; rating: number }) {
  return (
    <>
      {isLoading ? (
        <Placeholder animation="glow">
          <Placeholder xs={12} />
        </Placeholder>
      ) : (
        <p id={viewProfileStyles["rating-field"]}>Rating: {rating}/5</p>
      )}
    </>
  )
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
  })
  const [profilePic, setProfilePic] = useState("")

  function ReturnToInterestedUserList({}) {
    const router = useRouter()
    // const listingUID = router.query.listingUID

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      router.back()
    }

    return <Button variant="dark" onClick={handleClick}> Go Back </Button>
  }

  // UseEffect hook to fetch profile data based on Firestore UID stored on local storage
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
          console.log(data)
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
        <Rating isLoading={isLoading} rating={fields.rating} />
        <div id={viewProfileStyles["view-profile-button-container"]}>
          <ReturnToInterestedUserList />
          <Button style={{marginLeft: "10px"}} variant="danger">Report User</Button>
        </div>
      </div>
    </div>
  )
}
