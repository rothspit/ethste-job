import type { Metadata } from 'next'
import { getBrand } from '@/lib/brand/get-brand'
import { getGirlById } from '@/lib/brand/brand-queries'
import { getGirlImageUrl } from '@/lib/brand/image-utils'
import MitsuGirlDetail from './detail'

const SLUG = 'hitomitsu'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const [brand, girl] = await Promise.all([getBrand(SLUG), getGirlById(id, SLUG)])
  if (!girl) return { title: `キャスト不明｜${brand.name}` }
  const imageUrl = getGirlImageUrl(girl) ?? '/main_mitsu.jpg'
  const extra = girl as any
  const ageText = girl.age ? `${girl.age}歳` : ''
  const cupText = extra.cup ? ` / ${extra.cup}カップ` : ''
  const titleText = `${girl.name} (${ageText}) | 西船橋・錦糸町の人妻デリヘル`
  const descText = `西船橋・錦糸町エリアに出勤中！${girl.name}(${ageText}${cupText})。人妻の蜜おすすめの熟女キャストです。`
  return {
    title: titleText,
    description: descText,
    keywords: ['デリヘル', '人妻', '西船橋', '錦糸町', '指名', girl.name],
    alternates: {
      canonical: `https://h-mitsu.com/mitsu/girls/${id}`,
    },
    openGraph: {
      title: titleText,
      description: descText,
      type: 'profile',
      images: [{ url: imageUrl, width: 600, height: 800 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleText,
      images: [imageUrl],
    },
  }
}

export default async function MitsuGirlDetailPage({ params }: Props) {
  const { id } = await params
  const [brand, girl] = await Promise.all([getBrand(SLUG), getGirlById(id, SLUG)])
  return <MitsuGirlDetail girl={girl} brand={brand} />
}
