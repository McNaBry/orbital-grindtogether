'use client'

import { Container, Navbar, Nav } from 'react-bootstrap'
import navStyles from "./navigationBar.module.css"
import { useEffect, useState } from 'react'
import Link from 'next/link'

function NavLink({ href, value } : { href: string, value: string}) {
  return (
    <Nav.Link className={navStyles["navBar-link"]} style={{color: "white"}} href={href}>{value}</Nav.Link>
  )
}

export default function NavigationBar() {
  const [ username, setUsername ] = useState<string>("Guest")
  useEffect(() => setUsername(window.localStorage.getItem("fullName") || "Guest"), [])

  return (
    <Navbar data-bs-theme="dark" style={{backgroundColor: "black", marginBottom: "15px"}} bg="" expand="xl">
      <Container id={navStyles["nav-bar-container"]}>
        <Navbar.Brand href="/dashboard" style={{color: "white"}}>GrindTogether</Navbar.Brand>
        <Navbar.Toggle className={navStyles["toggler"]} aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav style={{color: "white"}} id={navStyles["nav-link-container"]} className="me-auto">
            <NavLink key="1" href={"/create-listing"} value={"Create Listing"} />
            <NavLink key="2" href={"/study-listings"} value={"View Listings"} />
            <NavLink key="3" href={"/locations"} value={"Locations"} />
            <NavLink key="4" href={"/profile-page"} value={"Profile Page"} />
            <NavLink key="5" href={"/about"} value={"About GT"} />
          </Nav>
          { username == "Guest"
            ? <Navbar.Text id={navStyles["guest-sign-in"]}>
                <Link style={{color: "white", textDecoration: "none"}} href="/sign-in">Sign In</Link>
              </Navbar.Text> 
            : <Navbar.Text style={{color: "white", textAlign: "right"}}>Welcome, {username}</Navbar.Text>          
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
