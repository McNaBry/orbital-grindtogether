import { Button } from "react-bootstrap"
import Image from "next/image"

interface RemoveProfilePicProps {
    profilePic: string;
    onRemove: () => void;
}

function RemoveProfilePic({ profilePic, onRemove }: RemoveProfilePicProps) {
    if (profilePic) {
      return (
        <Button id="remove-pic" onClick={onRemove}>
          <Image
            src="images/remove-pic.svg" alt="" 
            width="40" height="40" />
        </Button>
      )
    } else {
      return <></>
    }
}

export default RemoveProfilePic;