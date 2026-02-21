import Link from 'next/link'
import { getPhotoDiaries } from '@/lib/brand/brand-queries'
import type { PhotoDiary } from '@/lib/brand/brand-queries'

const SLUG = 'hitomitsu'
const serif = "var(--font-noto-serif), 'Noto Serif JP', serif"

export const metadata = {
  title: '写メ日記 | 人妻の蜜',
  description: '人妻の蜜キャストの写メ日記一覧。最新の写真とコメントをチェック。',
}

function DiaryCard({ diary }: { diary: PhotoDiary }) {
  const girlName = diary.girl?.name || '—'
  const date = new Date(diary.published_at).toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="aspect-square bg-[#f5f5f4] overflow-hidden">
        <img
          src={diary.image_url}
          alt={`${girlName}の写メ日記`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-medium text-[#b8860b]" style={{ fontFamily: serif }}>
            {girlName}
          </p>
          <p className="text-[10px] text-[#a8a29e]">{date}</p>
        </div>
        {diary.comment && (
          <p className="text-xs text-[#44403c] leading-relaxed line-clamp-3">
            {diary.comment}
          </p>
        )}
      </div>
    </div>
  )
}

export default async function MitsuDiaryPage() {
  const diaries = await getPhotoDiaries({ forceSlug: SLUG })

  return (
    <main className="min-h-screen bg-[#fafaf9] text-[#1c1917] pb-20">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#b8860b]/30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/mitsu" className="text-[#78716c] text-xs tracking-wider hover:text-[#b8860b] transition">
            ← 戻る
          </Link>
          <h1 className="text-base text-[#1c1917] tracking-[0.2em] font-medium" style={{ fontFamily: serif }}>
            写メ日記
          </h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {diaries.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {diaries.map((d) => (
              <DiaryCard key={d.id} diary={d} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#a8a29e] text-sm">まだ日記がありません</p>
          </div>
        )}
      </div>
    </main>
  )
}
