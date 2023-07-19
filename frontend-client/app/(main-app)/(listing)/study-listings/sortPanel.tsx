"use client"

import { useState } from "react"
import { Dropdown, DropdownButton } from "react-bootstrap"
import viewStyles from "./studyListings.module.css"
import { StudyListing } from "../studyCard"

export type SortFunction = (a: StudyListing, b: StudyListing) => number

interface SortDropdownButtonProps {
  optionsList: string[]
  handleOptionSelect: (option: string) => void
  title: string
}

// Base component for dropdown
function SortDropdownButton({
  optionsList,
  handleOptionSelect,
  title,
}: SortDropdownButtonProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleSelect = (option: string) => {
    setSelectedOption(option)
    handleOptionSelect(option)
  }

  return (
    <DropdownButton
      id="sort-options"
      className="sort-options-button"
      title={selectedOption || title}
      variant="dark"
    >
      {optionsList.map((option, index) => (
        <Dropdown.Item key={index} 
          active={selectedOption == null ? option == title : (option == selectedOption)}
          onClick={() => handleSelect(option)}>
          {option}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  )
}

function SortOptionsButton({ setSortOption } : Pick<SortPanelProps, 'setSortOption'>) {
  const optionsList: {[key: string] : number} = {
    "date": 0,
    "creation date": 1,
    "creator": 2
  }

  return (
    <div className={viewStyles["sort-subcontainer"]}>
      <span style={{fontSize: "18px", color: "white", marginRight: "6px"}}>Sort by</span>
      <SortDropdownButton
        optionsList={Object.keys(optionsList)}
        handleOptionSelect={(option: string) => setSortOption(optionsList[option])}
        title="date"
      />
    </div>
  )
}

function SortDirectionButton({ setSortDirection } : Pick<SortPanelProps, 'setSortDirection'>) {
  const optionsList : { [key:string] : boolean } = {
    "ascending": false,
    "descending": true
  }

  return (
    <div className={viewStyles["sort-subcontainer"]} style={{marginTop: "6px"}}>
      <span style={{fontSize: "18px", color: "white", marginRight: "6px"}}>in</span>
      <SortDropdownButton
        optionsList={Object.keys(optionsList)}
        handleOptionSelect={(option: string) => setSortDirection(optionsList[option])}
        title="ascending"
      />
      <span style={{fontSize: "18px", color: "white", marginLeft: "6px"}}>order</span>
    </div>
  )
}

type SortPanelProps = {
  setSortOption: (index: number) => void,
  setSortDirection: (direction: boolean) => void
}

export default function SortPanel({ setSortOption, setSortDirection } : SortPanelProps) {
  return (
    <div id={viewStyles["sort-container"]}>
      <SortOptionsButton setSortOption={setSortOption} />
      <SortDirectionButton setSortDirection={setSortDirection} />
    </div>
  )
}
