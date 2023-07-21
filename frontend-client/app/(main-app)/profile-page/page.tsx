"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"
import Image from "next/image"
import Form from "react-bootstrap/Form"
import EditableCard from "./editableCard"
import RatingCard from "./ratingCard"
import SignOutButton from "./signOutButton"
import UploadProfilePic from "./uploadProfilePic"
import NotifFilters from "./notifFilters"
import RemoveProfilePic from "./removeProfilePic"
import { Placeholder } from "react-bootstrap"
import profileStyles from "./profile-page.module.css"

const deleteAccountIcon = "/images/delete-account.png"

function EditProfileTitle() {
  return <h1 style={{ color: "white" }}> Profile Page </h1>
}

function NoProfilePic() {
  return <div id={profileStyles["no-profile-pic"]}></div>
}

function ProfilePic({ profilePic }: { profilePic: string }) {
  return (
    <>
      { profilePic 
        ? <div id={profileStyles["profile-pic"]}>
            <img style={{width: "250px", height: "250px"}} alt="" src={profilePic} />
          </div>
        : <NoProfilePic />
      }
    </>
  )
}

function NameEmail({ isLoading, name, email } : { isLoading: boolean, name: string, email: string }) {
  return (
    <div id={profileStyles["name-email-container"]}>
      {isLoading 
        ? <>
            <Placeholder animation="glow"><Placeholder xs={12}/></Placeholder>
            <Placeholder animation="glow"><Placeholder xs={12}/></Placeholder>
          </>
        : <>
            <p id={profileStyles["name-field"]}>{name}</p>
            <p id={profileStyles["email-field"]}>{email}</p>
          </>
      }
    </div>
  )
}

// optInStatus is part of the profile fields variable
// setOptInStatus is a method to handle the change in optInStatus
function OptInForListings({
  optInStatus,
  setOptInStatus,
  handleOptInChange
}: {
  optInStatus: boolean
  setOptInStatus: (optInStatus: boolean) => void,
  handleOptInChange: (optInStatus: boolean) => void
}) {
  const inOrOut = optInStatus ? "in" : "out"
  const switchText = `Opt ${inOrOut} to receive email notifications whenever a listing is created.`

  return (
    <Form id={profileStyles["opt-in-form"]}>
      <Form.Check
        type="switch"
        id="custom-switch"
        label={switchText}
        checked={optInStatus}
        onChange={() => {
          setOptInStatus(!optInStatus)
          handleOptInChange(!optInStatus)
        }}
        className={profileStyles["opt-in-switch"]}
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
    <button id={profileStyles["profile-delete-account"]} className="btn mb-3" onClick={onClick}>
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
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [fields, setFields] = useState({
    email: "",
    fullName: "",
    bio: "",
    year: 0,
    course: "",
    teleHandle: "@",
    rating: 0,
    numOfRaters: 0,
    notifFilters: [""],
    optInStatus: false
  })
  const [profilePic, setProfilePic] = useState("")

  // UseEffect hook to fetch profile data
  useEffect(() => {
    const fetchData = async () => { 
      const validateRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/validate-token`,
        { 
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )

      if (validateRes.status != 200) {
        router.push("/sign-in")
      }
      
      const fetchRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )
      if (fetchRes.status == 200) {
        const data = await fetchRes.json()
        setFields(data)
        setProfilePic(data.profilePic || "")
        setIsLoading(false)
      } else {
        console.log("Profile fetch error")
      }
    }

    fetchData().catch(error => console.log("User not found."))
  }, [])

  // Function to handle change on the Editable Card.
  // Triggered by save changes button.
  const handleFieldChange = async ({
    fieldToUpdate,
    value,
  }: {
    fieldToUpdate: string
    value: string | number | string[] | boolean
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-profile-pic`, {
          method: "POST",
          body: formData,
          credentials: "include"
        })
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
    <div className={profileStyles["profile-page-container"]}>
      <EditProfileTitle />
      <ProfilePic profilePic={profilePic} />
      <div id={profileStyles["profile-pic-button-container"]}>
        <UploadProfilePic isLoading={isLoading} profilePic={profilePic} onUpload={handleProfilePicUpload} />
        <RemoveProfilePic
          profilePic={profilePic}
          onRemove={handleProfilePicRemoval}
        />
      </div>
      <NameEmail isLoading={isLoading} name={fields.fullName} email={fields.email} />
      
      <div id={profileStyles["profile-field-container"]}>      
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
          onSave={(value) => {
            if (typeof value != "string") return
            if (value == "") value = "@"
            else if (value.charAt(0) != "@") value = "@" + value
            handleFieldChange({ fieldToUpdate: "teleHandle", value })
          }}
        />
        <RatingCard rating={fields.rating} raterCount={fields.numOfRaters} />
        <NotifFilters 
          isLoading={isLoading}
          filters={fields.notifFilters}
          onSave={(value: string[]) =>
            handleFieldChange({ fieldToUpdate: "notifFilters", value })} 
        />
      </div>

      { isLoading 
        ? <></> 
        : <OptInForListings 
            optInStatus = {fields.optInStatus}
            setOptInStatus={(optInStatus: boolean) => setFields({
              ...fields,
              optInStatus: optInStatus
            
            })}
            handleOptInChange={(value) =>
              handleFieldChange({ fieldToUpdate: "optInStatus", value })}
          /> 
      }
      <div className={profileStyles["button-container"]}>
        { isLoading 
          ? <Placeholder.Button variant="light" xs={2} style={{marginRight: "10px"}}/> 
          : <SignOutButton /> }
        { isLoading 
          ? <Placeholder.Button variant="light" xs={2}/> 
          : <DeleteAccount 
              email={fields.email}
              router={router} />
        }
      </div>
    </div>
  )
}
