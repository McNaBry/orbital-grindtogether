import styles from "./create-listing.module.css"
import { Card } from 'react-bootstrap'

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
    <Card key={id} style={{color:"black"}}>
      <div className="row g-0">
        <div className="col-6 col-md-3">
          <Card.Img src="images/terrace_pic.png" className="img-fluid rounded-start" alt="No Image Available"/>
        </div>
        <div className="col-6 col-md-9">
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Tags tags={tags}/>
            <p className="card-text">{desc}</p>
            <Card.Text className="row" style={{marginTop: "auto"}}>
              <small className="text-body-secondary"> 
                <img src="/images/date.svg" className={styles["card-icon"]} /> {date}
              </small>
              <small className="text-body-secondary">{freq}</small>
              <small className="text-body-secondary">
                {interest} <img src="/images/person-interested.svg" className={styles["card-icon"]} /> interested
              </small>
            </Card.Text>
          </Card.Body>
        </div>
      </div>
    </Card>
  )
}