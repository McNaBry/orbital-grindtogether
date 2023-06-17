import StudyCard, { StudyListing } from "../studyCard"

type StudyListingsProps = {
  page: number, 
  limit: number,
  filters: { [key:string] : string[] },
  data: StudyListing[]
}

export default function StudyListings({ page, limit, filters, data } : StudyListingsProps) {
  if (data.length == 0 || data == null) return (<h1>Data null error</h1>)

  const filterData = data.filter(listing => {
    const categories = Object.keys(listing.tags)
    for (let i = 0; i < categories.length; i++) {
      const filterArr = filters[categories[i]]
      // No filters found for that category.
      if (filterArr.length == 0) continue
      for (let j = 0; j < filterArr.length; j++) {
        // Check if listing includes one of the filters in the current category.
        if (listing.tags[categories[i]].includes(filterArr[j])) break
        // None of the tags are found in the current category of filters.
        else if (j == filterArr.length - 1) return false
      }
    }

    return true
  })

  const listings = filterData.map((listing) => {
    return <StudyCard key={listing["id"]} {...listing} />
  })

  return (
    <div className="container col-8" id="listing-container">
      <div className="row g-0 justify-content-evenly">
        {listings.slice((page - 1) * limit, page * limit)}
      </div>
    </div>
  )
}