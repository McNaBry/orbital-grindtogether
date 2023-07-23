import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
    credentials: "include"
  })

  const resData = await res.json()
  let response = NextResponse.json({fullName: resData.fullName}, { status: 200})
  if (res.status == 200) {
    response.cookies.set({
      name: 'authCookie',
      value: resData.seshCookie,
      domain: "netlify.app",
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "lax"
    })
    response.cookies.set({
      name: 'uid',
      value: resData.uid,
      domain: "netlify.app",
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "lax"
    })
  } else {
    return NextResponse.json({}, { status: 400 })
  }
  
  return response
}