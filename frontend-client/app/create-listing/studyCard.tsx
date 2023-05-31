import styles from "./create-listing.module.css"

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
      return <span className={"badge " + styles[tagType] + " " + styles["tag"]} key={tag}>{tag}</span>
    })
  })

  return (
    <div className={styles["tag-row"]}>
      {tagBoxes}
    </div>
  )
}
  
export default function StudyCard(listingData : StudyListing) {
  const {title, desc, tags, date, freq, interest, id} = listingData
  return (
    <div className="card" key={id} style={{color:"black"}}>
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