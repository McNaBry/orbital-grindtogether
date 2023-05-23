export type StudyListing = {
  title:    string,
  desc:     string,
  tags:     { [key:string] : string[] },
  date:     string,
  freq:     string,
  interest: string,
  id:       number
}

function Tags({ tags } : Pick<StudyListing, 'tags'>) {
  let tagBoxes = Object.keys(tags).map((tagType) => {
    return tags[tagType].map(tag => {
      return <span className="badge" key={tag}>{tag}</span>
    })
  })

  return (
    <div className="tag-row">
      {tagBoxes}
    </div>
  )
}
  
function StudyCard(listingData : StudyListing) {
  const {title, desc, tags, date, freq, interest, id} = listingData
  return (
    <div className="card" key={id}>
      <div className="row g-0">
        <div className="col-6 col-md-3">
          <img src="images/terrace_pic.png" className="card-img img-fluid rounded-start" alt="No Image Available"/>
        </div>
        <div className="col-6 col-md-9">
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <Tags tags={tags}/>
            <p className="card-text">{desc}</p>
            <p className="card-text row" style={{marginTop: "auto"}}>
              <small className="text-body-secondary">{date}</small>
              <small className="text-body-secondary">{freq}</small>
              <small className="text-body-secondary">{interest} people interested</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

type StudyListingsProps = {
  filters: { [key:string] : string[] },
  data: {[id: string] : StudyListing}
}

export default function StudyListings({ filters, data } : StudyListingsProps) {
  const listings = Object.entries(data).map(([key, listing]) => {
    const categories = Object.keys(listing.tags)
    for (let i = 0; i < categories.length; i++) {
      const filterArr = filters[categories[i]]
      // No filters found for that category.
      if (filterArr.length == 0) continue
      for (let j = 0; j < filterArr.length; j++) {
        // Check if listing includes one of the filters in the current category.
        if (listing.tags[categories[i]].includes(filterArr[j])) break;
        // None of the tags are found in the current category of filters.
        else if (j == filterArr.length - 1) return null;
      }
    }

    return <StudyCard key={key} {...listing} />
  })

  return (
    <div className="container col-8" id="listing-container">
      <div className="row g-0 justify-content-evenly">
        {listings}
      </div>
    </div>
  )
}