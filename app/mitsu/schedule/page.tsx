import Link from 'next/link'
import type { Metadata } from 'next'
import { getBrand } from '@/lib/brand/get-brand'
import { getTodaySchedule } from '@/lib/brand/brand-queries'
import type { Girl, Schedule } from '@/lib/brand/brand-queries'

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand()
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
      className="flex items-center gap-4 bg-[#1a1225] rounded-lg p-3 border border-[#d4a017]/10 hover:border-[#d4a017]/30 transition"
    >
      {/* Photo */}
      <div className="w-16 h-16 rounded-lg bg-[#2d1b4e] flex-shrink-0 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={girl?.name || ''} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl opacity-30">👤</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#f5f3ff] truncate">{girl?.name || '—'}</p>
        {girl?.age && <p className="text-[10px] text-[#a1a1aa] mt-0.5">{girl.age}歳</p>}
      </div>

      {/* Time */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-[#d4a017]">
          {schedule.start_time?.slice(0, 5)}
        </p>
        <p className="text-[10px] text-[#a1a1aa]/60">〜 {schedule.end_time?.slice(0, 5)}</p>
      </div>
    </Link>
  )
}

export default async function MitsuSchedulePage() {
  const [brand, schedules] = await Promise.all([
    getBrand(),
    getTodaySchedule(),
  ])

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

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
            本日の出勤
          </h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Date */}
        <p className="text-center text-[#d4a017] text-sm tracking-wider mb-8">{today}</p>

        {schedules.length > 0 ? (
          <div className="space-y-3">
            {schedules.map((s) => (
              <ScheduleRow key={s.id} schedule={s} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4 opacity-30">📅</p>
            <p className="text-[#a1a1aa]/40 text-sm">本日の出勤情報はまだありません</p>
            <p className="text-[#a1a1aa]/30 text-xs mt-2">
              出勤情報は随時更新されます
            </p>
          </div>
        )}

        {/* Phone CTA */}
        {brand.phone && (
          <>
            <div className="divider-gold my-8" />
            <div className="text-center">
              <p className="text-[#a1a1aa]/50 text-xs mb-3 tracking-wider">
                お電話でのお問い合わせ
              </p>
              <a
                href={`tel:${brand.phone}`}
                className="inline-block border border-[#d4a017] text-[#d4a017] py-3 px-8 tracking-[0.15em] font-bold hover:bg-[#d4a017]/10 transition"
                style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif JP', serif" }}
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
