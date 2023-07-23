import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {  
  let response = NextResponse.json({}, { status: 200 })
  response.cookies.delete('authCookie')
  response.cookies.delete('uid')
  return response
}