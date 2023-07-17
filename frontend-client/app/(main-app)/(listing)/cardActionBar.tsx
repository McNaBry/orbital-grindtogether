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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get-interested-users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({listingUID: listingData.id}),
        }
      )

      if (!response.ok) {
        console.log(response.status)
        throw new Error("Failed to fetch interested users")
      }

      const interestedUsers = await response.json()

      const query = new URLSearchParams()
      query.append("interestedUsers", JSON.stringify(interestedUsers))
      const url = `/interested-users/${listingData.id}?${query.toString()}`
      
      console.log(url)
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
        <LikeButton listingData={listingData} variant={variant} />
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
