import { NextRequest, NextResponse } from 'next/server'
import { createCrmBooking, fetchCrmBookingStatus } from '@/lib/crm-booking'

const STORE_ID = parseInt(process.env.CRM_TIARA_STORE_ID || '8', 10)

interface CreateBookingRequest {
  therapist: {
    id: string | number
    name: string
    crm_cast_id?: number
  }
  course: {
    name: string
    time: string
    price: number
  }
  startTime: string
  phone: string
  usePoints?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateBookingRequest = await request.json()

    if (!data.therapist?.name || !data.startTime || !data.phone) {
      return NextResponse.json({ error: '必須項目が不足しております' }, { status: 400 })
    }

    const courseMinutes = parseInt(data.course.time.replace(/[^0-9]/g, ''), 10) || 60
    const castId = data.therapist.crm_cast_id
      ?? (typeof data.therapist.id === 'number' ? data.therapist.id : null)

    const result = await createCrmBooking({
      storeId: STORE_ID,
      castName: data.therapist.name,
      castId: castId && Number.isFinite(castId) ? castId : null,
      courseMinutes,
      courseName: data.course.name,
      coursePrice: data.course.price,
      startTime: data.startTime,
      phone: data.phone,
      usePoints: data.usePoints,
      notes: 'idolgakuen.jp/tiara',
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
    console.error('[idol/tiara/bookings]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '予約処理中にエラーが発生いたしました' },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Use CRM dashboard' }, { status: 410 })
}
