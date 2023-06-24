import NavBar from "./navigationBar"
import "../globals.css"

export const metadata = {
  title: 'GrindTogether',
  description: 'Study Invitation Web Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavBar />
      <section>{children}</section>
    </>
  )
}
