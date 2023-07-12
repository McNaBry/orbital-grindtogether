import { useRouter } from "next/navigation"
import LikeButton from "./likeButton"
import cardStyles from "./studyCard.module.css"
import { StudyListing } from "./studyCard"

function DeleteButton({ listingData } : { listingData: StudyListing }) {
  const router = useRouter()
  let flattenedData = {
    ...listingData,
    tags: [
      "modules," + listingData.tags.modules.join(","),
      "locations," + listingData.tags.locations.join(","),
      "faculties," + listingData.tags.faculties.join(","),
    ].join("|")
  }
  const query = new URLSearchParams(JSON.parse(JSON.stringify(flattenedData))).toString()
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

/* Variants:
  1. Display. For display only. No edit or delete button.
  2. Dashboard-Display. Liked listings on dashboard.
  3. Modify. For modification only. No like button.
  3. Delete. For deletion. No buttons.
*/
function CardActionBar({ variant, listingData } : { variant: string, listingData: StudyListing }) {
  return (
    <small id={cardStyles["action-bar"]}>
      { variant == "display" || variant == "dashboard-display"
        ? <LikeButton listingData={listingData} variant={variant} />
        : <></>
      }
      { variant == "modify"
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