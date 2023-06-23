"use client"

import React, { useState, useEffect } from "react"
import "./profilepage.css"
import "./nonEditableCard"
import NonEditableCard from "./nonEditableCard"
import EditableCard from "./editableCard"
import RatingCard from "./ratingCard"
import { useAuth } from "../authProvider"

function EditProfile() {
  return <h2> Edit Profile </h2>;
}

function UploadProfilePic() {
  return (
    <div>
      <label
        htmlFor="pictureUpload"
        className="btn btn-primary upload-profile-pic"
      >
        Upload Profile Picture
        <input
          type="file"
          id="pictureUpload"
          accept="image/png, image/jpeg, image/svg"
        />
      </label>
    </div>
  );
}

function ProfilePic() {
  return <div className="profile-pic"></div>;
}

function NameCard({ name }: {name: string}) {
  return (
    <NonEditableCard title="Full Name">
      <p className="card-text"> {name} </p>
    </NonEditableCard>
  );
}
function EmailCard({ email }: {email: string}) {
  return (
    <NonEditableCard title="Email">
      <p className="card-text"> {email} </p>
    </NonEditableCard>
  );
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
    rating: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(auth.user.uid)
        const response = await fetch("http://localhost:5000/get-profile", {
          method: 'POST',
          headers : {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({uid: window.localStorage.getItem("uid")})
        })
        const data = await response.json()
        setFields(data)
      } catch (error) {
        console.log("user not found")
      }
    }

    fetchData();
  }, [])

  const handleFieldChange = ({
    fieldToUpdate,
    value,
  }: {
    fieldToUpdate: string;
    value: string | number;
  }) => {
    // immediately update the state
    setFields((otherFields) => ({ ...otherFields, [fieldToUpdate]: value }))

    const updatedProfileData = { [fieldToUpdate]: value }

    fetch("http://localhost:5000/get-profile", {
      method: "POST",
      headers : {
        "Content-Type": "application/json",
      },
      body : JSON.stringify(updatedProfileData)
    })
  };

  return (
    <div className="profile-page">
      <EditProfile />
      <ProfilePic />
      <UploadProfilePic />
      <NameCard name= {fields.fullName} />
      <EmailCard email={fields.email} />
      <EditableCard
        field="Bio"
        value={fields.bio}
        maxChars= {150}
        onSave={(value) => handleFieldChange({ fieldToUpdate: "bio", value })}
      />
      <EditableCard
        field="Year"
        value={fields.year}
        maxChars= {1}
        onSave={(value) =>
          handleFieldChange({ fieldToUpdate: "year", value: Number(value) })
        }
      />
      <EditableCard
        field="Course"
        value={fields.course}
        maxChars= {50}
        onSave={(value) =>
          handleFieldChange({ fieldToUpdate: "course", value })
        }
      />
      <EditableCard
        field="Telegram Handle"
        value={fields.telegramHandle}
        maxChars= {32}
        onSave={(value) =>
          handleFieldChange({ fieldToUpdate: "telegramHandle", value })
        }
      />
      <RatingCard rating = {fields.rating}/>
    </div>
  );
}

export default ProfilePage;
