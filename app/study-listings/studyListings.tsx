export type StudyListing = {
  title:    string,
  desc:     string,
  tags:     string[],
  date:     string,
  freq:     string,
  interest: string,
  id:       number
}

function Tags({ tags } : Pick<StudyListing, 'tags'>) {
  let tagBoxes = tags.map((tag) => {
    return <span className="badge" key={tag}>{tag}</span>
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
  filters: string[][],
  data: {[id: string] : StudyListing}
}

export default function StudyListings({ filters, data } : StudyListingsProps) {
  const listings = Object.entries(data).map(([key, value]) => {
    // Check if listing has ALL the tags
    for (let i = 0; i < filters[0].length; i++) {
      if (!value.tags.includes(filters[0][i])) {
        return null
      }
    }
    // Check if listing might have the tag
    for (let i = 0; i < filters[1].length; i++) {
      if (value.tags.includes(filters[1][i])) {
        return <StudyCard {...value} />
      }
    }

    return null
  })

  return (
    <div className="container col-8" id="listing-container">
      <div className="row g-0 justify-content-evenly">
        {listings}
      </div>
    </div>
  )
}