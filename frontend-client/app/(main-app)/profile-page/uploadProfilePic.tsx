import { ChangeEvent } from "react"

interface UploadProfilePicProps {
    onUpload: (event: ChangeEvent<HTMLInputElement>) => void
}

function UploadProfilePic({onUpload}: UploadProfilePicProps) {
    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length) {
            onUpload(event)
        }
    }

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
            onChange = {handleUpload}
          />
        </label>
      </div>
    )
}

export default UploadProfilePic;