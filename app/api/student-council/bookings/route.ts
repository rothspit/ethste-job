import { NextRequest, NextResponse } from 'next/server'
import { createCrmBooking, fetchCrmBookingStatus } from '@/lib/crm-booking'

const STORE_ID = parseInt(process.env.CRM_IDOL_STORE_ID || process.env.NEXT_PUBLIC_IDOL_STORE_ID || '2', 10)

type Body = {
  therapist?: { id?: string | number; name?: string; crm_cast_id?: number }
  cast?: { id?: string | number; name?: string }
  course?: { name?: string; time?: string; price?: number }
  startTime?: string
  phone?: string
  usePoints?: boolean
}

function parseBody(data: Body) {
  const cast = data.therapist || data.cast
  const castName = cast?.name?.trim() || ''
  const phone = data.phone?.replace(/[^0-9]/g, '') || ''
  const course = data.course
  const courseMinutes = parseInt((course?.time || '60').replace(/[^0-9]/g, ''), 10) || 60

  const castIdRaw = (data.therapist?.crm_cast_id ?? cast?.id) as string | number | undefined
  const castId = typeof castIdRaw === 'number'
    ? castIdRaw
    : castIdRaw && /^\d+$/.test(String(castIdRaw))
      ? parseInt(String(castIdRaw), 10)
      : null

  return { castName, phone, course, courseMinutes, castId }
}

export async function POST(request: NextRequest) {
  try {
    const data: Body = await request.json()
    const { castName, phone, course, courseMinutes, castId } = parseBody(data)

    if (!castName || !data.startTime || phone.length < 10) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 })
    }

    const result = await createCrmBooking({
      storeId: STORE_ID,
      castName,
      castId,
      courseMinutes,
      courseName: course?.name || `${courseMinutes}分`,
      coursePrice: course?.price || 0,
      startTime: data.startTime,
      phone,
      usePoints: data.usePoints,
      placeType: 'hotel',
      placeDetail: '詳細は確認後ご案内',
      notes: 'idolgakuen.jp 学級委員長',
    })

    return NextResponse.json({
      success: true,
      message: 'ご予約リクエストを承りました',
      bookingId: String(result.orderId),
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      status: result.status,
    })
  } catch (error) {
    console.error('[student-council/bookings]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '予約処理中にエラーが発生しました' },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = parseInt(searchParams.get('orderId') || '', 10)
  const phone = searchParams.get('phone') || ''
  if (!orderId || phone.replace(/[^0-9]/g, '').length < 10) {
    return NextResponse.json({ error: 'orderId and phone required' }, { status: 400 })
  }

  try {
    const status = await fetchCrmBookingStatus(orderId, phone)
    return NextResponse.json({ booking: status })
  } catch (e) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
}
