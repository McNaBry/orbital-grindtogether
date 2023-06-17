import cardStyles from "./studyCard.module.css"
import { Row, Card } from 'react-bootstrap'
import dayjs from 'dayjs'
import LikeButton from './study-listings/likeButton'

export type StudyListing = {
  createdBy: string,
  title:     string,
  desc:      string,
  tags:      { [key:string] : string[] },
  date:      Date | null,
  freq:      string,
  interest:  number,
  id:        string
}

function Tags({ tags } : Pick<StudyListing, 'tags'>) {
  const keys = ["modules", "locations", "faculties"]
  let tagBoxes = keys.map((key) => {
    return tags[key].map(tag => {
      return <span className={"badge " + cardStyles[key] + " " + cardStyles["tag"]} key={tag}>{tag}</span>
    })
  })

  return (
    <div className={cardStyles["tag-row"]}>
      {tagBoxes}
    </div>
  )
}
  
export default function StudyCard(listingData : StudyListing) {
  const {createdBy, title, desc, tags, date, freq, interest, id} = listingData
  return (
    <Card key={id} style={{color:"black"}}>
      <Row className="g-0">
        <div className="col-6 col-md-3">
          <Card.Img 
            src="images/terrace_pic.png" 
            className={"img-fluid rounded-start " + cardStyles["card-img"]} 
            alt="No Image Available"/>
        </div>
        <div className="col-6 col-md-9">
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Tags tags={tags}/>
            <Card.Text>{desc}</Card.Text>
            <Card.Text className="row" style={{marginTop: "auto"}}>
              <small className="text-body-secondary"> 
                <img src="/images/date.svg" 
                  className={cardStyles["card-icon"]} /> 
                {date ? dayjs(date).format('DD/MM/YYYY') : "No date given"}
              </small>
              <small className="text-body-secondary">{freq}</small>
              <small className="text-body-secondary">
                {interest} 
                <img src="/images/person-interested.svg" 
                  className={cardStyles["card-icon"]} /> 
                interested
              </small>
              <small>Created by {createdBy}</small>
              {/* <LikeButton /> */}
            </Card.Text>
          </Card.Body>
        </div>
      </Row>
    </Card>
  )
}