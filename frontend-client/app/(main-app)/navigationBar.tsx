'use client'

import { Container, Navbar, Nav } from 'react-bootstrap'
import navStyles from "./navigationBar.module.css"

function NavLink({ href, value } : { href: string, value: string}) {
  return (
    <Nav.Link style={{color: "white"}} href={href}>{value}</Nav.Link>
  )
}

export default function NavigationBar() {
    return (
      <Navbar style={{backgroundColor: "indigo", marginBottom: "10px"}} bg="" expand="lg">
        <Container id={navStyles["nav-bar-container"]}>
          <Navbar.Brand href="dashboard" style={{color: "white"}}>GrindTogether</Navbar.Brand>
          <Navbar.Toggle className={navStyles["navbar-toggler"]} aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav style={{color: "white"}} className="me-auto">
              <NavLink href={"create-listing"} value={"Create Listing"} />
              <NavLink href={"study-listings"} value={"View Listings"} />
              <NavLink href={"profile-page"} value={"Profile Page"} />
              <NavLink href={"about"} value={"About GT"} />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }