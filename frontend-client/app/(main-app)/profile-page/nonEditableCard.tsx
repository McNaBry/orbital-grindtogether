"use client"

import { Card, Placeholder } from "react-bootstrap"

interface CardProps {
  isLoading: boolean;
  title: string;
  children: React.ReactNode;
}

function NonEditableCard({ isLoading, title, children }: CardProps) {
  return (
    <Card className="card">
      <Card.Body className="card-body">
        <Card.Title className="card-title">{title}</Card.Title>
        { isLoading 
          ? <Placeholder as={Card.Text} animation="glow"><Placeholder xs={12}/></Placeholder>
          : <> {children} </> 
        }
      </Card.Body>
    </Card>
  );
}

export default NonEditableCard;
