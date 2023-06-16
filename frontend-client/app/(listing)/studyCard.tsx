import cardStyles from "./studyCard.module.css"
import { Row, Card } from 'react-bootstrap'
import dayjs from 'dayjs'
import LikeButton from './study-listings/likeButton'

export type StudyListing = {
  title:    string,
  desc:     string,
  tags:     { [key:string] : string[] },
  date:     Date | null,
  freq:     string,
  interest: number,
  id:       number
}

function Tags({ tags } : Pick<StudyListing, 'tags'>) {
  let tagBoxes = Object.keys(tags).map((tagType) => {
    return tags[tagType].map(tag => {
      return <span className={"badge " + cardStyles[tagType] + " " + cardStyles["tag"]} key={tag}>{tag}</span>
    })
  })

  return (
    <div className={cardStyles["tag-row"]}>
      {tagBoxes}
    </div>
  )
}
  
export default function StudyCard(listingData : StudyListing) {
  const {title, desc, tags, date, freq, interest, id} = listingData
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
            <p className="card-text">{desc}</p>
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
              <LikeButton />
            </Card.Text>
          </Card.Body>
        </div>
      </Row>
    </Card>
  )
}