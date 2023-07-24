'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import StudyCard, { StudyListing } from '../../(components)/studyCard'
import EditPanel from "./editPanel"
import Notif from "../../notif"
import { Form, Button } from 'react-bootstrap'
import styles from './create-listing.module.css' 

// Typescript has a weird error where you can't index the object with string keys
// Hence instead of giving it a StudyListing type, it is given a dict type
const defaultOptions : {[key:string]: any} = {
  "createdBy": "hXAnaW",
  "creatorName": "Xiao Ming",
  "title":     "Title",
  "desc":      "Description",
  "tags":      {"modules":[], "locations":[], "faculties":[]},
  "date":        new Date(new Date().toDateString()), // Set current date
  "dateCreated": new Date(new Date().toDateString()), // Set current date
  "freq":      "Every day",
  "interest":  0,
  "id":        "invitedefault"
}

export default function CreateListing({ searchParams } : { searchParams: any }) {
  const router = useRouter()
  const urlParams = new URLSearchParams(searchParams)
  console.log(urlParams.get("edit"))
  // Boolean flag to determine whether a NEW listing is being created
  // Or an EXISTING listing is being edited
  const editMode = (urlParams.get("edit") || "create") != "create"
  const tags = urlParams.get("tags")?.split("|") || []

  // Options to be displayed on the card as a preview (demo)
  const [demoOptions, setDemoOptions] = useState<StudyListing>({
    createdBy:   editMode ? urlParams.get("createdBy") : defaultOptions['createdBy'],
    creatorName: editMode ? urlParams.get("creatorName") : defaultOptions['creatorName'],
    title:       editMode ? urlParams.get("title")     : defaultOptions['title'],
    desc:        editMode ? urlParams.get("desc")      : defaultOptions['desc'],
    tags: {
      "modules":   editMode ? tags[0].split(",").slice(1) : [], 
      "locations": editMode ? tags[1].split(",").slice(1) : [],
      "faculties": editMode ? tags[2].split(",").slice(1) : []
    },
    date:        editMode ? new Date(urlParams.get('date') || new Date().toDateString()) : defaultOptions['date'],
    dateCreated: editMode ? new Date(urlParams.get('date') || new Date().toDateString()) : defaultOptions['date'],
    freq:     editMode ? urlParams.get("freq") : defaultOptions['freq'],
    interest: editMode ? parseInt(urlParams.get("interest") || '0') : defaultOptions['interest'],
    id:       editMode ? urlParams.get("id") : defaultOptions['id'],
    liked:    false
  })

  // Hooks for notification popup
  const [ msg, setMsg ] = useState<string>("")
  const [ success, setSuccess ] = useState<boolean>(false)

  useEffect(() => {
    if (msg != "") {
      const timeout = setTimeout(() => {
        setMsg("")
        router.push("/dashboard")
      }, 3000)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [msg])
  
  useEffect(() => 
    setDemoOptions({
      ...demoOptions, 
      creatorName: window.localStorage.getItem("fullName") || "Xiao Ming"}
  ), [])

  // Function to handle form submit and create/update listing
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (demoOptions.date == null) {
      setSuccess(false)
      setMsg("Select a date first.")
      return
    } else if (demoOptions.date < defaultOptions["date"]) {
      setSuccess(false)
      setMsg("Listing date must not be before today's date.")
      return
    }
    
    const endpoint = editMode 
      ? `${process.env.NEXT_PUBLIC_API_URL}/edit-listing` 
      : `${process.env.NEXT_PUBLIC_API_URL}/create-listing`
    const action = editMode ? "updated" : "created"

    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(demoOptions),
      credentials: "include"
    })
    .then(async data => {
      // Server responds with error
      if (data.status == 401) {
        setSuccess(false)
        setMsg(`Please sign in to ${action} a new listing.`)
        await new Promise(r => setTimeout(r, 2000))
        router.push("/sign-in")
        return
      } else if (!data.ok) {
        setSuccess(false)
        setMsg(`Sorry! Listing was not ${action} successfully. Try again.`)
        return
      }
      // Listing created/edited successfully
      setSuccess(true)
      setMsg(`Listing has been ${action}! View it on your Dashboard or View Listings`)
      await new Promise(r => setTimeout(r, 2000))
      router.push("/dashboard")
    })
    .catch(error => {
      console.log(error)
      setSuccess(false)
      setMsg("Sorry! Listing was not created successfully. Try again.")
    })
  }

  return (
    <div id={styles["create-listing-container"]}>
      <h1 style={{color: "white"}}>{editMode ? "Edit" : "Create"} Listing</h1>
      <div id={styles["demo-card-container"]}>
        <StudyCard listingData={demoOptions} variant="demo" router={router}/>
      </div>
      <Form id={styles["options-container"]} onSubmit={handleSubmit}>
        <EditPanel
          editMode={editMode}
          defaultOptions={defaultOptions}
          demoOptions={demoOptions}
          setDemoOptions={setDemoOptions}
        />
        <Button variant="success" type="submit">{editMode ? "Edit Listing" : "Create Listing"}</Button>
      </Form>
      <Notif msg={msg} success={success} setMsg={(msg: string) => setMsg(msg)}/>
    </div>
  )
}