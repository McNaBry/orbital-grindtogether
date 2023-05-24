import "./start.css"
import Link from "next/link"

export default function Start() {
  return (
    <main>
      <div id="start-container">
        <h2 id="header">GrindTogether.</h2>
        <h5 id="sub-header">Study. Chill. Make Friends.</h5>
        <div id="sign-container">
          <div className="sign-link">
            <Link href="sign-in" style={{textDecoration:"none"}}>Sign-in</Link>
          </div>
          <div className="sign-link">
            <Link href="sign-up" style={{textDecoration:"none"}}>Sign-up</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
