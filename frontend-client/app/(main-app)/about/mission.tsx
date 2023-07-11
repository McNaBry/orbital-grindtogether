import aboutStyles from "./about.module.css"

export default function Mission() {
  return (
    <div className={aboutStyles["mission"]}>
      <h2 className={aboutStyles["header"]}> Our mission </h2>
      <p className={aboutStyles["mission-text"]}>
        {" "}
        We want to help fellow students in NUS have a better study experience
        and possibly even increase chances of finding a relationship in
        university by creating a platform where people can connect with each
        other and create their own study groups.
      </p>
    </div>
  )
}