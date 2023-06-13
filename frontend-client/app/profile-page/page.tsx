"use client";
import React, { useState } from "react";
import "./profilepage.css";
import "./nonEditableCard";
import NonEditableCard from "./nonEditableCard";
import EditableCard from "./editableCard";
import RatingCard from "./ratingCard";
import LikeButton from "../study-listings/likeButton";

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
  const [fields, setFields] = useState({
    bio: "",
    year: 0,
    course: "",
    telegramHandle: "@",
  });

  const handleFieldChange = ({
    fieldToUpdate,
    value,
  }: {
    fieldToUpdate: string;
    value: string | number;
  }) => {
    setFields((otherFields) => ({ ...otherFields, [fieldToUpdate]: value }));
  };

  return (
    <div className="profile-page">
      <EditProfile />
      <ProfilePic />
      <UploadProfilePic />
      <NameCard name="Choo Tze Jie" />
      <EmailCard email="e0929841@u.nus.edu" />
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
      <RatingCard rating = {3.5}/>
      <LikeButton />
    </div>
  );
}

export default ProfilePage;
