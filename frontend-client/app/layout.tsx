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
    <html lang="en" style={{width: "100%"}}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/> 
      <body style={{
        fontSize: "18px", 
        margin: "0px", 
        backgroundColor: "black", 
        width: "100%"
      }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
