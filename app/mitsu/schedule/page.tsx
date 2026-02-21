import Link from 'next/link'
import type { Metadata } from 'next'
import { getBrand } from '@/lib/brand/get-brand'
import { getTodaySchedule } from '@/lib/brand/brand-queries'
import type { Girl, Schedule } from '@/lib/brand/brand-queries'
import { getGirlImageUrl } from '@/lib/brand/image-utils'

const SLUG = 'hitomitsu'
const serif = "var(--font-noto-serif), 'Noto Serif JP', serif"

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand(SLUG)
  return {
    title: '本日の出勤 | 人妻の蜜 西船橋・錦糸町・葛西',
    description: '西船橋・錦糸町・葛西エリアの人妻デリヘル「人妻の蜜」の本日の出勤スケジュール。今すぐ遊べるキャストを確認できます。',
    keywords: ['出勤', '人妻', 'デリヘル', '西船橋', '錦糸町', '葛西', '本日'],
    alternates: {
      canonical: 'https://h-mitsu.com/mitsu/schedule',
    },
    openGraph: {
      title: '本日の出勤 | 人妻の蜜 西船橋・錦糸町・葛西',
      description: '西船橋・錦糸町・葛西エリアの人妻デリヘル「人妻の蜜」の本日の出勤スケジュール。',
      images: [{ url: '/main_mitsu.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: '本日の出勤 | 人妻の蜜 西船橋・錦糸町・葛西',
      images: ['/main_mitsu.jpg'],
    },
  }
}

function formatTime(t: string | null | undefined): string {
  if (!t) return ''
  const hh = t.slice(0, 5)
  const h = parseInt(hh.slice(0, 2), 10)
  return h < 7 ? `翌${hh}` : hh
}

function ScheduleRow({ schedule }: { schedule: Schedule }) {
  const girl = schedule.girl as Girl | undefined
  const imageUrl = getGirlImageUrl(girl)
  const areaName = schedule.area?.name

  return (
    <Link
      href={girl ? `/mitsu/girls/${girl.id}` : '#'}
      className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition"
    >
      <div className="w-16 h-16 rounded-lg bg-[#f5f5f4] flex-shrink-0 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={girl?.name || ''} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl opacity-15">👤</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1c1917] truncate" style={{ fontFamily: serif }}>
          {girl?.name || '—'}
        </p>
        {girl?.age && <p className="text-[10px] text-[#78716c] mt-0.5">{girl.age}歳</p>}
        {areaName && (
          <p className="text-[10px] text-[#b8860b]/70 mt-0.5">{areaName}</p>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-medium text-[#b8860b]" style={{ fontFamily: serif }}>
          {formatTime(schedule.start_time)}
        </p>
        <p className="text-[10px] text-[#a8a29e]">〜 {formatTime(schedule.end_time)}</p>
      </div>
    </Link>
  )
}

export default async function MitsuSchedulePage() {
  const [brand, schedules] = await Promise.all([
    getBrand(SLUG),
    getTodaySchedule(SLUG),
  ])

  const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  return (
    <main className="min-h-screen bg-[#fafaf9] text-[#1c1917] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#b8860b]/30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/mitsu" className="text-[#78716c] text-xs tracking-wider hover:text-[#b8860b] transition">
            ← 戻る
          </Link>
          <h1 className="text-base text-[#1c1917] tracking-[0.2em] font-medium" style={{ fontFamily: serif }}>
            本日の出勤
          </h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-center text-[#b8860b] text-sm tracking-wider mb-10" style={{ fontFamily: serif }}>
          {today}
        </p>

        {schedules.length > 0 ? (
          <div className="space-y-3">
            {schedules.map((s) => (
              <ScheduleRow key={s.id} schedule={s} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#a8a29e] text-sm mb-2">本日の出勤情報はまだありません</p>
            <p className="text-[#a8a29e]/60 text-xs">出勤情報は随時更新されます</p>
          </div>
        )}

        {brand.phone && (
          <>
            <div className="w-10 h-px bg-[#b8860b]/30 mx-auto my-10" />
            <div className="text-center">
              <p className="text-[#a8a29e] text-xs mb-4 tracking-wider">お電話でのお問い合わせ</p>
              <a
                href={`tel:${brand.phone}`}
                className="inline-block border border-[#b8860b]/40 text-[#b8860b] py-3 px-10 tracking-[0.2em] font-medium hover:bg-[#b8860b]/5 transition"
                style={{ fontFamily: serif }}
              >
                ☎ {brand.phone}
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
