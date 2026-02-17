import Link from 'next/link'
import type { Metadata } from 'next'
import { getBrand } from '@/lib/brand/get-brand'
import { getGirlById } from '@/lib/brand/brand-queries'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const [brand, girl] = await Promise.all([getBrand(), getGirlById(id)])
  if (!girl) return { title: `キャスト不明｜${brand.name}` }
  return {
    title: `${girl.name}｜${brand.name}`,
    description: girl.catchphrase || `${brand.name}の${girl.name}のプロフィール`,
  }
}

export default async function MitsuGirlDetailPage({ params }: Props) {
  const { id } = await params
  const [brand, girl] = await Promise.all([getBrand(), getGirlById(id)])

  if (!girl) {
    return (
      <main className="min-h-screen bg-[#0f0a1a] text-[#f5f3ff] flex flex-col items-center justify-center p-4">
        <p className="text-[#a1a1aa] text-lg mb-4">キャストが見つかりません</p>
        <Link
          href="/mitsu/girls"
          className="border border-[#d4a017]/30 text-[#d4a017] text-sm px-6 py-2.5 tracking-wider hover:bg-[#d4a017]/10 transition"
        >
          一覧に戻る
        </Link>
      </main>
    )
  }

  const imageUrl = girl.profile_image_url ?? (girl as any)?.image1_url ?? null
  const extra = girl as any

  return (
    <main className="min-h-screen bg-[#0f0a1a] text-[#f5f3ff] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0a1a]/95 backdrop-blur border-b border-[#d4a017]/20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/mitsu/girls" className="text-[#a1a1aa] text-sm hover:text-[#f5f3ff] transition">
            ← 一覧
          </Link>
          <h1
            className="text-lg font-bold tracking-[0.1em]"
            style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif JP', serif" }}
          >
            {girl.name}
          </h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        {/* Photo */}
        <div className="aspect-[3/4] bg-[#2d1b4e] flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={girl.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-8xl opacity-20">👤</span>
          )}
        </div>

        {/* Profile */}
        <div className="px-4 py-6">
          <h2
            className="text-2xl font-bold tracking-wider mb-1"
            style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif JP', serif" }}
          >
            {girl.name}
          </h2>
          {girl.catchphrase && (
            <p className="text-[#d4a017] text-sm mt-1">{girl.catchphrase}</p>
          )}

          <div className="divider-gold my-6" />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {girl.age && (
              <div className="bg-[#1a1225] rounded-lg p-3 border border-[#d4a017]/10">
                <p className="text-[10px] text-[#a1a1aa]/60 mb-1">年齢</p>
                <p className="font-bold">{girl.age}歳</p>
              </div>
            )}
            {extra.height && (
              <div className="bg-[#1a1225] rounded-lg p-3 border border-[#d4a017]/10">
                <p className="text-[10px] text-[#a1a1aa]/60 mb-1">身長</p>
                <p className="font-bold">{extra.height}cm</p>
              </div>
            )}
            {(extra.bust || extra.waist || extra.hip) && (
              <div className="bg-[#1a1225] rounded-lg p-3 border border-[#d4a017]/10 col-span-2">
                <p className="text-[10px] text-[#a1a1aa]/60 mb-1">スリーサイズ</p>
                <p className="font-bold">
                  B{extra.bust || '?'} / W{extra.waist || '?'} / H{extra.hip || '?'}
                </p>
              </div>
            )}
          </div>

          {/* Bio */}
          {extra.bio && (
            <>
              <div className="divider-gold my-6" />
              <div>
                <h3
                  className="text-sm tracking-[0.2em] text-[#a1a1aa] mb-3"
                  style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif JP', serif" }}
                >
                  自己紹介
                </h3>
                <p className="text-sm text-[#a1a1aa]/80 leading-relaxed whitespace-pre-line">
                  {extra.bio}
                </p>
              </div>
            </>
          )}

          {/* Manager Comment */}
          {extra.manager_comment && (
            <>
              <div className="divider-gold my-6" />
              <div>
                <h3
                  className="text-sm tracking-[0.2em] text-[#a1a1aa] mb-3"
                  style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif JP', serif" }}
                >
                  店長コメント
                </h3>
                <div className="bg-[#1a1225] rounded-lg p-4 border border-[#d4a017]/10">
                  <p className="text-sm text-[#a1a1aa]/80 leading-relaxed whitespace-pre-line">
                    {extra.manager_comment}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Phone CTA */}
          {brand.phone && (
            <>
              <div className="divider-gold my-6" />
              <a
                href={`tel:${brand.phone}`}
                className="block text-center border border-[#d4a017] text-[#d4a017] py-4 tracking-[0.15em] font-bold hover:bg-[#d4a017]/10 transition"
                style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif JP', serif" }}
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
