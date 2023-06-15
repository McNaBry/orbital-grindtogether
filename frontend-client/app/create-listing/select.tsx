import Select, { ActionMeta } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import styles from './create-listing.module.css'

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
  handleChange: 
    ((type:string, option: Option | null, actionMeta: ActionMeta<Option>) => void)
}

function SelectFreeOption({params} : {params : SelectFreeOptionProps}) {
  const { name, type, options, handleChange } = params

  return (
    <CreatableSelect 
      className={styles["single-option-input"]} 
      name={name}
      isClearable
      options={options} 
      onChange={(option, actionMeta) => handleChange(type, option, actionMeta)} 
    />
  )
}

export type SelectMultiOptionProps = SelectProps & {
  handleChange:
    ((type:string, option: readonly Option[], actionMeta: ActionMeta<Option>) => void)
}

function SelectMultiOption({params} : {params : SelectMultiOptionProps}) {
  const { name, type, options, handleChange } = params
  
  return (
    <Select
      className={"basic-multi-select " + styles["multi-option-input"]}
      name={name}
      isMulti
      options={options}
      onChange={(option, actionMeta) => handleChange(type, option, actionMeta)}
    />
  )
}

export {
  SelectFreeOption,
  SelectMultiOption
}