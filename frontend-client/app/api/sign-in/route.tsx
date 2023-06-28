import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import { NextRequest, NextResponse } from 'next/server'

// Using Next.js API routes to act as a proxy
// httpOnly cookies cannot be accessed on the browser using JS
// Hence, it must be done here on the server
export async function POST(request: NextRequest) {
  const data = await request.json()
  
  const res = await fetch(`${process.env.API_URL}/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  }).then(response => {
    const cookies = new RequestCookies(response.headers)
    console.log(cookies)
    return response
  })
  
  return NextResponse.json({});
}