import { NextRequest, NextResponse } from 'next/server'
import { fetchCrmBookingStatus } from '@/lib/crm-booking'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params
  const orderId = parseInt(id, 10)
  const phone = new URL(request.url).searchParams.get('phone') || ''

  if (!orderId || phone.replace(/[^0-9]/g, '').length < 10) {
    return NextResponse.json({ error: 'phone required' }, { status: 400 })
  }

  try {
    const status = await fetchCrmBookingStatus(orderId, phone)
    return NextResponse.json({
      id: String(orderId),
      status: status.status,
      order_status: status.order_status,
      cast_name: status.cast_name,
      start_time: status.start_time,
    })
  } catch {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
}

/** 顧客側の時間提案承諾など — CRM 確定は管理画面で行う */
export async function PATCH(_request: NextRequest, { params }: Params) {
  const { id } = await params
  return NextResponse.json({
    success: true,
    id,
    message: 'CRM管理画面で確定処理を行います',
  })
}
