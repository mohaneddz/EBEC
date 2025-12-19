import { NextResponse } from 'next/server'

export async function GET() {
  return new Response('Ping Received', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  })
}
