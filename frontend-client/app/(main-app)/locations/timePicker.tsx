import { Dropdown, DropdownButton } from "react-bootstrap"
import locStyles from "./locations.module.css"

type TimePickerProps = {
  selectedTiming: number | null,
  timingMode: string,
  handleSelect: (timing: number) => void, 
  setTimingMode: (mode: string) => void
}

export default function TimePicker({ selectedTiming, timingMode, handleSelect, setTimingMode } : TimePickerProps) {
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