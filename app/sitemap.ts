import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://idolgakuen.jp'

  // ブランドIDを取得
  const { data: idolBrand } = await supabase
    .from('brands')
    .select('id')
    .eq('slug', 'idol-gakuen')
    .single()

  // 動的ページのデータ取得
  const { data: idolDiaries } = await supabase
    .from('diaries')
    .select('id, created_at')
    .eq('brand_id', idolBrand?.id ?? '')

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
  ]

  // アイドル学園日記個別ページ
  const idolDiaryPages: MetadataRoute.Sitemap = (idolDiaries ?? []).map((d) => ({
    url: `${baseUrl}/diaries/${d.id}`,
    lastModified: d.created_at ? new Date(d.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...idolDiaryPages]
}
