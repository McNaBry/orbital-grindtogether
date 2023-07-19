import { ChangeEvent } from "react"
import Image from "next/image"
import profileStyles from "./profile-page.module.css"

interface UploadProfilePicProps {
  isLoading: boolean
  profilePic: string,
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
}

function UploadProfilePic({ isLoading, profilePic, onUpload }: UploadProfilePicProps) {
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      onUpload(event)
    }
  }

  if (isLoading) {
    return <></>
  }

  return (
    <div>
      <label id={profileStyles[`upload-picture-label${profilePic ? "" : "-none"}`]} htmlFor={profileStyles["upload-picture-input"]}>
        <Image 
          src="images/upload-pic.svg" alt="" 
          width="40" height="40" />
      </label> 

      <input
        type="file"
        id={profileStyles["upload-picture-input"]}
        accept="image/png, image/jpeg, image/svg"
        onChange = {handleUpload}
      />
    </div>
  )
}

export default UploadProfilePic;