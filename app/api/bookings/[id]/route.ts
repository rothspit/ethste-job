import { NextRequest, NextResponse } from 'next/server'
import { fetchCrmBookingStatus } from '@/lib/crm-booking'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const orderId = parseInt(id, 10)
  const phone = new URL(request.url).searchParams.get('phone') || ''

  if (!orderId || phone.replace(/[^0-9]/g, '').length < 10) {
    return NextResponse.json({ error: 'phone required' }, { status: 400 })
  }

  try {
    const status = await fetchCrmBookingStatus(orderId, phone)
    return NextResponse.json({ booking: status })
  } catch {
    return NextResponse.json({ error: '予約が見つかりません' }, { status: 404 })
  }
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'deprecated', message: 'CRM管理画面で確定してください' },
    { status: 410 },
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'deprecated', message: 'CRM管理画面でキャンセルしてください' },
    { status: 410 },
  )
}
