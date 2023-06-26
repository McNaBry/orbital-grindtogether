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
  const [ msg, setMsg ] = useState<string>("")
  const [ success, setSuccess ] = useState<boolean>(false)

  const urlParams = new URLSearchParams(searchParams)
  const tags = urlParams.get("tags")?.split("|") || []
  const listing: StudyListing = {
    createdBy: urlParams.get('createdBy') || "Annonymous",
    title: urlParams.get('title') || "Title",
    desc: urlParams.get('desc') || "Desc",
    tags: {
      "modules": tags[0].split(",").slice(1), 
      "locations": tags[1].split(",").slice(1),
      "faculties": tags[2].split(",").slice(1)
    },
    date: new Date(urlParams.get('date') || Date.now()),
    freq: urlParams.get('freq') || "Every day",
    interest: parseInt(urlParams.get('interest') || '0'),
    id: urlParams.get('id') || ""
  }

  async function deleteListing() {
    const userID = window.localStorage.getItem("uid") || ""
    if (userID == "") {
      setSuccess(false)
      setMsg("User ID not found. Please sign in.")
    }

    const deleteListingRes = await fetch("http://localhost:5000/delete-listing", {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: userID,
        listingUID: listing.id
      })
    })

    if (deleteListingRes.ok) {
      console.log("Delete successful")
      setSuccess(true)
      setMsg("Listing successfully deleted!")
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
        <StudyCard listingData={listing} variant="delete" />
        <h5 id={deleteStyles["delete-prompt"]}>Are you sure you wish to delete this listing?</h5>
        <Button variant="danger" onClick={(event) => deleteListing()}>I am sure.</Button>
      </div>
      <Notif msg={msg} success={success} />
    </div>
  )
}