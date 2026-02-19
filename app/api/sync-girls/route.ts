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

async function getMrVenreySAS(token: string): Promise<string> {
  const res = await fetch(`${MRVENREY_API}/api/blobsasses`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`MrVenrey blobsasses failed (${res.status}): ${text}`)
  }
  const data = await res.json()
  // GirlSAS を返す
  return data.GirlSAS || data.girlSAS || data.girlsas || ''
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
// Image処理
// ============================================

// Image1〜Image3 のみ対象
const IMAGE_KEYS = ['Image1', 'Image2', 'Image3'] as const

function collectImageValues(mr: any): string[] {
  return IMAGE_KEYS.map((k) => mr[k]).filter(Boolean)
}

// GUID かどうか判定
const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Image 値から Azure Blob URL を構築
function toBlobUrl(imageValue: string): string {
  // GUID のみの場合 → フル URL を構築
  if (GUID_RE.test(imageValue)) {
    return `${MRVENREY_BLOB}/${process.env.MRVENREY_ID}/image/girls/${imageValue}/60_80.jpg`
  }
  // フル URL の場合 → 既存 SAS を除去
  return imageValue.split('?')[0]
}

// Azure Blob から画像を取得して Supabase Storage にアップロード
async function syncImage(
  supabase: SupabaseClient,
  blobUrl: string,
  sas: string,
  storagePath: string,
): Promise<string | null> {
  const fetchUrl = `${blobUrl}?${sas}`

  const res = await fetch(fetchUrl)
  if (!res.ok) return null

  const blob = await res.arrayBuffer()
  if (blob.byteLength === 0) return null

  const contentType = res.headers.get('content-type') || 'image/jpeg'

  // Supabase Storage にアップロード（既存なら上書き）
  const { error } = await supabase.storage
    .from('girls')
    .upload(storagePath, blob, {
      contentType,
      upsert: true,
    })

  if (error) {
    console.error(`[syncImage] upload ${storagePath}:`, error.message)
    return null
  }

  // Public URL を取得
  const { data } = supabase.storage.from('girls').getPublicUrl(storagePath)
  return data.publicUrl
}

// ============================================
// GET /api/sync-girls
// ============================================

export const maxDuration = 300 // Vercel Function タイムアウト延長（秒）

export async function GET(req: Request) {
  // Vercel Cron の認証（設定されている場合のみ）
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

    // 2. MrVenrey ログイン → SAS取得 → キャスト一覧取得
    const token = await getMrVenreyToken()
    const girlSAS = await getMrVenreySAS(token)
    const mrGirls = await getMrVenreyGirls(token)

    if (!girlSAS) {
      return NextResponse.json(
        { error: 'Failed to get GirlSAS from MrVenrey' },
        { status: 500 },
      )
    }

    // 3. 各キャストを同期
    let created = 0
    let updated = 0
    let errors = 0
    let imagesSynced = 0
    const errorDetails: string[] = []

    for (const mr of mrGirls) {
      try {
        const mrId = String(mr.GirlId)
        const rawImageValues = collectImageValues(mr)

        // 画像を Supabase Storage に同期
        const storageUrls: string[] = []
        for (let i = 0; i < rawImageValues.length; i++) {
          const imageValue = rawImageValues[i]
          // Storage パス: {GirlId}/{1,2,3}.jpg
          const storagePath = `${mrId}/${i + 1}.jpg`

          // GUID またはフル URL から SAS なしの blob URL を構築
          const blobUrl = toBlobUrl(imageValue)

          const publicUrl = await syncImage(supabase, blobUrl, girlSAS, storagePath)
          if (publicUrl) {
            storageUrls.push(publicUrl)
            imagesSynced++
          }
        }

        const girlData = {
          name: mr.Name,
          age: mr.Age || null,
          height: mr.Height || null,
          bust: mr.Bust || null,
          cup: mr.Cup || null,
          waist: mr.Waist || null,
          hip: mr.Hip || null,
          images: storageUrls.length > 0 ? storageUrls : collectAllImages(mr),
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
      imagesSynced,
      errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
      synced_at: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error('[sync-girls]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Image1〜Image15 のオリジナルURL（フォールバック用）
function collectAllImages(mr: any): string[] {
  return Array.from({ length: 15 }, (_, i) => mr[`Image${i + 1}`]).filter(Boolean)
}
