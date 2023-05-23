import Link from "next/link"

export default function Home() {
  return (
    <main>
      <div>
        <h2>Welcome to GrindTogether!</h2>
        <p>Check out <Link href="sign-up">sign-in</Link> to see the about page</p>
      </div>
    </main>
  )
}
