import React from "react";

interface CardProps {
  title: string;
  children: React.ReactNode;
}

function NonEditableCard({ title, children }: CardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        {children}
      </div>
    </div>
  );
}

export default NonEditableCard;
