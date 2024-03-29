import { DateOption, DateOptionProps } from "../(components)/select"
import locStyles from "./locations.module.css"

export default function DatePicker({ startDate, setStartDate } :  DateOptionProps) {
  return (
    <div className={locStyles["location-picker"]}>
      <DateOption 
        startDate={startDate}
        setStartDate={setStartDate}
      />
    </div>
  )
}