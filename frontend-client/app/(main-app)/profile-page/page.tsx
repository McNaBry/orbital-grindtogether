"use client"

import { useState, useEffect, ChangeEvent } from "react"
import "./profilepage.css"
import "./nonEditableCard"
import NonEditableCard from "./nonEditableCard"
import EditableCard from "./editableCard"
import RatingCard from "./ratingCard"
import SignOutButton from "./signOutButton"
import UploadProfilePic from "./uploadProfilePic"
import RemoveProfilePic from "./removeProfilePic"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Form } from "react-bootstrap"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

const deleteAccountIcon = "/images/delete-account.png"

function EditProfile() {
  return <h1 style={{ color: "white" }}> Profile Page </h1>
}

function NoProfilePic() {
  return <div className="no-profile-pic"></div>
}

function ProfilePic({ profilePic }: { profilePic: string }) {
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

// optInStatus is part of the profile fields variable
// setOptInStatus is a method to handle the change in optInStatus
function OptInForListings({
  optInStatus,
  setOptInStatus,
}: {
  optInStatus: boolean
  setOptInStatus: (optInStatus: boolean) => void
}) {
  // Everytime user clicks it will update the server
  const handleClick = async (event: ChangeEvent<HTMLInputElement>) => {
    await fetch("http://localhost:5000/update-opt-in-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: window.localStorage.getItem("uid"),
        optInStatus: !optInStatus,
      }),
    })

    setOptInStatus(!optInStatus)
  }

  const inOrOut = optInStatus ? "in" : "out"
  const switchText = `Opt ${inOrOut} to receive email notifications whenever a listing is created.`

  return (
    <Form>
      <Form.Check
        type="switch"
        id="custom-switch"
        label={switchText}
        checked={optInStatus}
        onChange={handleClick}
        className="opt-in-switch"
      />
    </Form>
  )
}

// This button is different from the one in delete-account; it just redirects to the page
function DeleteAccount({
  email,
  router,
}: {
  email: string
  router: AppRouterInstance
}) {
  const onClick = () => {
    router.push(`/delete-account?email=${email}`)
  }

  return (
    <button id="profile-delete-account" className="btn mb-3" onClick={onClick}>
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

export default function ProfilePage() {
  const router = useRouter()

  const [fields, setFields] = useState({
    email: "",
    fullName: "",
    bio: "",
    year: 0,
    course: "",
    telegramHandle: "@",
    rating: 0,
    optInStatus: false,
  })
  const [profilePic, setProfilePic] = useState("")

  // UseEffect hook to fetch profile data based on Firestore UID stored on local storage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/get-profile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        )
        let data = await response.json()
        console.log(data)
        setFields(data)
        setProfilePic(data.profilePic || "")
      } catch (error) {
        console.log("User not found.")
      }
    }

    fetchData()
  }, [])

  // Function to handle change on the Editable Card.
  // Triggered by save changes button.
  const handleFieldChange = async ({
    fieldToUpdate,
    value,
  }: {
    fieldToUpdate: string
    value: string | number
  }) => {
    // immediately update the state
    setFields((otherFields) => ({ ...otherFields, [fieldToUpdate]: value }))

    const updatedProfileData = { [fieldToUpdate]: value }

    const uploadRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/update-profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldToUpdate: fieldToUpdate,
          value: value,
        }),
        credentials: "include",
      }
    )

    if (uploadRes.status == 200) {
      console.log("Update successful")
    }
  }

  const handleProfilePicUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // check if the file does exist; if it does then take the first file
    const file = event.target.files && event.target.files[0]

    if (file) {
      const generatedURL = URL.createObjectURL(file)
      setProfilePic(generatedURL)
      console.log(generatedURL)

      const formData = new FormData()
      formData.append("profilePic", file)

      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-profile-pic`, {
          method: "POST",
          body: formData,
          credentials: "include"
        })
        console.log("profile picture uploaded?")
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleProfilePicRemoval = async () => {
    try {
      // create an empty file to send to server
      const emptyFile = new File([], "empty.png", { type: "image/png" })
      const formData = new FormData()
      formData.append("profilePic", emptyFile)

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-profile-pic`, {
        method: "POST",
        body: formData,
        credentials: "include"
      })
      console.log("Profile picture removed on the server.")
    } catch (error) {
      console.log("Error removing profile picture from the server", error)
    }

    setProfilePic("")
  }

  return (
    <div className="profile-page-container">
      <EditProfile />
      <ProfilePic profilePic={profilePic} />
      <div className="profile-pic-button-container">
        <UploadProfilePic onUpload={handleProfilePicUpload} />
        <RemoveProfilePic
          profilePic={profilePic}
          onRemove={handleProfilePicRemoval}
        />
      </div>
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
      <div className="button-container">
        <SignOutButton />
        <DeleteAccount email={fields.email} router={router} />
      </div>
    </div>
  )
}
