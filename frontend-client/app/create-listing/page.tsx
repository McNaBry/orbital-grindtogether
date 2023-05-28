"use client"

import styles from "./create-listing.module.css"

import { useState, SyntheticEvent } from "react"
import { Autocomplete, TextField } from "@mui/material"
import { data } from "../study-listings/data"
import StudyCard, { StudyListing } from "./studyCard"

type ListingOptionProps = {
  label: string,
  type: string,
  options: string[],
  freesolo: boolean,
  handleFilterChange: 
    ((event:SyntheticEvent<Element, Event>, value:string[] | string | null, type:string) => void)
}

function SingleOption({ label, type, options, freesolo, handleFilterChange } : ListingOptionProps) {
  return (
    <Autocomplete
      id="multiple-limit-tags"
      className="col-10"
      options={options}
      freeSolo={freesolo}
      sx={{ marginTop: "0px", color:"red"}}
      renderInput={(params) => <TextField {...params} variant="standard" label={label} />}
      onChange={(event, value) => handleFilterChange(event, value, type)}
    />
  )
}

function ListingOption({ label, type, options, freesolo, handleFilterChange } : ListingOptionProps) {
  return (
    <Autocomplete
      multiple
      id="multiple-limit-tags"
      className="col-10"
      options={options}
      freeSolo={freesolo}
      sx={{ marginTop: "0px", color:"red"}}
      renderInput={(params) => <TextField {...params} variant="standard" label={label} />}
      onChange={(event, value) => handleFilterChange(event, value, type)}
    />
  )
}

const defaultOptions:{[key:string] : string} = {
  "title":    "Title",
  "desc":     "Description",
  "date":     "1/1/2023",
  "freq":     "Every day",
  "interest": "10"
}

export default function CreateListing() {
  const [demoOptions, setDemoOptions] = useState<StudyListing>({
    title: defaultOptions['title'],
    desc: defaultOptions['desc'],
    tags: {"modules":[], "locations":[], "faculties":[]},
    date: defaultOptions['date'],
    freq: defaultOptions['freq'],
    interest: defaultOptions['interest'],
    id: 1
  })

  function handleOptionChange(event: SyntheticEvent<Element, Event>, value: string[] | string | null, type: string) {
    if (Array.isArray(value)) {
      setDemoOptions(prevOptions => ({
        ...prevOptions,
        tags: {
          ...prevOptions.tags,
          [type]: value
        }
      }))
    } else if (typeof value == "string") {
      setDemoOptions(prevOptions => ({
        ...prevOptions,
        [type]: value
      }))
    } else {
      setDemoOptions(prevOptions => ({
        ...prevOptions,
        [type]: defaultOptions[type]
      }))
    }
  }

  return (
    <div id={styles["create-listing-container"]}>
      <h1>Create Listing</h1>
      <div id={styles["demo-card-container"]}>
        <StudyCard {...demoOptions}/>
      </div>
      <div id={styles["options-container"]}>
        <div className={styles["options-subcontainer"]}>
          <SingleOption
            label="Title"
            type="title"
            options={["Study Group!", "Chill Sesh"]}
            freesolo={true}
            handleFilterChange={handleOptionChange}/>
          <SingleOption
            label="Description"
            type="desc"
            options={["Let's grind together", "Relax and drink kopi"]}
            freesolo={true}
            handleFilterChange={handleOptionChange}/>
        </div>
        <div className={styles["options-subcontainer"]}>
          <ListingOption
            label="Modules"
            type="modules"
            options={Array.from(data["modules"])}
            freesolo={false}
            handleFilterChange={handleOptionChange}/>
          <ListingOption
            label="Location"
            type="locations"
            options={Array.from(data["locations"])}
            freesolo={false}
            handleFilterChange={handleOptionChange}/>
        </div>
        <div className={styles["options-subcontainer"]}>
          <SingleOption
            label="Date"
            type="date"
            options={["1/1/2024"]}
            freesolo={true}
            handleFilterChange={handleOptionChange}/>
          <SingleOption
            label="Frequency"
            type="freq"
            options={["Once", "Every week", "Every day"]}
            freesolo={false}
            handleFilterChange={handleOptionChange}/>
        </div>
      </div>
      <button className="btn btn-success">Create Listing</button>
    </div>
  )
}