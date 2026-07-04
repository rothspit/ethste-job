import { NextRequest, NextResponse } from 'next/server'

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { error: 'deprecated', message: 'Supabase email webhook disabled. Use CRM for cast content.' },
    { status: 410 },
  )
}
