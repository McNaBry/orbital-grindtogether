'use client'

import { useState } from 'react'

import { ActionMeta } from 'react-select'
import { 
  Option, 
  SelectFreeOption, SelectMultiOption, 
  SelectFreeOptionProps, SelectMultiOptionProps 
} from "./select"
import StudyCard, { StudyListing } from './studyCard'
import styles from './create-listing.module.css'

import { data } from '../study-listings/data'

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
        options: options,
        handleChange: handleChange
      }}
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

  return (
    <div id={styles["create-listing-container"]}>
      <h1>Create Listing</h1>
      <div id={styles["demo-card-container"]}>
        <StudyCard {...demoOptions}/>
      </div>
      <div id={styles["options-container"]}>
        <div className={styles["options-subcontainer"]}>
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
        </div>
        <div className={styles["options-subcontainer"]}>
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
        </div>
        <div className={styles["options-subcontainer"]}>
          <SingleOption
            name="Date"
            type="date"
            options={modules}
            handleChange={handleSingleOptionChange}/>
          <SingleOption
            name="Frequency"
            type="freq"
            options={modules}
            handleChange={handleSingleOptionChange}/>
        </div>
      </div>
      <button className="btn btn-success">Create Listing</button>
    </div>
  )
}