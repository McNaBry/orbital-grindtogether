import SortDropdownButton from "./sortDropdownButton"

function SortDirectionButton() {
  const handleOptionSelect = (option: string) => {
    
  }

  const optionsList = [
    "Ascending",
    "Descending"
  ]

  return (
    <SortDropdownButton
      optionsList={optionsList}
      handleOptionSelect={handleOptionSelect}
      title="Direction"
    />
  )
}

export default SortDirectionButton