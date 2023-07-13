import SortDropdownButton from "./sortDropdownButton"

function SortOptionsButton() {
  const handleOptionSelect = (option: string) => {
    
  }

  const optionsList = [
    "Sort by date when study session takes place",
    "Sort by date when study listing was created"
  ]

  return (
    <SortDropdownButton
      optionsList={optionsList}
      handleOptionSelect={handleOptionSelect}
      title="Sort by"
    />
  )
}

export default SortOptionsButton
