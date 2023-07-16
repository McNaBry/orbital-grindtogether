import { ChangeEvent } from "react"
import { Placeholder } from "react-bootstrap"
import Image from "next/image"

interface UploadProfilePicProps {
  profilePic: string,
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
}

function UploadProfilePic({ profilePic, onUpload }: UploadProfilePicProps) {
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      onUpload(event)
    }
  }

  return (
    <div>
      <label id={`upload-picture-label${profilePic ? "" : "-none"}`} htmlFor="upload-picture-input">
        <Image 
          src="images/upload-pic.svg" alt="" 
          width="40" height="40" />
      </label> 

      <input
        type="file"
        id="upload-picture-input"
        accept="image/png, image/jpeg, image/svg"
        onChange = {handleUpload}
      />
    </div>
  )
}

export default UploadProfilePic;