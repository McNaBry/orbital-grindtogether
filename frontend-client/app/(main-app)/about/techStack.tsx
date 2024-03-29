"use client"

import { Card } from "react-bootstrap"
import aboutStyles from "./about.module.css"

interface ImageData {
  imgLink: string;
  imgAlt: string;
  imgID: string;
  webLink: string;
}

// Tech Stack Component
function TechLogo({ imgLink, imgAlt, imgID, webLink }: ImageData) {
  return (
    <a target="_blank" rel="noopener noreferrer" href={webLink} id={aboutStyles[imgID]}>
      <img src={imgLink} alt={imgAlt} className={aboutStyles["logo"]} />
    </a>
  );
}

function TechLogoBar() {
  const imgData = [
    ["images/react-logo.png", "React JS", "react-logo", "https://reactjs.org"],
    [
      "images/nextjs-logo.svg",
      "Next JS",
      "nextjs-logo",
      "https://vercel.com/solutions/nextjs",
    ],
    [
      "images/bootstrap-logo.png",
      "BootStrap 5",
      "bootstrap-logo",
      "https://getbootstrap.com/",
    ],
    [
      "images/nodejs-logo.png",
      "Node JS",
      "nodejs-logo",
      "https://nodejs.org/en/about",
    ],
    [
      "images/expressjs-logo.png", "Express JS", "expressjs-logo", "https://expressjs.com/",
    ],
    
    [
      "images/firebase-logo.svg",
      "Firebase",
      "firebase-logo",
      "https://firebase.google.com/",
    ],
    [
      "images/netlify-logo.png",
      "Netlify",
      "netlify-logo",
      "https://www.netlify.com/",
    ],
  ];

  const logos = imgData.map((data) => {
    return (
      <TechLogo
        key={data[2]}
        imgLink={data[0]}
        imgAlt={data[1]}
        imgID={data[2]}
        webLink={data[3]}
      />
    );
  });

  return (
    <div className={aboutStyles["tech-container"]}>
      <Card id={aboutStyles["tech-card"]}>{logos}
      </Card>
    </div>
  );
}

export default function TechStack() {
  return (
    <div className={aboutStyles["tech-stacks"]}>
      <p className={aboutStyles["tech-header"]}> This web app is powered by </p>
      <TechLogoBar />
    </div>
  );
}