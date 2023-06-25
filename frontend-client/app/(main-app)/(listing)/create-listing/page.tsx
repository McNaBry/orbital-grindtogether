'use client'

import { FormEvent, useState } from 'react'

import { ActionMeta } from 'react-select'
import { 
  Option, 
  SelectFreeOption, SelectMultiOption, 
  SelectFreeOptionProps, SelectMultiOptionProps,
  DateOption 
} from "./select"
import StudyCard, { StudyListing } from '../studyCard'
import { Container, Form, Button, Toast, ToastContainer } from 'react-bootstrap'
import styles from './create-listing.module.css'

import { tagData } from '../study-listings/data'

const modules:Option[] = [
  { value: "CS2040S", label: "CS2040S" },
  { value: "CS1231S", label: "CS1231S" },
  { value: "CS2030S", label: "CS2030S" }
]

function SingleOption({ name, type, options, handleChange } : SelectFreeOptionProps) {
  return (
    <SelectFreeOption
      params={{
        name: name,
        type: type,
        options: options,
        handleChange: handleChange
      }}
    />
  )
}

function MultiOption({ name, type, options, handleChange } : SelectMultiOptionProps) {
  return (
    <SelectMultiOption
      params={{
        name: name,
        type: type,
        options: tagData[type].map(value => ({value: value, label: value})),
        handleChange: handleChange
      }}
    />
  )
}

// Typescript has a weird error where you can't index the object with string keys
// Hence instead of giving it a StudyListing type, it is given a dict type
const defaultOptions:{[key:string]: any} = {
  "createdBy": "Bryan Lee",
  "title":     "Title",
  "desc":      "Description",
  "tags":      {"modules":[], "locations":[], "faculties":[]},
  "date":      new Date(), // Set current timing
  "freq":      "Every day",
  "interest":  10,
  "id":        "invitedefault"
}

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

export default function CreateListing() {
  const [demoOptions, setDemoOptions] = useState<StudyListing>({
    createdBy: defaultOptions['createdBy'],
    title: defaultOptions['title'],
    desc: defaultOptions['desc'],
    tags: {"modules":[], "locations":[], "faculties":[]},
    date: defaultOptions['date'],
    freq: defaultOptions['freq'],
    interest: defaultOptions['interest'],
    id: defaultOptions['id']
  })

  const [ msg, setMsg ] = useState<string>("")
  const [ success, setSuccess ] = useState<boolean>(false)

  function handleDateOptionChange(date: Date | null) {
    if (date == null) setDemoOptions(prevOptions => ({
      ...prevOptions,
      date: new Date()
    }))
    else setDemoOptions(prevOptions => ({
      ...prevOptions,
      date: date
    }))
  }

  function handleSingleOptionChange(type:string, option: Option | null, actionMeta: ActionMeta<Option>) {
    if (option == null) {
      setDemoOptions(prevOptions => ({
        ...prevOptions,
        [type]: defaultOptions[type]
      }))
    } else {
      setDemoOptions(prevOptions => ({
        ...prevOptions,
        [type]: option.value
      }))
    }
  }

  function handleMultipleOptionChange(type: string, option: readonly Option[], actionMeta: ActionMeta<Option>) {
    const values = option.map(item => item.value)
    setDemoOptions(prevOptions => ({
      ...prevOptions,
      tags: {
        ...prevOptions.tags,
        [type]: values
      }
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const userID = window.localStorage.getItem("uid")
    if (userID == null || userID == "") {
      setSuccess(false)
      setMsg("Cannot find user. Sign in again.")
      return
    }
    const res = await fetch('http://localhost:5000/create-listing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...demoOptions,
        userID: 'hxASjzp8fZz3GyekGHhO' // For testing
      }),
    })

    if (res.ok) {
      setSuccess(true)
      setMsg("Listing has been created! View it on your Dashboard or View Listings")
      console.log("submission success")
    } else {
      setSuccess(false)
      setMsg("Sorry! Listing was not created successfully. Try again.")
    }
  }

  return (
    <div id={styles["create-listing-container"]}>
      <h1 style={{color: "white"}}>Create Listing</h1>
      <div id={styles["demo-card-container"]}>
        <StudyCard {...demoOptions}/>
      </div>
      <Form id={styles["options-container"]} onSubmit={handleSubmit}>
        <Container className={styles["options-subcontainer"]}>
          <SingleOption
            name="Title"
            type="title"
            options={modules}
            handleChange={handleSingleOptionChange}/>
          <SingleOption
            name="Description"
            type="desc"
            options={modules}
            handleChange={handleSingleOptionChange}/>
        </Container>
        <Container className={styles["options-subcontainer"]}>
          <MultiOption
            name="Modules"
            type="modules"
            options={modules}
            handleChange={handleMultipleOptionChange}/>
          <MultiOption
            name="Location"
            type="locations"
            options={modules}
            handleChange={handleMultipleOptionChange}/>
          <MultiOption
            name="Faculty"
            type="faculties"
            options={modules}
            handleChange={handleMultipleOptionChange}/>
        </Container>
        <Container className={styles["options-subcontainer"]}>
          <DateOption
            startDate={demoOptions["date"]}
            setStartDate={handleDateOptionChange}
          />
          <SingleOption
            name="Frequency"
            type="freq"
            options={modules}
            handleChange={handleSingleOptionChange}/>
        </Container>
        <Button variant="success" type="submit">Create Listing</Button>
      </Form>
      <Notif msg={msg} success={success} />
    </div>
  )
}