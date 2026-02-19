import Link from 'next/link'
import type { Metadata } from 'next'
import { getBrand } from '@/lib/brand/get-brand'
import { getGirlById } from '@/lib/brand/brand-queries'
import { getGirlImageUrl, getGirlImageUrls } from '@/lib/brand/image-utils'

const SLUG = 'hitomitsu'
const serif = "var(--font-noto-serif), 'Noto Serif JP', serif"

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

  if (!girl) {
    return (
      <main className="min-h-screen bg-white text-[#1c1917] flex flex-col items-center justify-center p-4">
        <p className="text-[#78716c] text-base mb-6">キャストが見つかりません</p>
        <Link
          href="/mitsu/girls"
          className="border border-[#b8860b]/30 text-[#b8860b] text-xs px-6 py-2.5 tracking-wider hover:bg-[#b8860b]/5 transition"
        >
          一覧に戻る
        </Link>
      </main>
    )
  }

  const imageUrl = getGirlImageUrl(girl)
  const extra = girl as any

  return (
    <main className="min-h-screen bg-white text-[#1c1917] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#b8860b]/30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/mitsu/girls" className="text-[#78716c] text-xs tracking-wider hover:text-[#b8860b] transition">
            ← 一覧
          </Link>
          <h1 className="text-base text-[#1c1917] tracking-[0.2em] font-medium" style={{ fontFamily: serif }}>
            {girl.name}
          </h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        {/* Photo */}
        <div className="aspect-[3/4] bg-[#f5f5f4] flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={girl.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-8xl opacity-10">👤</span>
          )}
        </div>

        {/* Profile */}
        <div className="px-5 py-10">
          <h2
            className="text-2xl font-medium tracking-[0.2em] text-[#1c1917] mb-1"
            style={{ fontFamily: serif }}
          >
            {girl.name}
          </h2>
          {girl.catchphrase && (
            <p className="text-[#b8860b] text-sm mt-2 tracking-wider">{girl.catchphrase}</p>
          )}

          <div className="w-10 h-px bg-[#b8860b] my-8" />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {girl.age && (
              <div className="bg-[#fafaf9] rounded-lg p-4">
                <p className="text-[10px] text-[#a8a29e] mb-1 tracking-wider">年齢</p>
                <p className="font-medium" style={{ fontFamily: serif }}>{girl.age}歳</p>
              </div>
            )}
            {extra.height && (
              <div className="bg-[#fafaf9] rounded-lg p-4">
                <p className="text-[10px] text-[#a8a29e] mb-1 tracking-wider">身長</p>
                <p className="font-medium" style={{ fontFamily: serif }}>{extra.height}cm</p>
              </div>
            )}
            {(extra.bust || extra.waist || extra.hip) && (
              <div className="bg-[#fafaf9] rounded-lg p-4 col-span-2">
                <p className="text-[10px] text-[#a8a29e] mb-1 tracking-wider">スリーサイズ</p>
                <p className="font-medium" style={{ fontFamily: serif }}>
                  B{extra.bust || '?'} / W{extra.waist || '?'} / H{extra.hip || '?'}
                </p>
              </div>
            )}
          </div>

          {/* Bio */}
          {extra.bio && (
            <>
              <div className="w-10 h-px bg-[#b8860b]/30 my-8" />
              <h3
                className="text-xs tracking-[0.2em] text-[#78716c] mb-4"
                style={{ fontFamily: serif }}
              >
                自己紹介
              </h3>
              <p className="text-sm text-[#44403c] leading-loose whitespace-pre-line">
                {extra.bio}
              </p>
            </>
          )}

          {/* Manager Comment */}
          {extra.manager_comment && (
            <>
              <div className="w-10 h-px bg-[#b8860b]/30 my-8" />
              <h3
                className="text-xs tracking-[0.2em] text-[#78716c] mb-4"
                style={{ fontFamily: serif }}
              >
                店長コメント
              </h3>
              <div className="bg-[#fafaf9] rounded-lg p-5">
                <p className="text-sm text-[#44403c] leading-loose whitespace-pre-line">
                  {extra.manager_comment}
                </p>
              </div>
            </>
          )}

          {/* Phone CTA */}
          {brand.phone && (
            <>
              <div className="w-10 h-px bg-[#b8860b]/30 my-8" />
              <a
                href={`tel:${brand.phone}`}
                className="block text-center border border-[#b8860b]/40 text-[#b8860b] py-4 tracking-[0.2em] font-medium hover:bg-[#b8860b]/5 transition"
                style={{ fontFamily: serif }}
              >
                ☎ {girl.name}を予約する
              </a>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
