import type { MetadataRoute } from 'next'
import { CRM_API_BASE, IDOL_STORE_ID } from '@/lib/crm-api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://idolgakuen.jp'

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
      priority: 0.8,
    },
    {
      url: `${baseUrl}/girls`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/student-council`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  try {
    const res = await fetch(`${CRM_API_BASE}/idol/casts?store_id=${IDOL_STORE_ID}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      return staticPages
    }
    const json = await res.json()
    const casts = json.casts ?? []
    const castPages: MetadataRoute.Sitemap = casts.map((c: { cast_id?: number; id?: number }) => ({
      url: `${baseUrl}/girls/${c.cast_id ?? c.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
    return [...staticPages, ...castPages]
  } catch {
    return staticPages
  }
}
