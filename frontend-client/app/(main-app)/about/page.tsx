import aboutStyles from "./about.module.css";
import Motivation from "./motivation";
import Mission from "./mission";
import Brains from "./brains";
import TechStack from "./techStack";

export default function About() {
  return (
    <div id={aboutStyles["about-page"]}>
      <div id={aboutStyles["about-bg"]} />
      <h1 id={aboutStyles["about-header"]}> About GrindTogether </h1>
      <Motivation />
      <Mission />
      <Brains />
      <TechStack />
    </div>
  );
}
