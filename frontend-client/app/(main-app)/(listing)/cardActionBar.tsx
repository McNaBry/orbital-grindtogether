import { useRouter } from "next/navigation"
import LikeButton from "./likeButton"
import cardStyles from "./studyCard.module.css"
import { StudyListing } from "./studyCard"
import { MouseEvent } from "react"

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

function InterestedUsersButton({listingData} : {listingData: StudyListing}) {
  const router = useRouter()

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await fetch("http://localhost:5000/get-interested-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(listingData.id)
      })

      if (!response.ok) {
        throw new Error("flag1")
      }

      const interestedUsers = await response.json()

      const query = new URLSearchParams();
      query.append("interestedUsers", JSON.stringify(interestedUsers));
      const queryString = query.toString();
      const url = `/interested-users/${listingData.id}?${queryString}`;
      router.push(url);
    } catch (error) {
      console.error("Could not get list of interested users", error)
    }
  }

  return (
    <button id = {cardStyles["interested-users-button"]} onClick = {handleClick}>
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
            <InterestedUsersButton listingData={listingData}/>
          </>
        : <></>
      }
    </small>
  )
}

export default CardActionBar;