"use client"

import { MouseEvent, useState } from "react"
import DatePicker from "../datePicker"
import LocationPicker from "../locationPicker"
import { ActionMeta } from "react-select"
import { Option } from "../../(components)/select"
import Notif from "../../notif"
import { Button, Dropdown, DropdownButton, Spinner } from "react-bootstrap"
import TimePicker from "../timePicker"
import { useRouter } from "next/navigation"
import locStyles from "../locations.module.css"

const levels = [1, 2, 3, 4]
const levelsLabel = ["low", "moderate", "busy", "very busy"]
const colors = ["#19a974", "#61bb00", "#ff6300", "#e7040f"]

function CrowdLevelPicker({ crowdLevel, setCrowdLevel } : { crowdLevel: number, setCrowdLevel: (level: number) => void }) {
  return (
    <div id={locStyles["crowd-level-picker"]}>
      <span style={{color: "white", marginRight: "10px"}}>Crowd Level: </span>
      <DropdownButton 
        id="dropdown-button" 
        className={locStyles["timing-mode-button"]} 
        title={crowdLevel}
        variant="dark"
      >
        { levels.map(level => {
            return (
              <Dropdown.Item key={level} onClick={() => setCrowdLevel(level)}>
                {level}
              </Dropdown.Item>
            )
        })}
      </DropdownButton>
      <span 
        style={{marginLeft: "10px", background: colors[crowdLevel - 1]}} 
        className={locStyles["timing-data"]}>
          {levelsLabel[crowdLevel - 1]}
      </span>
    </div>
  )

}

function SubmitButton({ isLoading, handleSubmit } : 
  { isLoading: boolean, handleSubmit: (event: MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <Button disabled={isLoading} style={{marginTop: "15px"}} variant="success" onClick={handleSubmit}>
      { isLoading 
        ? <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            style={{marginRight: "5px"}}
          />
        : <></> 
      }
      <span>{isLoading ? "Submitting..." : "Submit"}</span>
    </Button>
  )
}

export default function ContributeLocations({ searchParams } : { searchParams: any }) {
  const router = useRouter()
  const urlParams = new URLSearchParams(searchParams)

  const [ date, setDate ] = useState<Date>(new Date(urlParams.get("date") || new Date()))
  const [ location, setLocation ] = useState<string>(urlParams.get("location") || "")
  const [ selectedTiming, setSelectedTiming ] = useState<number>(new Date().getHours() % 12)
  const [ timingMode, setTimingMode ] = useState<string>(new Date().getHours() > 12 ? "pm" : "am")
  const [ crowdLevel, setCrowdLevel ] = useState<number>(1)

  const [ msg, setMsg ] = useState<string>("")
  const [ success, setSuccess ] = useState<boolean>(false)
  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  // Function to handle option change on single select
  function handleSingleOptionChange(type:string, option: Option | null, actionMeta: ActionMeta<Option>) {
    if (option == null) {
      setLocation("")
    } else {
      setLocation(option.value)
    }
  }

  function handleDateChange(date: Date | null) {
    if (date == null) return
    const stripDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    setDate(stripDate)
  }

  const convertTo24 = (timing: number) => {
    // if current time is 12pm and timing is 11, use 11
    // if current time is 1pm and timing is 0, use 12
    const currentTime = `${selectedTiming}${timingMode}`
    if (currentTime == "1pm" && timing == 0) {
      return 12
    } else if (timing == 12 && timingMode == "pm") {
      return 12
    } else if (timingMode == "pm") {
      return timing + 12
    } else {
      return timing
    }
  }

  async function handleSubmit(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (location == "" || date == null) return
    try {
      setIsLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contribute-location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          location: location, 
          day: date.getDay(),
          time: convertTo24(selectedTiming),
          updateCrowd: crowdLevel
        }),
        credentials: "include",
      })
  
      if (res.status == 200) {
        console.log("submission success!")
        setMsg("Thank you for contributing!")
        setSuccess(true)
        const data = await res.json()
      } else {
        console.log("submission failure!")
        setMsg("Submission failed. Try again!")
        setSuccess(false)
      }
      setIsLoading(false)
    } catch (error) {
      setMsg("Submission failed. Try again!")
      setSuccess(false)
      console.log(error)
      setIsLoading(false)
    }
  }

  let defaultLocation:Option | null = null
  const urlLoc = urlParams.get("location")
  if (urlLoc != null) {
    defaultLocation = { 
      value: urlLoc,
      label: urlLoc
    }
  }

  return (
    <div id={locStyles["locations-container"]}>
      <h1 style={{color: "white"}}>Locations</h1>
      <LocationPicker 
        defaultValue={defaultLocation} 
        handleChange={handleSingleOptionChange} 
      />
      <DatePicker startDate={new Date(urlParams.get("date") || new Date())} setStartDate={handleDateChange} />
      <div id={locStyles["time-contribute"]} style={{margin: "15px 0px 0px 0px"}}>
        <span style={{color: "white", marginRight: "10px"}}>Time: </span>
        <TimePicker 
          selectedTiming={selectedTiming}
          timingMode={timingMode}
          handleSelect={(timing: number) => setSelectedTiming(timing)}
          setTimingMode={(mode: string) => setTimingMode(mode)}
        />
      </div>
      <CrowdLevelPicker crowdLevel={crowdLevel} setCrowdLevel={(level: number) => setCrowdLevel(level)}/>
      <SubmitButton isLoading={isLoading} handleSubmit={handleSubmit} />
      <Button style={{marginTop: "10px"}} variant="dark" onClick={() => router.back()}>Back</Button>
      <Notif msg={msg} success={success} setMsg={setMsg} />
    </div>
  )
}