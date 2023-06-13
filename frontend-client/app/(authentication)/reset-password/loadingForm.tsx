'use client'

import { Card, Placeholder } from 'react-bootstrap'
 
export default function LoadingForm() {
  return (
    <>
      <Card.Title>Verifying code...</Card.Title>
      <Placeholder as={Card.Text} animation="glow">
        {/* Placeholder for email */}
        <Placeholder xs={5} /> <Placeholder xs={12} /> 
        {/* Placeholder for password */}
        <Placeholder xs={5} /> <Placeholder xs={12} /> 
      </Placeholder>
      <Placeholder.Button variant="primary" xs={6} />
    </>
  )
}