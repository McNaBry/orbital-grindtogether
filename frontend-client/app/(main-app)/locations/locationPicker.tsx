import { SelectSingleOption, SelectSingleOptionProps } from "../(components)/select"
import { tagData } from "../(listing)/study-listings/data"
import locStyles from "./locations.module.css"

type LocationPickerProps = 
  Pick<SelectSingleOptionProps, 'defaultValue'> & 
  Pick<SelectSingleOptionProps, 'handleChange'>

export default function LocationPicker({ defaultValue, handleChange } :  LocationPickerProps) {
  return (
    <div id={locStyles["location-picker"]}>
      <SelectSingleOption 
        params={{
          name: "Location",
          type: "locations",
          options: tagData["locations"].map(value => ({value: value, label: value})),
          defaultValue: defaultValue,
          handleChange: handleChange
        }}
      />
    </div>
  )
}