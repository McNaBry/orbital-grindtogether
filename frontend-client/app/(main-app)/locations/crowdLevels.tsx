"use client"

import { useState } from "react"
import { Dropdown, DropdownButton, Row } from "react-bootstrap"
import locStyles from "./locations.module.css"

type TimePickerProps = {
  selectedTiming: number | null,
  timingMode: string,
  handleSelect: (timing: number) => void, 
  setTimingMode: (mode: string) => void
}
function TimePicker({ selectedTiming, timingMode, handleSelect, setTimingMode } : TimePickerProps) {
  const timings = []
  for (let i = 0; i < 12; i++) {
    timings.push(i + 1)
  }

  return (
    <div id={locStyles["time-picker"]}>
      <DropdownButton 
        id="dropdown-button" 
        className={locStyles["timing-button"]} 
        title={selectedTiming || "Select a timing"}
        variant="dark"
      >
        { timings.map(timing => {
          return (
            <Dropdown.Item key={timing} onClick={() => handleSelect(timing)}>
              {timing}
            </Dropdown.Item>
          )
        })}
      </DropdownButton>
      <DropdownButton 
        id="dropdown-button" 
        className={locStyles["timing-mode-button"]} 
        title={timingMode}
        variant="dark"
        style={{marginLeft: "5px"}}
      >
        <Dropdown.Item key="am" onClick={() => setTimingMode("am")}>am</Dropdown.Item>
        <Dropdown.Item key="pm" onClick={() => setTimingMode("pm")}>pm</Dropdown.Item>
      </DropdownButton>
    </div>
  )
}

const levels = ["no data", "low", "moderate", "busy", "very busy"]
const colors = ["grey", "#19a974", "#61bb00", "#ff6300", "#e7040f"]

type TimingsProps = {
  selectedTiming: number, 
  timingMode: string,
  crowdLevels: {[id: string] : string},
}
function Timings({ selectedTiming, timingMode, crowdLevels } : TimingsProps) {
  const length = Object.keys(crowdLevels).length
  const getTiming = (timing: number) => {
    // if current time is 1am and timing is 0, return 12am
    // if current time is 12pm and timing is 11, return 11am
    // if current time is 1pm and timing is 0, return 12pm
    const currentTime = `${selectedTiming}${timingMode}`
    if (currentTime == "1am" && timing == 0) return "12am"
    else if (currentTime == "12pm" && timing == 11) return "11am"
    else if (currentTime == "1pm" && timing == 0) return "12pm"
    else return `${timing}${timingMode}`
  }

  const getCrowdLevel = (timing: number) => {
    if (length != 24) return <div>--</div>
    // if current time is 12pm and timing is 11, use 11
    // if current time is 1pm and timing is 0, use 12
    const currentTime = `${selectedTiming}${timingMode}`
    let level = ['0','0']
    if (currentTime == "1pm" && timing == 0) {
      level = crowdLevels["12"].split(",")
    } else if (timing == 12 && timingMode == "pm") {
      level = crowdLevels["12"].split(",")
    } else if (timingMode == "pm") {
      level = crowdLevels[(timing + 12).toString()].split(",")
    } else {
      level = crowdLevels[timing.toString()].split(",")
    }
    
    return (
      <div className={locStyles["timing-data-container"]}>
        <div style={{width: "100%", margin: "10px 0px 15px 0px"}}>
          <span 
            style={{background: colors[parseInt(level[0])]}} 
            className={locStyles["timing-data"]}>
              {levels[parseInt(level[0])]}
            </span>
        </div>
        <div style={{width: "100%"}}>
          <span 
            style={{background: colors[parseInt(level[1])]}} 
            className={locStyles["timing-data"]}>
              {levels[parseInt(level[1])]}
            </span>
        </div>
      </div>
    )
  }


  return (
    <Row id={locStyles["timings"]}>
      <div className={"col-4 " + locStyles["timing"]}>
        { selectedTiming == 12 && timingMode == "am"
          ? "--"
          : <>
              {getTiming(selectedTiming - 1)}
              {getCrowdLevel(selectedTiming - 1)}
            </>
        }
      </div>

      <div className={"col-4 " + locStyles["timing"]}>
        {getTiming(selectedTiming)}
        {getCrowdLevel(selectedTiming)}
      </div>

      <div className={"col-4 " + locStyles["timing"]}>
        { selectedTiming == 11 && timingMode == "pm" 
          ? "--"
          : <>
              {getTiming((selectedTiming + 1) % 12)}
              {getCrowdLevel((selectedTiming + 1) % 12)}
            </>
        }
      </div>
    </Row>
  )
}

type CrowdLevelsProps = {
  isLoading: boolean, 
  crowdLevels: {[id: string] : string}, 
  date: Date
}
export default function CrowdLevels({ isLoading, crowdLevels, date } : CrowdLevelsProps) {
  const [ selectedTiming, setSelectedTiming ] = useState<number>(new Date().getHours() % 12)
  const [ timingMode, setTimingMode ] = useState<string>(new Date().getHours() > 12 ? "pm" : "am")

  if (isLoading) {
    return <></>
  }

  function handleSelect(timing: number) {
    setSelectedTiming(timing)
  }

  const getTiming = (timing: number) => {
    return timing > 12
      ? `${timing % 12}pm`
      : `${timing}${timingMode}`
  }

  return (
    <div id={locStyles["crowd-levels"]}>
      <p style={{textAlign: "center", color: "white", margin: "25px 0px 10px 0px"}}>
        Expected Crowd Levels for {date.toDateString()}
      </p>
      <TimePicker 
        selectedTiming={selectedTiming}
        timingMode={timingMode}
        handleSelect={handleSelect}
        setTimingMode={(mode: string) => setTimingMode(mode)}
      />
      <Timings selectedTiming={selectedTiming} timingMode={timingMode} crowdLevels={crowdLevels} />
    </div>
  )
}