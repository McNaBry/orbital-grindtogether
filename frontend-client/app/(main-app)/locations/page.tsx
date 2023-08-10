"use client"

import { MouseEvent, useState } from "react"
import { ActionMeta } from "react-select"
import { Button, Spinner } from "react-bootstrap"
import { Option } from "../(components)/select"
import CrowdLevels from "./crowdLevels"
import Notif from "../notif"
import locStyles from "./locations.module.css"
import { useRouter } from "next/navigation"
import LocationPicker from "./locationPicker"
import DatePicker from "./datePicker"

function Contribute({ isLoading, location, date } : { isLoading: boolean, location: string, date: Date }) {
  const router = useRouter()
  if (isLoading) return <></>
  return (
    <Button 
      style={{marginTop: "10px"}}
      variant="secondary"
      onClick={() => router.push(`/locations/contribute?location=${location}&date=${date.toISOString()}`)}>
        Contribute
    </Button>
  )
}

function LocationData({ isLoading, locationData } : { isLoading: boolean, locationData: number }) {
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
    <div id={locStyles["location-data"]}>{locationData} listings are scheduled to take place.</div>
  )
}

function Locations() {
  const [ date, setDate ] = useState<Date>(new Date(new Date().toDateString()))
  const [ location, setLocation ] = useState<string>("")

  const [ msg, setMsg ] = useState<string>("")
  const [ success, setSuccess ] = useState<boolean>(false)
  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  const [ locationData, setLocationData ] = useState<number>(0)
  const [ crowdLevels, setCrowdLevels ] = useState<{[id: string] : string}>({'0': '0,0'})

  // Function to handle option change on single select
  function handleSingleOptionChange(type:string, option: Option | null, actionMeta: ActionMeta<Option>) {
    if (option == null) {
      setLocation("")
    } else {
      setLocation(option.value)
    }
    setCrowdLevels({'0': '0,0'})
    setLocationData(0)
  }

  function handleDateChange(date: Date | null) {
    if (date == null) return
    setCrowdLevels({'0': '0,0'})
    setLocationData(0)
    const stripDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    setDate(stripDate)
  }

  async function handleSubmit(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (location == "" || date == null) return
    try {
      setIsLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-location-data`, {
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
        const data = await res.json()
        console.log(data.crowdLevels)
        setLocationData(data.count)
        setCrowdLevels(data.crowdLevels)
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
      <LocationPicker defaultValue={null} handleChange={handleSingleOptionChange} />
      <DatePicker startDate={date} setStartDate={handleDateChange} />
      <Button style={{marginTop: "15px"}} type="submit" variant="success" onClick={handleSubmit}>Check Location</Button>
      <Contribute isLoading={isLoading} location={location} date={date}/>
      <CrowdLevels isLoading={isLoading} location={location} crowdLevels={crowdLevels} date={date}/>
      <LocationData isLoading={isLoading} locationData={locationData} />
      <Notif msg={msg} success={success} setMsg={setMsg} />
    </div>
  )
}

export default Locations;