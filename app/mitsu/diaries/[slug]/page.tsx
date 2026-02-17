import Link from 'next/link'
import type { Metadata } from 'next'
import { getBrand } from '@/lib/brand/get-brand'
import { getDiaryBySlug } from '@/lib/brand/brand-queries'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [brand, diary] = await Promise.all([getBrand(), getDiaryBySlug(slug)])
  if (!diary) return { title: `記事が見つかりません｜${brand.name}` }
  return {
    title: `${diary.title}｜${brand.name}`,
    description: diary.content?.slice(0, 120) || '',
    openGraph: {
      title: diary.title,
      description: diary.content?.slice(0, 120) || '',
      ...(diary.thumbnail_url && {
        images: [{ url: diary.thumbnail_url, width: 1200, height: 630 }],
      }),
    },
  }
}

export default async function MitsuDiaryDetailPage({ params }: Props) {
  const { slug } = await params
  const [brand, diary] = await Promise.all([getBrand(), getDiaryBySlug(slug)])

  if (!diary) {
    return (
      <main className="min-h-screen bg-[#0f0a1a] text-[#f5f3ff] flex flex-col items-center justify-center p-4">
        <p className="text-[#a1a1aa] text-lg mb-4">記事が見つかりません</p>
        <Link
          href="/mitsu/diaries"
          className="border border-[#d4a017]/30 text-[#d4a017] text-sm px-6 py-2.5 tracking-wider hover:bg-[#d4a017]/10 transition"
        >
          日記一覧に戻る
        </Link>
      </main>
    )
  }

  const girlName = diary.girl ? (diary.girl as any).name : null
  const girlImage = diary.girl ? (diary.girl as any).profile_image_url : null
  const date = diary.published_at
    ? new Date(diary.published_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <main className="min-h-screen bg-[#0f0a1a] text-[#f5f3ff] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0a1a]/95 backdrop-blur border-b border-[#d4a017]/20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/mitsu/diaries" className="text-[#a1a1aa] text-sm hover:text-[#f5f3ff] transition">
            ← 日記一覧
          </Link>
        </div>
      </header>

      <article className="max-w-2xl mx-auto px-4 py-8">
        {/* Thumbnail */}
        {diary.thumbnail_url && (
          <div className="aspect-video bg-[#2d1b4e] rounded-lg overflow-hidden mb-6">
            <img
              src={diary.thumbnail_url}
              alt={diary.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title */}
        <h1
          className="text-xl md:text-2xl font-bold tracking-wider leading-relaxed mb-4"
          style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif JP', serif" }}
        >
          {diary.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          {girlName && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2d1b4e] flex items-center justify-center overflow-hidden border border-[#d4a017]/20">
                {girlImage ? (
                  <img src={girlImage} alt={girlName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs">👤</span>
                )}
              </div>
              <span className="text-sm text-[#d4a017]">{girlName}</span>
            </div>
          )}
          {date && <span className="text-xs text-[#a1a1aa]/50">{date}</span>}
        </div>

        <div className="divider-gold mb-8" />

        {/* Content */}
        <div className="text-sm text-[#a1a1aa]/90 leading-loose whitespace-pre-line">
          {diary.content}
        </div>

        <div className="divider-gold my-8" />

        {/* Back */}
        <div className="text-center">
          <Link
            href="/mitsu/diaries"
            className="inline-block border border-[#d4a017]/30 text-[#d4a017] text-xs px-6 py-2.5 tracking-wider hover:bg-[#d4a017]/10 transition"
          >
            日記一覧に戻る
          </Link>
        </div>
      </article>
    </main>
  )
}
