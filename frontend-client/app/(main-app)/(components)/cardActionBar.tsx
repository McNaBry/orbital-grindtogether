import LikeButton from "./likeButton"
import cardStyles from "./studyCard.module.css"
import { StudyListing } from "./studyCard"
import { MouseEvent } from "react"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

function listingToURLParam(listingData: StudyListing) {
  const flattenedData = {
    ...listingData,
    tags: [
      "modules," + listingData.tags.modules.join(","),
      "locations," + listingData.tags.locations.join(","),
      "faculties," + listingData.tags.faculties.join(","),
    ].join("|"),
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
      onClick={(event) =>
        router.push(`/delete-listing/${listingData.id}?${query}`)
      }
    >
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

function InterestedUsersButton(
  { listingData, router } : 
  { listingData: StudyListing, router: AppRouterInstance }) {

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      const url = `/interested-users/${listingData.id}?creatorName=${listingData.creatorName}&creatorUID=${listingData.createdBy}`
      router.push(url)
    } catch (error) {
      console.error("Could not get list of interested users", error)
    }
  }

  return (
    <button id={cardStyles["interested-users-button"]} onClick={handleClick}>
      <p> Interested Users </p>
    </button>
  )
}

function RateButton(
  { listingData, router } : 
  { listingData: StudyListing, router: AppRouterInstance }) {

  return (
    <button 
      id={cardStyles["rate-button"]} 
      onClick={() => router.push(`rate-listing/${listingData.id}?creatorID=${listingData.createdBy}`)}>
      <p> Rate </p>
    </button>
  )
}

/* Variants:
  1. Display. For display only. No edit or delete button.
  2. Dashboard-Display. Liked listings on dashboard.
  3. Modify. For modification only. No like button.
  3. Delete. For deletion. No buttons.
*/
function CardActionBar({
  variant,
  listingData,
  router
}: {
  variant: string
  listingData: StudyListing
  router: AppRouterInstance
}) {
  return (
    <small id={cardStyles["action-bar"]}>
      { variant == "display" || variant == "dashboard-display" ? (
        <>
          <LikeButton listingData={listingData} variant={variant} />
          <InterestedUsersButton listingData={listingData} router={router} />
          { variant == "dashboard-display" 
            ? <RateButton listingData={listingData} router={router} />
            : (
              <></>
          )}
        </>
      ) : (
        <></>
      )}
      
      { variant == "modify" ? (
        <>
          <EditButton listingData={listingData} router={router} />
          <DeleteButton listingData={listingData} router={router} />
          <InterestedUsersButton listingData={listingData} router={router} />
        </>
      ) : (
        <></>
      )}
    </small>
  )
}

export default CardActionBar
