import "./about.css";

interface ImageData {
  imgLink: string;
  imgAlt: string;
  imgID: string;
  webLink: string;
}

// Tech Stack Component
function TechLogo({ imgLink, imgAlt, imgID, webLink }: ImageData) {
  return (
    <a target="_blank" rel="noopener noreferrer" href={webLink} id={imgID}>
      <img src={imgLink} alt={imgAlt} className="logo" />
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

  return <div className="tech-container">{logos}</div>;
}

function TechStack() {
  return (
    <div className="tech-stacks">
      <p className="header tech-header"> This web app is powered by </p>
      <TechLogoBar />
    </div>
  );
}

export default function About() {
  return (
    <div style={{color: "white", padding: "10px"}}>
      <h1 className="about-header"> About GrindTogether </h1>
      <div className="motivation">
        <h2 className="header"> Our motivation </h2>
        <img
          src="images/motivation-pic.png"
          alt="motivation picture"
          id="motivation-pic"
        ></img>
        <div className="motivation-text">
          <p>
            {" "}
            Have you ever felt so lost in a certain module with very few friends
            to ask for help for this module? Well, many of us have certainly
            felt that way before and we all know how tough and demanding certain
            modules are. The thought of having to tackle a module alone,
            especially if it has a reputation of being difficult, is truly very
            frightening. We might also feel a bit lonely studying by ourselves.{" "}
          </p>

          <p>
            It would be comforting and beneficial if someone coping better with
            the module could offer their help and moral support, be it a senior
            with past experience or a fellow mod-taker. At least by finding
            people doing the same module we can learn from one another and find
            solace in each other. In university, where people come and go and
            everyone is busy with academics, it is hard for many of us to
            connect with others and moreover, find people to study with.
            Wouldn’t it be great if there existed a way (without the initial
            “approaching others in real life”) to see if others in NUS are
            willing to offer their help, or if you’re feeling kind, find those
            who need it?{" "}
          </p>

          <p>
            {" "}
            Our project wants to make it easier for everyone by providing a
            multifunctional platform, GrindTogether, which can be used to find
            groups of friends with similar modules to study together or even
            find study date partners (you never know what can happen... &#128064;
            &#128527;).
          </p>
        </div>
      </div>

      <div className="mission">
        <h2 className="header"> Our mission </h2>
        <p>
          {" "}
          We want to help fellow students in NUS have a better study experience
          and possibly even increase chances of finding a relationship in
          university by creating a platform where people can connect with each
          other and create their own study groups.
        </p>
      </div>

      <div className="brains-container">
        <h2 className="header"> The brains behind the operation </h2>
        <div className="creators">
          <div className="card" style={{ width: "18rem" }}>
            <img className="card-img-top" src="..." alt="Brain #1" />
            <div className="card-body">
              <h5 className="card-title"> Choo Tze Jie </h5>
              <p className="card-text">
                {" "}
                Year 1 noob Computer Science student at NUS{" "}
              </p>
            </div>
          </div>
          <div className="card" style={{ width: "18rem" }}>
            <img className="card-img-top" src="..." alt="Brain #2" />
            <div className="card-body">
              <h5 className="card-title"> Bryan Lee Jek Yan </h5>
              <p className="card-text">
                {" "}
                Year 1 top gae boi Computer Science student at NUS{" "}
              </p>
            </div>
          </div>
        </div>
      </div>

      <TechStack />
    </div>
  );
}
