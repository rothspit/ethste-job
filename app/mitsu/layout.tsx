import type { Metadata } from 'next'
import { Noto_Serif_JP, Noto_Sans_JP } from 'next/font/google'
import { getBrand } from '@/lib/brand/get-brand'
import { BrandProvider } from '@/lib/brand/brand-context'
import { ThemeInjector } from '@/components/brand/theme-injector'

const SLUG = 'hitomitsu'

const notoSerif = Noto_Serif_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  preload: false,
  variable: '--font-noto-serif',
})

const notoSans = Noto_Sans_JP({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  preload: false,
  variable: '--font-noto-sans',
})

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand(SLUG)
  return {
    title: brand.site_title || `${brand.name}｜${brand.area || ''}`,
    description: brand.description || brand.site_tagline || '',
    openGraph: {
      title: brand.site_title || brand.name,
      description: brand.site_tagline || '',
      siteName: brand.name,
      locale: 'ja_JP',
      type: 'website',
    },
  }
}

export default async function MitsuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const brand = await getBrand(SLUG)

  return (
    <div
      className={`${notoSerif.variable} ${notoSans.variable}`}
      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
    >
      <BrandProvider brand={brand}>
        <ThemeInjector />
        {children}
      </BrandProvider>
    </div>
  )
}
