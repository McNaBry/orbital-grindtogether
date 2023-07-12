import { Button } from "react-bootstrap"

interface RemoveProfilePicProps {
    profilePic: string;
    onRemove: () => void;
}

function RemoveProfilePic({ profilePic, onRemove }: RemoveProfilePicProps) {
    if (profilePic) {
      return (
        <Button id="remove-profile-pic" onClick={onRemove}>
          Remove Profile Picture
        </Button>
      )
    } else {
      return null
    }
}

export default RemoveProfilePic;