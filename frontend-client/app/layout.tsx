import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import AuthProvider from './authProvider'

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
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
