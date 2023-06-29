'use client'

import { Container, Navbar, Nav } from 'react-bootstrap'
import { useAuth } from "../authProvider"
import navStyles from "./navigationBar.module.css"
import { useEffect, useState } from 'react'

function NavLink({ href, value } : { href: string, value: string}) {
  return (
    <Nav.Link className={navStyles["navBar-link"]} style={{color: "white"}} href={href}>{value}</Nav.Link>
  )
}

export default function NavigationBar() {

  const [ username, setUsername ] = useState<string>("Guest")
  useEffect(() => setUsername(window.localStorage.getItem("fullName") || "Guest"), [])

  return (
    <Navbar style={{backgroundColor: "black", marginBottom: "15px"}} bg="" expand="lg">
      <Container id={navStyles["nav-bar-container"]}>
        <Navbar.Brand href="/dashboard" style={{color: "white"}}>GrindTogether</Navbar.Brand>
        <Navbar.Toggle className={navStyles["toggler"]} aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav style={{color: "white"}} className="me-auto">
            <NavLink href={"/create-listing"} value={"Create Listing"} />
            <NavLink href={"/study-listings"} value={"View Listings"} />
            <NavLink href={"/profile-page"} value={"Profile Page"} />
            <NavLink href={"/about"} value={"About GT"} />
          </Nav>
          <Navbar.Text style={{color: "white", textAlign: "right"}}>Welcome, {username}</Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}