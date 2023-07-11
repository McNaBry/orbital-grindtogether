import NavBar from "./navigationBar"
import '../globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export const metadata = {
  title: 'GrindTogether',
  description: 'Study Invitation Web Application',
}

export default function MainAppLayout({
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
