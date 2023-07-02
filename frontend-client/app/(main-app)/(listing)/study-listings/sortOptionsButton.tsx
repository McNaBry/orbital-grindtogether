import SortDropdownButton from "./sortDropdownButton"

function SortOptionsButton({handleOptionSelect}) {
  const optionsList = [
    {label : "Sort by date when study session takes place"},
    {label: "Sort by date when study listing was created"}
  ]

  return (
    <SortDropdownButton
      optionsList={optionsList.map((option) => option.label)}
      handleOptionSelect={handleOptionSelect}
      title="Sort by"
    />
  )
}

export default SortOptionsButton
