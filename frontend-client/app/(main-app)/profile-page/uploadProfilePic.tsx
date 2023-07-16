import { ChangeEvent } from "react"
import { Placeholder } from "react-bootstrap"

interface UploadProfilePicProps {
  isLoading: boolean,
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
}

function UploadProfilePic({ isLoading, onUpload }: UploadProfilePicProps) {
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      onUpload(event)
    }
  }

  return (
    <>
    { isLoading 
      ? <div style={{width: "200px", margin: "15px 0px 15px 0px"}}>
          <Placeholder.Button variant="primary" xs={12}/>
        </div>
      : <div>
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
    }
    </>
  )
}

export default UploadProfilePic;