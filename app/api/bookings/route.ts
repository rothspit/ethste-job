import { NextRequest, NextResponse } from 'next/server'
import { createCrmBooking } from '@/lib/crm-booking'

const STORE_ID = parseInt(process.env.CRM_IDOL_STORE_ID || process.env.NEXT_PUBLIC_IDOL_STORE_ID || '2', 10)

interface CreateBookingRequest {
  cast: {
    id: string
    name: string
  }
  course: {
    name: string
    time: string
    price: number
  }
  startTime: string
  phone: string
  usePoints: boolean
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateBookingRequest = await request.json()

    if (!data.cast?.name || !data.startTime || !data.phone) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 },
      )
    }

    const courseMinutes = parseInt(data.course.time.replace(/[^0-9]/g, ''), 10) || 60
    const castId = /^\d+$/.test(data.cast.id) ? parseInt(data.cast.id, 10) : null

    const result = await createCrmBooking({
      storeId: STORE_ID,
      castName: data.cast.name,
      castId,
      courseMinutes,
      courseName: data.course.name,
      coursePrice: data.course.price,
      startTime: data.startTime,
      phone: data.phone,
      usePoints: data.usePoints,
      placeType: 'hotel',
      placeDetail: '詳細は確認後ご案内',
      notes: 'idolgakuen.jp /api/bookings',
    })

    return NextResponse.json({
      success: true,
      message: '予約リクエストを受け付けました',
      bookingId: String(result.orderId),
      orderId: result.orderId,
      orderNumber: result.orderNumber,
    })
  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '予約処理中にエラーが発生しました' },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'CRM管理画面で予約一覧を確認してください' },
    { status: 410 },
  )
}
