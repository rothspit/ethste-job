import Link from 'next/link'
import type { Metadata } from 'next'
import { getBrand } from '@/lib/brand/get-brand'
import { getDiariesByBrand } from '@/lib/brand/brand-queries'
import type { Diary } from '@/lib/brand/brand-queries'

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand()
  return {
    title: `写メ日記｜${brand.name}`,
    description: `${brand.name}のキャストによる写メ日記一覧。`,
  }
}

function DiaryCard({ diary }: { diary: Diary }) {
  const girlName = diary.girl ? (diary.girl as any).name : null
  const date = diary.published_at
    ? new Date(diary.published_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : ''

  return (
    <Link
      href={`/mitsu/diaries/${diary.slug}`}
      className="bg-[#1a1225] rounded-lg overflow-hidden border border-[#d4a017]/10 hover:border-[#d4a017]/30 transition group"
    >
      <div className="aspect-video bg-[#2d1b4e] flex items-center justify-center overflow-hidden">
        {diary.thumbnail_url ? (
          <img
            src={diary.thumbnail_url}
            alt={diary.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-3xl opacity-20">📝</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-bold text-[#f5f3ff] line-clamp-2">{diary.title}</p>
        <div className="flex items-center justify-between mt-2">
          {girlName && (
            <p className="text-[10px] text-[#d4a017]">{girlName}</p>
          )}
          <p className="text-[10px] text-[#a1a1aa]/50 ml-auto">{date}</p>
        </div>
      </div>
    </Link>
  )
}

export default async function MitsuDiariesPage() {
  const [brand, diaries] = await Promise.all([
    getBrand(),
    getDiariesByBrand(),
  ])

  return (
    <main className="min-h-screen bg-[#0f0a1a] text-[#f5f3ff] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0a1a]/95 backdrop-blur border-b border-[#d4a017]/20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/mitsu" className="text-[#a1a1aa] text-sm hover:text-[#f5f3ff] transition">
            ← 戻る
          </Link>
          <h1
            className="text-lg font-bold tracking-[0.1em]"
            style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif JP', serif" }}
          >
            写メ日記
          </h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-center text-[#a1a1aa]/50 text-xs tracking-wider mb-8">
          {brand.name}
        </p>

        {diaries.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {diaries.map((d) => (
              <DiaryCard key={d.id} diary={d} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#a1a1aa]/40 text-sm">準備中</p>
          </div>
        )}
      </div>
    </main>
  )
}
