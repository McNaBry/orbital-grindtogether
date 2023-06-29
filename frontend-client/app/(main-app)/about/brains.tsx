"use client"

import aboutStyles from "./about.module.css"
import { Card } from "react-bootstrap"

interface BrainsCardProps {
  name: string, 
  desc: string,
  img: string,
  alt: string
}

function BrainsCard({ name, desc, img, alt } : BrainsCardProps) {
  return (
    <Card className={aboutStyles["brains-card"]} style={{ width: "18rem" }}>
      <Card.Img variant="top" src={img} alt={alt} />
      <Card.Body>
        <Card.Title className={aboutStyles["brains-card-title"]}> {name} </Card.Title>
        <Card.Text className={aboutStyles["brains-card-text"]}> {desc} </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default function Brains() {
  return (
    <div id={aboutStyles["brains-container"]}>
      <h2 id={aboutStyles["brains-header"]}> The brains behind the operation </h2>
      <div id={aboutStyles["creators-container"]}>
        <BrainsCard
          name="Choo Tze Jie"
          desc="Year 1 noob Computer Science student at NUS"
          img="images/creator-1.png"
          alt="Brains #1" />
        <BrainsCard
          name="Bryan Lee Jek Yan"
          desc="Year 1 top gae boi Computer Science student at NUS"
          img="images/bryan-img.jpg"
          alt="Brains #2" />
      </div>
    </div>
  )
}