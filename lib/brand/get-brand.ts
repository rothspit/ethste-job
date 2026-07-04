import { headers } from 'next/headers'
import type { Brand, BrandSlug } from './brand-context'

const FALLBACK_BRANDS: Record<BrandSlug, Brand> = {
  'idol-gakuen': {
    id: '00000000-0000-0000-0000-000000000001',
    slug: 'idol-gakuen',
    name: 'アイドル学園',
    domain: 'idolgakuen.jp',
    area: '船橋',
    site_title: 'アイドル学園｜船橋',
    site_tagline: '究極の「かわいい」をお届け',
    description: '船橋エリアNo.1のアイドル学園です。',
    theme_config: {
      colors: {
        primary: '#ec4899',
        'primary-light': '#f472b6',
        'primary-dark': '#db2777',
        secondary: '#8b5cf6',
        'secondary-light': '#a78bfa',
        'secondary-dark': '#7c3aed',
        accent: '#f59e0b',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#ffffff',
        'text-muted': '#94a3b8',
        'header-bg': '#1e293b',
        'header-text': '#ffffff',
        'footer-bg': '#0f172a',
        'footer-text': '#94a3b8',
      },
      borderRadius: { button: '9999px', card: '1rem', input: '0.75rem' },
      font: { heading: "'Noto Sans JP', sans-serif", body: "'Noto Sans JP', sans-serif" },
      style: 'pop',
    },
  },
}

const DEFAULT_SLUG: BrandSlug = 'idol-gakuen'

export async function getBrandSlug(forceSlug?: string): Promise<BrandSlug> {
  if (forceSlug === 'idol-gakuen') {
    return forceSlug
  }
  const h = await headers()
  const slug = h.get('x-brand-slug')
  if (slug === 'idol-gakuen') {
    return slug
  }
  return DEFAULT_SLUG
}

/** 静的フォールバック（Supabase 廃止後） */
export async function getBrand(forceSlug?: string): Promise<Brand> {
  const slug = await getBrandSlug(forceSlug)
  return FALLBACK_BRANDS[slug] ?? FALLBACK_BRANDS[DEFAULT_SLUG]
}
