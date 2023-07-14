import { useState } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"

interface SortDropdownButtonProps {
  optionsList: string[]
  handleOptionSelect: (option: string) => void
  title: string
}

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
        <Dropdown.Item key={index} onClick={() => handleSelect(option)}>
          {option}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  )
}

export default SortDropdownButton
