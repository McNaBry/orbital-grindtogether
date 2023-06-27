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
    [
      "images/html5-logo.png",
      "HTML 5",
      "html-logo",
      "https://developer.mozilla.org/en-US/docs/Web/HTML",
    ],
    ["images/react-logo.png", "React JS", "react-logo", "https://reactjs.org"],
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
      "images/nextjs-logo.png",
      "Next JS",
      "nextjs-logo",
      "https://vercel.com/solutions/nextjs",
    ],
    [
      "images/firebase-logo.png",
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

  return <div className={aboutStyles["tech-container"]}>{logos}</div>;
}

export default function TechStack() {
  return (
    <div className={aboutStyles["tech-stacks"]}>
      <p className={aboutStyles["tech-header"]}> This web app is powered by </p>
      <TechLogoBar />
    </div>
  );
}