import LikeButton from "./likeButton"
import cardStyles from "./studyCard.module.css"
import { StudyListing } from "./studyCard"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

function listingToURLParam(listingData: StudyListing) {
  const flattenedData = {
    ...listingData,
    tags: [
      "modules," + listingData.tags.modules.join(","),
      "locations," + listingData.tags.locations.join(","),
      "faculties," + listingData.tags.faculties.join(","),
    ].join("|")
  }
  return new URLSearchParams(JSON.parse(JSON.stringify(flattenedData))).toString()
}

function DeleteButton(
  { listingData, router } : 
  { listingData: StudyListing, router: AppRouterInstance }) {
  const query = listingToURLParam(listingData)
  return (
    <button 
      id={cardStyles["delete-button"]}
      onClick={(event) => router.push(`/delete-listing/${listingData.id}?${query}`)}>
      <p>Delete</p>
    </button>
  )
}

function EditButton(
  { listingData, router } : 
  { listingData: StudyListing, router: AppRouterInstance }) {
  const query = listingToURLParam(listingData)
  return (
    <button 
      id={cardStyles["edit-button"]}
      onClick={(event) => router.push(`/create-listing?edit=true&${query}`)}>
      <p>Edit</p>
    </button>
  )
}

/* Variants:
  1. Display. For display only. No edit or delete button.
  2. Modify. For modification only. No like button.
  3. Delete. For deletion. No buttons.
*/
function CardActionBar(
  { variant, listingData, router } : 
  { variant: string, listingData: StudyListing, router: AppRouterInstance }) {
  return (
    <small id={cardStyles["action-bar"]}>
      { variant == "display"
        ? <LikeButton />
        : <></>
      }
      { variant == "modify"
        ? <>
            <EditButton listingData={listingData} router={router} />
            <DeleteButton listingData={listingData} router={router} />
          </>
        : <></>
      }
    </small>
  )
}

export default CardActionBar;