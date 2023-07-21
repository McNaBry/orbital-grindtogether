import { Placeholder, Row, Card } from "react-bootstrap"
import loadingStyles from "./loading-card.module.css"

export default function LoadingStudyCard() {
  return (
    <Card id={loadingStyles["card-container"]}>
      <Row className="g-0">
        <div className="col-12 col-sm-6 col-md-3">
          <div id={loadingStyles["card-img"]}></div>
        </div>
        <div className="col-12 col-sm-6 col-md-9">
          <Card.Body>
            {/* Card Title */}
            <Placeholder as={Card.Title} animation="glow"><Placeholder xs={6} /></Placeholder>
            {/* Created Date */}
            <Placeholder as="small" animation="glow"><Placeholder xs={2} /></Placeholder>
            <br></br>
            {/* Tag Row */}
            <Placeholder animation="glow">
              <Placeholder xs={2} /> <Placeholder xs={2} /> <Placeholder xs={2}/>
            </Placeholder>

            {/* Card Description */}
            <Placeholder as={Card.Text} animation="glow"><Placeholder xs={12} /></Placeholder>
            <Card.Text className="row" style={{marginTop: "auto"}}>
              {/* Info Bar */}
              <Placeholder as="small" animation="glow"><Placeholder xs={4} /></Placeholder>
              <Placeholder as="small" animation="glow"><Placeholder xs={4} /></Placeholder>
              <Placeholder as="small" animation="glow"><Placeholder xs={4} /></Placeholder>
              {/* Like Button */}
            </Card.Text>
            <Placeholder.Button variant="dark" xs={3} />
          </Card.Body>
        </div>
      </Row>
    </Card>
  )
}