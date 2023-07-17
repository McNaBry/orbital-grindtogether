import { 
  Option, 
  SelectFreeOption, 
  SelectMultiOption,
  DateOption 
} from "./select"

import { Container } from "react-bootstrap"
import { StudyListing } from '../studyCard'
import styles from "./create-listing.module.css"
import { tagData } from "../study-listings/data"
import { SetStateAction } from "react"
import { ActionMeta } from "react-select"

const titles:Option[] = [
  { value: "Serious Sesh", label: "Serious Title" },
  { value: "Chill sesh", label: "Chill Title" },
  { value: "Grind & Chill", label: "Mixed Title" }
]

const desc:Option[] = [
  { value: "No chat. Just study and help each other.", label: "Serious Description" },
  { value: "Just want to make friends while studying", label: "Chill Description" },
  { value: "Let's study as hard as we can and make some friends!", label: "Mixed Description" }
]

const freq:Option[] = [
  { value: "Once a week", label: "Once a week" },
  { value: "Every weekday", label: "Every weekday" },
  { value: "Weekends", label: "Weekends" },
  { value: "One time only", label: "One time only" },
  { value: "Some weekdays", label: "Some weekdays" }
]

type EditPanelProps = {
  editMode: boolean,
  defaultOptions: {[key:string]: any},
  demoOptions: StudyListing,
  setDemoOptions: (value: SetStateAction<StudyListing>) => void
}
export default function EditPanel(
  { editMode, defaultOptions, demoOptions, setDemoOptions } : EditPanelProps) {

  // Function to handle date change on the datepicker
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

  // Function to handle option change on single select
  function handleSingleOptionChange(
    type:string, option: Option | null, actionMeta: ActionMeta<Option>) 
  {
    // If option is cleared, option will be null
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

  // Function to handle option change on multiple select
  function handleMultipleOptionChange(
    type: string, option: readonly Option[], actionMeta: ActionMeta<Option>) 
  {
    // If all options are cleared, option will be an empty array
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
    <>
    <Container className={styles["options-subcontainer"]}>
      <SelectFreeOption
        params={{
          name: "Title",
          type: "title",
          options: [...titles, {value: demoOptions.title, label: demoOptions.title}],
          defaultValue: !editMode 
            ? null : {value: demoOptions.title, label: demoOptions.title},
          handleChange: handleSingleOptionChange
        }}
      />
      <SelectFreeOption
        params={{
          name:"Description",
          type:"desc",
          options: [...desc, {value: demoOptions.desc, label: demoOptions.desc}],
          defaultValue: !editMode
            ? null : {value: demoOptions.desc, label: demoOptions.desc},
          handleChange: handleSingleOptionChange
        }}
      />
    </Container>
    <Container className={styles["options-subcontainer"]}>
      <SelectMultiOption
        params={{
          name:"Modules",
          type:"modules",
          options: tagData["modules"].map(tag => ({value: tag, label: tag})),
          defaultValue: !editMode ? [] : demoOptions.tags.modules.map(tag => ({value: tag, label: tag})),
          handleChange: handleMultipleOptionChange
        }}
      />
      <SelectMultiOption
        params={{
          name:"Location",
          type:"locations",
          options: tagData["locations"].map(tag => ({value: tag, label: tag})),
          defaultValue: !editMode ? [] : demoOptions.tags.locations.map(tag => ({value: tag, label: tag})),
          handleChange: handleMultipleOptionChange
        }}
      />
      <SelectMultiOption
        params={{
          name:"Faculty",
          type:"faculties",
          options: tagData["faculties"].map(tag => ({value: tag, label: tag})),
          defaultValue: !editMode ? [] : demoOptions.tags.faculties.map(tag => ({value: tag, label: tag})),
          handleChange: handleMultipleOptionChange
        }}
      />
    </Container>
    <Container className={styles["options-subcontainer"]}>
      <DateOption
        startDate={demoOptions["date"]}
        setStartDate={handleDateOptionChange}
      />
      <SelectFreeOption
        params={{
          name: "Frequency",
          type: "freq",
          options: freq,
          defaultValue: !editMode ? null : {value: demoOptions.desc, label: demoOptions.desc},
          handleChange: handleSingleOptionChange
        }}
      />
    </Container>
  </>
  )
}

