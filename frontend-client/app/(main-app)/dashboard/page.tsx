'use client'

import styles from './dashboard.module.css'

import { Container, Row } from 'react-bootstrap'

export default function Dashboard() {
  return (
    <Container id={styles["dashboard-container"]}>
      <h1 style={{textAlign:"center"}}>Dashboard</h1>
      <Row>
        <div className="col-6">
          <h3 style={{textAlign:"center"}}>Your Liked Listings</h3>
        </div>
        <div className="col-6">
          <h3 style={{textAlign:"center"}}>Your Created Listings</h3>
        </div>
      </Row>
    </Container>
  )
}