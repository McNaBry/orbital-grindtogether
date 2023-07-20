"use client"

import StudyCard, { StudyListing } from "../../studyCard"
import { Button, ToastContainer, Toast } from "react-bootstrap"
import deleteStyles from "./delete-listing.module.css"
import { useRouter } from "next/navigation"
import { useState } from "react"

function Notif(
  { msg, success } : { msg: string, success: boolean }) {
  return (
    <ToastContainer position="bottom-end" style={{position: "fixed", margin: "20px"}}>
      <Toast bg={success ? "success" : "danger"} autohide={true} show={msg == "" ? false : true}>
          <Toast.Body style={{color: "white"}}>{msg}</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

type DeleteListingProps = {
  params: { id: string },
  // searchParams: { [key: string]: string | string[] | undefined }
  searchParams: any
}

export default function DeleteListing({ params, searchParams }: DeleteListingProps) {
  const router = useRouter()
  // useState hooks to manipulate pop up notification
  const [ msg, setMsg ] = useState<string>("")
  const [ success, setSuccess ] = useState<boolean>(false)

  // Retrieve URL search params taht were passed in
  const urlParams = new URLSearchParams(searchParams)
  // Unpack tags into the respective categories
  const tags = urlParams.get("tags")?.split("|") || []
  // Set each field to the respective URL search param value(s)
  // These fields are used to display the details of the listing to be deleted
  const listing: StudyListing = {
    createdBy: urlParams.get('createdBy') || "AxAWDSa",
    creatorName: urlParams.get('creatorName') || "Annonymous",
    title: urlParams.get('title') || "Title",
    desc: urlParams.get('desc') || "Desc",
    tags: {
      "modules": tags[0].split(",").slice(1), 
      "locations": tags[1].split(",").slice(1),
      "faculties": tags[2].split(",").slice(1)
    },
    date: new Date(urlParams.get('date') || Date.now()),
    dateCreated: new Date(urlParams.get('dateCreated') || Date.now()), 
    freq: urlParams.get('freq') || "Every day",
    interest: parseInt(urlParams.get('interest') || '0'),
    id: urlParams.get('id') || "",
    liked: false
  }

  async function deleteListing() {
    const deleteListingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete-listing`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listingUID: listing.id
      }),
      credentials: "include"
    })

    if (deleteListingRes.ok) {
      console.log("Delete successful")
      setSuccess(true)
      setMsg("Listing successfully deleted!")
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push("/dashboard")
    } else {
      console.log("Delete unsuccessful")
      setSuccess(false)
      setMsg("Listing was not deleted. Try again.")
    }
  }
  
  return (
    <div id={deleteStyles["delete-listing-container"]}>
      <h1 style={{color: "white", textAlign: "center"}}>Delete Listing</h1>
      <div id={deleteStyles["delete-listing-subcontainer"]}>
        <StudyCard listingData={listing} variant="delete" router={router} />
        <h5 id={deleteStyles["delete-prompt"]}>Are you sure you wish to delete this listing?</h5>
        <Button variant="danger" onClick={(event) => deleteListing()}>I am sure.</Button>
      </div>
      <Notif msg={msg} success={success} />
    </div>
  )
}