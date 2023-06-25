import { useRouter, useSearchParams } from "next/navigation"
import StudyCard, { StudyListing } from "../../studyCard"

type DeleteListingProps = {
  params: { id: string },
  // searchParams: { [key: string]: string | string[] | undefined }
  searchParams: any
}

export default function DeleteListing({ params, searchParams }: DeleteListingProps) {
  const urlParams = new URLSearchParams(searchParams)
  const listing: StudyListing = {
    createdBy: urlParams.get('createdBy') || "Annonymous",
    title: urlParams.get('title') || "Title",
    desc: urlParams.get('desc') || "Desc",
    tags: {
      "modules":[], 
      "locations":[], 
      "faculties":[]
    },
    date: new Date(urlParams.get('date') || Date.now()),
    freq: urlParams.get('freq') || "Every day",
    interest: parseInt(urlParams.get('interest') || '0'),
    id: urlParams.get('id') || ""
  }
  console.log(urlParams.get("tags"))
  return (
    <>
      <h1 style={{color: "white", textAlign: "center"}}>Delete Listing</h1>
    </>
  )
}