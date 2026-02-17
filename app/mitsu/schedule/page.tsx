import Link from 'next/link'
import type { Metadata } from 'next'
import { getBrand } from '@/lib/brand/get-brand'
import { getTodaySchedule } from '@/lib/brand/brand-queries'
import type { Girl, Schedule } from '@/lib/brand/brand-queries'

const SLUG = 'hitomitsu'
const serif = "var(--font-noto-serif), 'Noto Serif JP', serif"

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand(SLUG)
  return {
    title: `本日の出勤｜${brand.name}`,
    description: `${brand.name}の本日の出勤スケジュール。`,
  }
}

function ScheduleRow({ schedule }: { schedule: Schedule }) {
  const girl = schedule.girl as Girl | undefined
  const imageUrl = girl?.profile_image_url ?? (girl as any)?.image1_url ?? null

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
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-medium text-[#b8860b]" style={{ fontFamily: serif }}>
          {schedule.start_time?.slice(0, 5)}
        </p>
        <p className="text-[10px] text-[#a8a29e]">〜 {schedule.end_time?.slice(0, 5)}</p>
      </div>
    </Link>
  )
}

export default async function MitsuSchedulePage() {
  const [brand, schedules] = await Promise.all([
    getBrand(SLUG),
    getTodaySchedule(SLUG),
  ])

  const today = new Date().toLocaleDateString('ja-JP', {
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
