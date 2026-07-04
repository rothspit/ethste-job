/** CRM 予約 API クライアント（サーバー側 Next.js route 用） */

export const CRM_BASE = (process.env.CRM_API_URL || 'https://crm.st-online.jp').replace(/\/$/, '')

export type BookingPayload = {
  storeId: number
  castName: string
  castId?: number | null
  courseMinutes: number
  courseName: string
  coursePrice: number
  startTime: string
  phone: string
  customerName?: string
  usePoints?: boolean
  placeType?: 'home' | 'hotel' | 'meetup'
  placeDetail?: string
  notes?: string
}

export function parseStartTime(startTime: string): { date: string; inTime: string | null } {
  const trimmed = startTime.trim()
  const now = new Date()
  const jst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
  const pad = (n: number) => String(n).padStart(2, '0')
  const today = `${jst.getFullYear()}-${pad(jst.getMonth() + 1)}-${pad(jst.getDate())}`

  const timeMatch = trimmed.match(/(\d{1,2}):(\d{2})/)
  if (!timeMatch) {
    return { date: today, inTime: null }
  }

  return {
    date: today,
    inTime: `${pad(parseInt(timeMatch[1], 10))}:${timeMatch[2]}`,
  }
}

export async function createCrmBooking(data: BookingPayload): Promise<{
  orderId: number
  orderNumber: string
  status: string
}> {
  const secret = process.env.CRM_RESERVE_SYNC_SECRET || process.env.RESERVE_SYNC_SECRET || ''
  if (!secret) {
    throw new Error('CRM_RESERVE_SYNC_SECRET not configured')
  }

  const { date, inTime } = parseStartTime(data.startTime)
  const totalPrice = data.coursePrice - (data.usePoints ? 2000 : 0)

  const payload: Record<string, unknown> = {
    store_id: data.storeId,
    cast_name: data.castName,
    date,
    course_minutes: data.courseMinutes,
    course_name: data.courseName,
    course_price: data.coursePrice,
    nomination_type: data.castName && data.castName !== 'フリー' ? 'photo' : 'free',
    place_type: data.placeType || 'hotel',
    place_detail: data.placeDetail || '',
    customer_phone: data.phone,
    total_price: totalPrice,
    notes: data.notes || '',
  }

  if (data.customerName) {
    payload.customer_name = data.customerName
  }
  if (data.castId && Number.isFinite(data.castId)) {
    payload.cast_id = data.castId
  }
  if (inTime) {
    payload.in_time = inTime
  }

  const res = await fetch(`${CRM_BASE}/api/reserve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-sync-secret': secret,
    },
    body: JSON.stringify(payload),
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok || !body.success) {
    throw new Error(body.error || `CRM reserve failed (${res.status})`)
  }

  return {
    orderId: body.order_id,
    orderNumber: body.order_number,
    status: body.status || 'pending',
  }
}

export async function fetchCrmBookingStatus(orderId: number, phone: string) {
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  const res = await fetch(
    `${CRM_BASE}/api/reserve/${orderId}?phone=${encodeURIComponent(cleanPhone)}`,
    { cache: 'no-store' },
  )
  const body = await res.json().catch(() => ({}))
  if (!res.ok || !body.success) {
    throw new Error(body.error || 'status_fetch_failed')
  }
  return body as {
    order_id: number
    order_number: string
    status: string
    order_status: string
    cast_name?: string
    start_time?: string
    business_date?: string
  }
}
