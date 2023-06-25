import { useRouter } from "next/navigation"
import LikeButton from "./likeButton";
import cardStyles from "./studyCard.module.css"
import { StudyListing } from "./studyCard"

function DeleteButton({ listingData } : { listingData: StudyListing }) {
  const router = useRouter()
  const query = new URLSearchParams(JSON.parse(JSON.stringify(listingData))).toString()
  return (
    <button 
      id={cardStyles["delete-button"]}
      onClick={(event) => router.push(`/delete-listing/${listingData.id}?${query}`)}>
      <p>Delete</p>
    </button>
  )
}

function EditButton() {
  return (
    <button id={cardStyles["edit-button"]}>
      <p>Edit</p>
    </button>
  )
}

function CardActionBar({ variant, listingData } : { variant: string, listingData: StudyListing }) {
  return (
    <small id={cardStyles["action-bar"]}>
      { variant == "modify" || variant == "personal"
        ? <></>
        : <LikeButton />
      }
      { variant == "modify" || variant == "disabled"
        ? <>
            <EditButton />
            <DeleteButton listingData={listingData}/>
          </>
        : <></>
      }
    </small>
  )
}

export default CardActionBar;