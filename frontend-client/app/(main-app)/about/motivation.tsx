import aboutStyles from "./about.module.css"

export default function Motivation() {
  return (
    <div id={aboutStyles["motivation-container"]}>
      <img
        src="images/lofi-girl-synthwave-boy.png"
        alt="motivation picture"
        id={aboutStyles["motivation-pic"]}
      ></img>
      <div className={aboutStyles["motivation-subcontainer"]}>
        <h2 id={aboutStyles["motivation-header"]}> Our motivation </h2>
        <div id={aboutStyles["motivation-text-container"]}>
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
    </div>
  )
}