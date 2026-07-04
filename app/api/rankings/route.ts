import { NextRequest, NextResponse } from 'next/server'

const CRM_API_BASE = (process.env.CRM_API_URL || 'https://crm.st-online.jp').replace(/\/$/, '')

type RankingEntry = {
  rank: number
  cast_id: number
  name: string
  age: number | null
  photo_url: string | null
}

async function fetchCrm(path: string) {
  const res = await fetch(`${CRM_API_BASE}${path}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) return null
  return res.json()
}

/** CRM 本指名 → 空なら手動ランキング（store_rankings） */
export async function GET(req: NextRequest) {
  const storeId = req.nextUrl.searchParams.get('store_id') || '2'
  const limit = req.nextUrl.searchParams.get('limit') || '10'
  const period = req.nextUrl.searchParams.get('period') || 'last_month'

  const honshimei = await fetchCrm(
    `/api/rankings/honshimei?store_id=${encodeURIComponent(storeId)}&period=${encodeURIComponent(period)}&limit=${encodeURIComponent(limit)}`,
  )

  if (
    honshimei?.success &&
    Array.isArray(honshimei.rankings) &&
    honshimei.rankings.length > 0
  ) {
    return NextResponse.json({
      success: true,
      source: 'orders_honshimei',
      period_label: honshimei.period_label,
      rankings: honshimei.rankings as RankingEntry[],
    })
  }

  const manual = await fetchCrm(`/api/rankings/manual?store=idol`)
  if (manual?.success && Array.isArray(manual.rankings) && manual.rankings.length > 0) {
    const rankings = (manual.rankings as RankingEntry[]).slice(0, parseInt(limit, 10) || 10)
    return NextResponse.json({
      success: true,
      source: 'store_rankings',
      period_label: '店長オススメ',
      rankings,
    })
  }

  return NextResponse.json({
    success: true,
    source: 'none',
    period_label: null,
    rankings: [],
  })
}
