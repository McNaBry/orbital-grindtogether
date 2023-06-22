import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'

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
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/> 
      <body>{children}</body>
    </html>
  )
}
