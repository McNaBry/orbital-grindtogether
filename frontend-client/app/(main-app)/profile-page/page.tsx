"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"
import Image from "next/image"
import Form from "react-bootstrap/Form"
import NonEditableCard from "./nonEditableCard"
import EditableCard from "./editableCard"
import RatingCard from "./ratingCard"
import SignOutButton from "./signOutButton"
import UploadProfilePic from "./uploadProfilePic"
import NotifFilters from "./notifFilters"
import "./profile-page.css"
import { Placeholder, Row } from "react-bootstrap"
import RemoveProfilePic from "./removeProfilePic"

const deleteAccountIcon = "/images/delete-account.png"

function EditProfileTitle() {
  return <h1 style={{ color: "white" }}> Profile Page </h1>
}

function NoProfilePic() {
  return <div className="no-profile-pic"></div>
}

function ProfilePic({ profilePic }: { profilePic: string }) {
  return (
    <>
      { profilePic 
        ? <div className="profile-pic">
            <img src={profilePic} />
          </div>
        : <NoProfilePic />
      }
    </>
  )
}

function NameEmail({ isLoading, name, email } : { isLoading: boolean, name: string, email: string }) {
  return (
    <div id="name-email-container">
      <p id="name-field">{name}</p>
      <p id="email-field">{email}</p>
    </div>
  )
}

// function NameCard({ isLoading, name }: { isLoading: boolean, name: string }) {
//   return (
//     <NonEditableCard isLoading={isLoading} title="Full Name">
//       <p className="card-text"> {name} </p>
//     </NonEditableCard>
//   )
// }

// function EmailCard({ isLoading, email }: { isLoading: boolean, email: string }) {
//   return (
//     <NonEditableCard isLoading={isLoading} title="Email">
//       <p className="card-text"> {email} </p>
//     </NonEditableCard>
//   )
// }

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
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-opt-in-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        optInStatus: !optInStatus
      }),
      credentials: "include"
    })

    setOptInStatus(!optInStatus)
  }

  const inOrOut = optInStatus ? "in" : "out"
  const switchText = `Opt ${inOrOut} to receive email notifications whenever a listing is created.`

  return (
    <Form id="opt-in-form">
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
  // const { name } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [fields, setFields] = useState({
    email: "",
    fullName: "",
    bio: "",
    year: 0,
    course: "",
    teleHandle: "@",
    rating: 0,
    notifFilters: [""],
    optInStatus: false
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
        setIsLoading(false)
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
    value: string | number | string[]
  }) => {
    // immediately update the state
    setFields((otherFields) => ({ ...otherFields, [fieldToUpdate]: value }))
    const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fieldToUpdate: fieldToUpdate,
        value: value,
      }),
      credentials: "include"
    })

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
      <EditProfileTitle />
      <ProfilePic profilePic={profilePic} />
      <div id="profile-pic-button-container">
        <UploadProfilePic profilePic={profilePic} onUpload={handleProfilePicUpload} />
        <RemoveProfilePic
          profilePic={profilePic}
          onRemove={handleProfilePicRemoval}
        />
      </div>
      {/* <NameCard isLoading={isLoading} name={fields.fullName} />
      <EmailCard isLoading={isLoading} email={fields.email} /> */}
      <NameEmail isLoading={isLoading} name={fields.fullName} email={fields.email} />
      
      <div id="profile-field-container">
      {/* <div className="profile-field">
        <h4 style={{marginRight: "15px"}}>Bio</h4>
        <p>{fields.bio}</p>
      </div>

      <div className="profile-field">
        <h4 style={{marginRight: "0px"}}>Course</h4>
        <p>{fields.course}</p>
      </div>

      <div className="profile-field">
        <h4 style={{marginRight: "0px"}}>Year</h4>
        <p>{fields.year}</p>
      </div>

      <div className="profile-field">
        <h4 style={{marginRight: "0px"}}>Tele</h4>
        <p>{fields.teleHandle}</p>
      </div>

      <NotifFilters 
        isLoading={isLoading}
        filters={fields.notifFilters}
        onSave={(value: string[]) =>
          handleFieldChange({ fieldToUpdate: "notifFilters", value })} 
        /> */ }
      
        <EditableCard
          isLoading={isLoading}
          field="Bio"
          value={fields.bio}
          maxChars={150}
          onSave={(value) => handleFieldChange({ fieldToUpdate: "bio", value })}
        />
        <EditableCard
          isLoading={isLoading}
          field="Year"
          value={fields.year}
          maxChars={1}
          onSave={(value) =>
            handleFieldChange({ fieldToUpdate: "year", value: Number(value) })
          }
        />
        <EditableCard
          isLoading={isLoading}
          field="Course"
          value={fields.course}
          maxChars={50}
          onSave={(value) =>
            handleFieldChange({ fieldToUpdate: "course", value })
          }
        />
        <EditableCard
          isLoading={isLoading}
          field="Telegram Handle"
          value={fields.teleHandle}
          maxChars={32}
          onSave={(value) =>
            handleFieldChange({ fieldToUpdate: "teleHandle", value })
          }
        />
        <RatingCard rating={fields.rating} />
        <NotifFilters 
          isLoading={isLoading}
          filters={fields.notifFilters}
          onSave={(value: string[]) =>
            handleFieldChange({ fieldToUpdate: "notifFilters", value })} 
        />
      </div>

      {isLoading 
        ? <></> 
        : <OptInForListings 
          optInStatus = {fields.optInStatus}
          setOptInStatus={(optInStatus: boolean) => setFields({
            ...fields,
            optInStatus: optInStatus
          })}/> 
      }
      <div className="button-container">
        {isLoading ? <Placeholder.Button variant="light" xs={2} style={{marginRight: "10px"}}/> 
          : <SignOutButton /> }
        {isLoading ? <Placeholder.Button variant="light" xs={2}/> 
          : <DeleteAccount 
              email={fields.email}
              router={router} />
        }
      </div>
    </div>
  )
}
