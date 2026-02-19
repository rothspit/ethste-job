import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Service Role で書き込み（ビルド時エラー回避のため遅延初期化）
function getSupabaseAdmin(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// ============================================
// MrVenrey API
// ============================================

const MRVENREY_API = 'https://webapi2.mrvenrey.jp'
const MRVENREY_BLOB = 'https://mrvenreyweb.blob.core.windows.net'

async function getMrVenreyToken(): Promise<string> {
  const res = await fetch(`${MRVENREY_API}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=password&username=${encodeURIComponent(process.env.MRVENREY_ID!)}&password=${encodeURIComponent(process.env.MRVENREY_PASS!)}`,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`MrVenrey login failed (${res.status}): ${text}`)
  }
  const data = await res.json()
  return data.access_token
}

async function getMrVenreyGirls(token: string): Promise<any[]> {
  const res = await fetch(`${MRVENREY_API}/api/girls/list`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`MrVenrey girls list failed (${res.status}): ${text}`)
  }
  const data = await res.json()
  return data.GirlsList || []
}

// ============================================
// Image処理: Azure Blob ベースURL（SASなし）を構築
// ============================================

const IMAGE_KEYS = ['Image1', 'Image2', 'Image3'] as const
const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// GUID → Azure Blob ベースURL（SASなし）
function toBlobUrl(imageValue: string): string {
  if (GUID_RE.test(imageValue)) {
    return `${MRVENREY_BLOB}/${process.env.MRVENREY_ID}/image/girls/${imageValue}/600_800.jpg`
  }
  // フルURLの場合 → SAS除去
  return imageValue.split('?')[0]
}

// Image1〜Image3 の Azure Blob ベースURL 配列を返す
function collectImageUrls(mr: any): string[] {
  return IMAGE_KEYS
    .map((k) => mr[k])
    .filter(Boolean)
    .map((v: string) => toBlobUrl(v))
}

// ============================================
// GET /api/sync-girls
// ============================================

export const maxDuration = 300

export async function GET(req: Request) {
  // Vercel Cron の認証
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()

  try {
    // 1. hitomitsu の brand_id を取得
    const { data: brand, error: brandErr } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', 'hitomitsu')
      .single()

    if (brandErr || !brand) {
      return NextResponse.json(
        { error: 'hitomitsu brand not found', detail: brandErr?.message },
        { status: 500 },
      )
    }
    const brandId = brand.id

    // 2. MrVenrey ログイン → キャスト一覧取得
    const token = await getMrVenreyToken()
    const mrGirls = await getMrVenreyGirls(token)

    // 3. 各キャストを同期
    let created = 0
    let updated = 0
    let errors = 0
    const errorDetails: string[] = []

    for (const mr of mrGirls) {
      try {
        // Azure Blob ベースURL（SASなし）を images に保存
        const imageUrls = collectImageUrls(mr)

        const girlData = {
          name: mr.Name,
          age: mr.Age || null,
          height: mr.Height || null,
          bust: mr.Bust || null,
          cup: mr.Cup || null,
          waist: mr.Waist || null,
          hip: mr.Hip || null,
          images: imageUrls.length > 0 ? imageUrls : null,
          is_active: true,
        }

        // name + brand_id で既存レコードを検索
        const { data: existing } = await supabase
          .from('girls')
          .select('id')
          .eq('name', mr.Name)
          .eq('brand_id', brandId)
          .maybeSingle()

        if (existing) {
          const { error } = await supabase
            .from('girls')
            .update(girlData)
            .eq('id', existing.id)
          if (error) throw error
          updated++
        } else {
          const { error } = await supabase
            .from('girls')
            .insert([{ ...girlData, brand_id: brandId }])
          if (error) throw error
          created++
        }
      } catch (err: any) {
        errors++
        errorDetails.push(`${mr.Name || mr.GirlId}: ${err.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      total: mrGirls.length,
      created,
      updated,
      errors,
      errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
      synced_at: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error('[sync-girls]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
