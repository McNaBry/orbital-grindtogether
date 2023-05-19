import './study_listing.css'

type StudyListing = {
  title:    string,
  desc:     string,
  tags:     string[],
  date:     string,
  freq:     string,
  interest: string
}

const data : { [id: string] : StudyListing } = {
  invite_1: {
    title:    "Study @ Terrace",
    desc:     "Let's have some fun grinding together!",
    tags:     ["CS2040S", "COM3", "SOC"],
    date:     "24/10/2023",
    freq:     "Every Week",
    interest: "20"
  },

  invite_2: {
    title:    "Study @ Basement1",
    desc:     "Seeking for people willing to carry my assignment",
    tags:     ["CS1231S", "COM3", "SOC"],
    date:     "24/10/2023",
    freq:     "Every Week",
    interest: "0"
  },

  invite_3: {
    title:    "Study @ ASL2",
    desc:     "Anyone wants to be my study date?",
    tags:     ["CS3230", "COM3", "Study-Date", "SOC"],
    date:     "25/10/2023",
    freq:     "Once",
    interest: "2"
  }
}

function Tags({ tags } : Pick<StudyListing, 'tags'>) {
  let tagBoxes = tags.map((tag) => {
    return <span className="badge">{tag}</span>
  })

  return (
    <div className="tag-row">
      {tagBoxes}
    </div>
  )
}

function StudyCard(listingData : StudyListing) {
  const {title, desc, tags, date, freq, interest} = listingData
  return (
    <div className="card">
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

export default function StudyListings() {
  const listings = Object.entries(data).map(([_, value]) => {
      return <StudyCard {...value} />
  })
  return (
    <>
      <div className="container">
        <h1>Study Listings</h1>
      </div>
      <div className="container" id="listing-container">
        <div className="row g-0 justify-content-evenly">
            {listings}
        </div>
      </div>
    </>
  )
}