import 'react-datepicker/dist/react-datepicker.css'
import styles from './select.module.css'

import Select, { ActionMeta } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import DatePicker from 'react-datepicker'

/* Taken from react-select src/types.ts
export type ActionMeta<Option> =
  | SelectOptionActionMeta<Option>
  | DeselectOptionActionMeta<Option>
  | RemoveValueActionMeta<Option>
  | PopValueActionMeta<Option>
  | ClearActionMeta<Option>
  | CreateOptionActionMeta<Option>;
*/

export type Option = {
  value: string,
  label: string
}

interface SelectProps {
  name: string,
  type: string,
  options: Option[]
}

export type SelectFreeOptionProps = SelectProps & {
  defaultValue: Option | null,
  handleChange: 
    ((type:string, option: Option | null, actionMeta: ActionMeta<Option>) => void)
}

function SelectFreeOption({params} : {params : SelectFreeOptionProps}) {
  const { name, type, options, defaultValue, handleChange } = params

  return (
    <CreatableSelect 
      className={styles["single-option-input"]} 
      name={name}
      placeholder={name}
      isClearable
      defaultValue={defaultValue}
      options={options} 
      onChange={(option, actionMeta) => handleChange(type, option, actionMeta)} 
    />
  )
}

export type SelectSingleOptionProps = SelectProps & {
  defaultValue: Option | null
  handleChange:
    ((type:string, option: Option | null, actionMeta: ActionMeta<Option>) => void)
}

export function SelectSingleOption({params} : {params : SelectSingleOptionProps}) {
  const { name, type, options, defaultValue, handleChange } = params
  return (
    <Select
      className={"basic-single " + styles["single-option-input"]}
      name={name}
      placeholder={name}
      defaultValue={defaultValue}
      options={options}
      onChange={(option, actionMeta) => handleChange(type, option, actionMeta)}
    />
  )
}

export type SelectMultiOptionProps = SelectProps & {
  defaultValue: Option[]
  handleChange:
    ((type:string, option: readonly Option[], actionMeta: ActionMeta<Option>) => void)
}

function SelectMultiOption({params} : {params : SelectMultiOptionProps}) {
  const { name, type, options, defaultValue, handleChange } = params

  return (
    <Select
      className={"basic-multi-select " + styles["multi-option-input"]}
      name={name}
      placeholder={name}
      isMulti
      defaultValue={defaultValue}
      options={options}
      onChange={(option, actionMeta) => handleChange(type, option, actionMeta)}
    />
  )
}

export type DateOptionProps = {
  startDate: Date | null,
  setStartDate: (date: Date | null) => void
}

function DateOption({startDate, setStartDate} : DateOptionProps) {
  return (
    <div className={styles["date-option-container"]}>
      <DatePicker
        dateFormat="dd/MM/yyyy"
        className={styles["date-option-input"]}
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
    </div>
  )
}

export {
  SelectFreeOption,
  SelectMultiOption,
  DateOption
}