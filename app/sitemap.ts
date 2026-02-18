import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://idolgakuen.jp'

  // ブランドIDを取得
  const [{ data: idolBrand }, { data: mitsuBrand }] = await Promise.all([
    supabase.from('brands').select('id').eq('slug', 'idol-gakuen').single(),
    supabase.from('brands').select('id').eq('slug', 'hitomitsu').single(),
  ])

  // 動的ページのデータ取得
  const [
    { data: mitsuGirls },
    { data: mitsuDiaries },
    { data: idolDiaries },
  ] = await Promise.all([
    supabase
      .from('girls')
      .select('id, updated_at')
      .eq('brand_id', mitsuBrand?.id ?? '')
      .eq('is_active', true),
    supabase
      .from('diaries')
      .select('slug, published_at, updated_at')
      .eq('brand_id', mitsuBrand?.id ?? '')
      .eq('is_published', true),
    supabase
      .from('diaries')
      .select('id, created_at')
      .eq('brand_id', idolBrand?.id ?? ''),
  ])

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/funabashi`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/funabashi/home`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/diaries`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mitsu`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/mitsu/girls`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mitsu/schedule`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mitsu/diaries`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ]

  // 人妻の蜜キャスト個別ページ
  const mitsuGirlPages: MetadataRoute.Sitemap = (mitsuGirls ?? []).map((g) => ({
    url: `${baseUrl}/mitsu/girls/${g.id}`,
    lastModified: g.updated_at ? new Date(g.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 人妻の蜜日記個別ページ
  const mitsuDiaryPages: MetadataRoute.Sitemap = (mitsuDiaries ?? []).map((d) => ({
    url: `${baseUrl}/mitsu/diaries/${d.slug}`,
    lastModified: d.updated_at ? new Date(d.updated_at) : d.published_at ? new Date(d.published_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // アイドル学園日記個別ページ
  const idolDiaryPages: MetadataRoute.Sitemap = (idolDiaries ?? []).map((d) => ({
    url: `${baseUrl}/diaries/${d.id}`,
    lastModified: d.created_at ? new Date(d.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...mitsuGirlPages, ...mitsuDiaryPages, ...idolDiaryPages]
}
