import { NextRequest, NextResponse } from 'next/server'
import Cookies from 'universal-cookie'

// Using Next.js API routes to act as a proxy
// httpOnly cookies cannot be accessed on the browser using JS
// Hence, it must be done here on the server
export async function POST(request: NextRequest) {  
  const cookies = new Cookies()
  console.log("Token ID: ", cookies.get("tokenID"))
  const res = await fetch('http://localhost:5000/validate-token', {
    method: 'POST',
  }).then(response => {
    console.log(response.headers)
    return response
  })
  
  return NextResponse.json({verified: true});
}