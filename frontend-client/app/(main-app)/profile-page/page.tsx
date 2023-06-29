"use client"

import { useState, useEffect, ChangeEvent } from "react"
import "./profilepage.css"
import "./nonEditableCard"
import NonEditableCard from "./nonEditableCard"
import EditableCard from "./editableCard"
import RatingCard from "./ratingCard"
import SignOutButton from "./signOutButton"
import UploadProfilePic from "./uploadProfilePic"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "../../authProvider"
import { profile } from "console"

const deleteAccountIcon = "/images/delete-account.png"

function EditProfile() {
  return <h1 style={{ color: "white" }}> Profile Page </h1>
}

function NoProfilePic() {
  return <div className="no-profile-pic"></div>
}

function ProfilePic({ profilePic }) {
  return (
    <div className="profile-pic">
      {profilePic ? <img src={profilePic}></img> : <NoProfilePic />}
    </div>
  )
}

function NameCard({ name }: { name: string }) {
  return (
    <NonEditableCard title="Full Name">
      <p className="card-text"> {name} </p>
    </NonEditableCard>
  )
}
function EmailCard({ email }: { email: string }) {
  return (
    <NonEditableCard title="Email">
      <p className="card-text"> {email} </p>
    </NonEditableCard>
  )
}

function ProfilePage() {
  const auth = useAuth()
  const [fields, setFields] = useState({
    email: "",
    fullName: "",
    bio: "",
    year: 0,
    course: "",
    telegramHandle: "@",
    rating: 0,
  })
  const [profilePic, setProfilePic] = useState("")

  // UseEffect hook to fetch profile data based on Firestore UID stored on local storage
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(auth.user.uid)
        const response = await fetch("http://localhost:5000/get-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: window.localStorage.getItem("uid") }),
        })
        const data = await response.json()
        setFields(data)

        setProfilePic(data.profilePic)

        // // Fetch the profile page picture separately
        // const profilePicResponse = await fetch(
        //   "http://localhost:5000/get-profile-pic",
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ uid: window.localStorage.getItem("uid") }),
        //   }
        // )

        // // server sends the URL of the profile picture if it does exist
        // const profileData = await profilePicResponse.json()
        // setProfilePic(profileData.profilePic || "")
      } catch (error) {
        console.log("user not found")
      }
    }

    fetchData()
  }, [])

  // this button is different from the one in delete-account; it just redirects to the page
  function DeleteAccount() {
    const router = useRouter()
    const onClick = () => {
      router.push(`/delete-account?email=${fields.email}`)
    }

    return (
      <button id="profile-delete-account" onClick={onClick}>
        <Image
          width={20}
          height={20}
          src={deleteAccountIcon}
          style={{ marginRight: "5px" }}
          alt="Delete Account"
        />
        Delete Account
      </button>
    )
  }

  // Function to handle change on the Editable Card.
  // Triggered by save changes button.
  const handleFieldChange = ({
    fieldToUpdate,
    value,
  }: {
    fieldToUpdate: string
    value: string | number
  }) => {
    // immediately update the state
    setFields((otherFields) => ({ ...otherFields, [fieldToUpdate]: value }))

    const updatedProfileData = { [fieldToUpdate]: value }

    fetch("http://localhost:5000/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: window.localStorage.getItem("uid"),
        fieldToUpdate: fieldToUpdate,
        value: value,
      }),
    })
  }

  const handleProfilePicUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // check if the file does exist; if it does then take the first file
    const file = event.target.files && event.target.files[0]
    const userId = auth.user.uid

    if (file) {
      const generatedURL = URL.createObjectURL(file)
      setProfilePic(generatedURL)

      const formData = new FormData()
      formData.append("uid", userId)
      formData.append("profilePic", file)

      try {
        await fetch("/upload-profile-pic", {
          method: "POST",
          body: formData,
        })
        console.log("profile picture uploaded?")
      } catch (error) {
        console.log("welp didnt work out mate")
      }
    }
  }

  return (
    <div className="profile-page-container">
      <EditProfile />
      <ProfilePic profilePic={profilePic} />
      <UploadProfilePic onUpload={handleProfilePicUpload} />
      <NameCard name={fields.fullName} />
      <EmailCard email={fields.email} />
      <EditableCard
        field="Bio"
        value={fields.bio}
        maxChars={150}
        onSave={(value) => handleFieldChange({ fieldToUpdate: "bio", value })}
      />
      <EditableCard
        field="Year"
        value={fields.year}
        maxChars={1}
        onSave={(value) =>
          handleFieldChange({ fieldToUpdate: "year", value: Number(value) })
        }
      />
      <EditableCard
        field="Course"
        value={fields.course}
        maxChars={50}
        onSave={(value) =>
          handleFieldChange({ fieldToUpdate: "course", value })
        }
      />
      <EditableCard
        field="Telegram Handle"
        value={fields.telegramHandle}
        maxChars={32}
        onSave={(value) =>
          handleFieldChange({ fieldToUpdate: "telegramHandle", value })
        }
      />
      <RatingCard rating={fields.rating} />
      <div className="button-containers">
        <SignOutButton />
        <DeleteAccount />
      </div>
    </div>
  )
}

export default ProfilePage
