"use client"

import { useState } from "react"
import { Row } from "react-bootstrap"
import TimePicker from "./timePicker"
import locStyles from "./locations.module.css"

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
      <>
        <span 
          style={{marginBottom: "10px", background: colors[parseInt(level[0])]}} 
          className={locStyles["timing-data"]}>
            {levels[parseInt(level[0])]}
        </span>

        <span 
          style={{background: colors[parseInt(level[1])]}} 
          className={locStyles["timing-data"]}>
            {levels[parseInt(level[1])]}
        </span>
      </>
    )
  }


  return (
    <Row id={locStyles["timings"]}>
      <div className={"col-4 " + locStyles["timing-data-container"]}>
        { selectedTiming == 12 && timingMode == "am"
          ? "--"
          : <>
              {getTiming(selectedTiming - 1)}
              {getCrowdLevel(selectedTiming - 1)}
            </>
        }
      </div>

      <div className={"col-4 " + locStyles["timing-data-container"]}>
        {getTiming(selectedTiming)}
        {getCrowdLevel(selectedTiming)}
      </div>

      <div className={"col-4 " + locStyles["timing-data-container"]}>
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
  location: string,
  crowdLevels: {[id: string] : string}, 
  date: Date
}
export default function CrowdLevels({ isLoading, location, crowdLevels, date } : CrowdLevelsProps) {
  let hours = new Date().getHours()
  if (hours == 0) hours = 12
  else hours = hours % 12
  const [ selectedTiming, setSelectedTiming ] = useState<number>(hours)
  const [ timingMode, setTimingMode ] = useState<string>(new Date().getHours() > 12 ? "pm" : "am")

  if (isLoading) {
    return <></>
  }

  function handleSelect(timing: number) {
    setSelectedTiming(timing)
  }

  return (
    <div id={locStyles["crowd-levels"]}>
      <p style={{textAlign: "center", color: "white", margin: "25px 0px 10px 0px"}}>
        Expected Crowd Levels for {date.toDateString()} ({location})
      </p>
      <TimePicker 
        selectedTiming={selectedTiming}
        timingMode={timingMode}
        handleSelect={handleSelect}
        setTimingMode={(mode: string) => setTimingMode(mode)}
      />
      <div id={locStyles["crowd-tool-tip"]}>
        <span 
          style={{color: "white", marginBottom: "5px", textAlign: "center"}}>
            Legend:
        </span>
        <span 
          style={{background: "grey", marginBottom: "5px", textAlign: "center"}} 
          className={locStyles["timing-data"]}>
            From GrindTogether
        </span>
        <span 
          style={{background: "grey", textAlign: "center"}} 
          className={locStyles["timing-data"]}>
            From Users Contributions
        </span>
      </div>
      <Timings selectedTiming={selectedTiming} timingMode={timingMode} crowdLevels={crowdLevels} />
    </div>
  )
}