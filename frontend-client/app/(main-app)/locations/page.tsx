"use client"

import LocationButton from "./locationButton";
import { MouseEvent } from "react"
import locStyles from "./locations.module.css"
import {
  Option,
  SelectSingleOption, SelectSingleOptionProps,
  DateOption, DateOptionProps
} from "../(components)/select"
import { tagData } from "../(listing)/study-listings/data"
import { ActionMeta } from "react-select";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import Notif from "../notif"

function LocationPicker({ handleChange } :  Pick<SelectSingleOptionProps, 'handleChange'>) {
  return (
    <div id={locStyles["location-picker"]}>
      <SelectSingleOption 
        params={{
          name: "Location",
          type: "locations",
          options: tagData["locations"].map(value => ({value: value, label: value})),
          defaultValue: null,
          handleChange: handleChange
        }}
      />
    </div>
  )
}

function DatePicker({ startDate, setStartDate } :  DateOptionProps) {
  return (
    <div id={locStyles["location-picker"]}>
      <DateOption 
        startDate={startDate}
        setStartDate={setStartDate}
      />
    </div>
  )
}

function LocationData({ isLoading } : { isLoading: boolean }) {
  if (isLoading) {
    return (
      <div id={locStyles["location-data"]}>
        <Spinner
          style={{marginRight: "10px"}}
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        <span>Fetching location data...</span>
      </div>
    )
  }
  return (
    <div id={locStyles["location-data"]}>Location data goes here!</div>
  )
}

function Locations() {
  const [ date, setDate ] = useState<Date | null>(new Date(new Date().toDateString()))
  const [ location, setLocation ] = useState<string>("")

  const [ msg, setMsg ] = useState<string>("")
  const [ success, setSuccess ] = useState<boolean>(false)
  const [ isLoading, setIsLoading ] = useState<boolean>(true)

  // Function to handle option change on single select
  function handleSingleOptionChange(type:string, option: Option | null, actionMeta: ActionMeta<Option>) {
    if (option == null) {
      setLocation("")
      return
    }
    setLocation(option.value)
  }

  function handleDateChange(date: Date | null) {
    if (date == null) return
    const stripDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    setDate(stripDate)
  }

  async function handleSubmit(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (location == "" || date == null) return
    try {
      setIsLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/count-locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          location: location, 
          date: date 
        }),
        credentials: "include",
      })
  
      if (res.status == 200) {
        console.log("location success!")
        setMsg("Fetched new data")
        setSuccess(true)
      } else {
        console.log("location failure!")
        setMsg("Failed to fetch new data")
        setSuccess(false)
      }
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }
  
  return (
    <div id={locStyles["locations-container"]}>
      <h1 style={{color: "white"}}>Locations</h1>
      <LocationPicker handleChange={handleSingleOptionChange} />
      <DatePicker startDate={date} setStartDate={handleDateChange} />
      <Button style={{marginTop: "15px"}} type="submit" variant="success" onClick={handleSubmit}>Check Location</Button>
      <LocationData isLoading={isLoading} />
      <Notif msg={msg} success={success} setMsg={setMsg} />
    </div>
  )
}

export default Locations;