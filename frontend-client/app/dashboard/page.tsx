"use client"

import styles from "./dashboard.module.css"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function DashboardActionBar() {
  return (
    <Navbar bg="" expand="lg">
      <Container>
        <Navbar.Brand>Possible Actions</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="create-listing">Create Listing</Nav.Link>
            <Nav.Link href="study-listings">View Listings</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default function Dashboard() {
  return (
    <div id={styles["dashboard-container"]}>
      <h1 style={{textAlign:"center"}}>Dashboard</h1>
      <DashboardActionBar />
    </div>
  )
}