import Link from 'next/link'
import { getBrand } from '@/lib/brand/get-brand'
import { getTodaySchedule, getDiariesByBrand, getGirlsByBrand } from '@/lib/brand/brand-queries'
import type { Girl, Schedule, Diary } from '@/lib/brand/brand-queries'

// ============================================
// サブコンポーネント（サーバー）
// ============================================

function ScheduleCard({ schedule }: { schedule: Schedule }) {
  const girl = schedule.girl as Girl | undefined
  const imageUrl = girl?.profile_image_url ?? (girl as any)?.image1_url ?? null

  return (
    <div className="flex-shrink-0 w-32 bg-[#1a1225] rounded-lg overflow-hidden border border-[#d4a017]/10">
      <div className="aspect-[3/4] bg-[#2d1b4e] flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={girl?.name || ''} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl opacity-30">👤</span>
        )}
      </div>
      <div className="p-2 text-center">
        <p className="text-sm font-bold text-[#f5f3ff] truncate">{girl?.name || '—'}</p>
        <p className="text-[10px] text-[#d4a017]">
          {schedule.start_time?.slice(0, 5)} - {schedule.end_time?.slice(0, 5)}
        </p>
      </div>
    </div>
  )
}

function DiaryCard({ diary }: { diary: Diary }) {
  const girlName = diary.girl ? (diary.girl as any).name : null
  const date = diary.published_at
    ? new Date(diary.published_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
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
          <span className="text-2xl opacity-20">📝</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-bold text-[#f5f3ff] truncate">{diary.title}</p>
        <div className="flex items-center justify-between mt-1">
          {girlName && <p className="text-[10px] text-[#a1a1aa]">{girlName}</p>}
          <p className="text-[10px] text-[#a1a1aa]/50 ml-auto">{date}</p>
        </div>
      </div>
    </Link>
  )
}

function GirlCard({ girl }: { girl: Girl }) {
  const imageUrl = girl.profile_image_url ?? (girl as any)?.image1_url ?? null

  return (
    <Link
      href={`/mitsu/girls/${girl.id}`}
      className="bg-[#1a1225] rounded-lg overflow-hidden border border-[#d4a017]/10 hover:border-[#d4a017]/30 transition group"
    >
      <div className="aspect-[3/4] bg-[#2d1b4e] flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={girl.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-4xl opacity-20">👤</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-bold text-[#f5f3ff]">{girl.name}</p>
        {girl.age && <p className="text-[10px] text-[#a1a1aa] mt-0.5">{girl.age}歳</p>}
        {girl.catchphrase && (
          <p className="text-[10px] text-[#a1a1aa]/70 mt-1 truncate">{girl.catchphrase}</p>
        )}
      </div>
    </Link>
  )
}

// ============================================
// セクション見出し
// ============================================

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-center text-sm tracking-[0.3em] text-[#a1a1aa] mb-6"
      style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif JP', serif" }}
    >
      — {children} —
    </h3>
  )
}

// ============================================
// メインページ
// ============================================

export default async function MitsuPage() {
  const [brand, schedules, diaries, girls] = await Promise.all([
    getBrand(),
    getTodaySchedule(),
    getDiariesByBrand({ limit: 6 }),
    getGirlsByBrand({ limit: 12 }),
  ])

  return (
    <main className="min-h-screen bg-[#0f0a1a] text-[#f5f3ff] pb-24">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-50 bg-[#0f0a1a]/95 backdrop-blur border-b border-[#d4a017]/20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1
            className="text-xl font-bold tracking-[0.15em]"
            style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif JP', serif" }}
          >
            人妻の<span className="text-[#d4a017]">蜜</span>
          </h1>
          {brand.phone && (
            <a
              href={`tel:${brand.phone}`}
              className="border border-[#d4a017]/50 text-[#d4a017] text-xs px-3 py-1.5 tracking-wider hover:bg-[#d4a017]/10 transition"
            >
              TEL予約
            </a>
          )}
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e] to-[#0f0a1a]" />
        <div className="relative z-10 max-w-lg mx-auto">
          <p className="text-[#d4a017] text-[10px] tracking-[0.4em] mb-6 uppercase">
            Premium Delivery Health
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-[0.2em] mb-4"
            style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif JP', serif" }}
          >
            人妻の<span className="text-[#d4a017]">蜜</span>
          </h2>
          <div className="divider-gold my-6 mx-auto max-w-[200px]" />
          <p className="text-[#a1a1aa] text-sm leading-relaxed tracking-wider">
            {brand.site_tagline || '大人の極上癒やし'}
          </p>
          {brand.area && (
            <p className="text-[#a1a1aa]/50 text-xs mt-3 tracking-wider">{brand.area}</p>
          )}
        </div>
      </section>

      {/* ===== 電話 CTA ===== */}
      {brand.phone && (
        <section className="px-4 pb-10">
          <div className="max-w-sm mx-auto text-center">
            <a
              href={`tel:${brand.phone}`}
              className="block border border-[#d4a017] text-[#d4a017] py-4 px-6 tracking-[0.15em] text-lg font-bold hover:bg-[#d4a017]/10 transition"
              style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif JP', serif" }}
            >
              ☎ {brand.phone}
            </a>
            <p className="text-[#a1a1aa]/40 text-[10px] mt-2 tracking-wider">
              お電話でのご予約・お問い合わせ
            </p>
          </div>
        </section>
      )}

      {/* ===== 本日の出勤 ===== */}
      <section className="py-8">
        <div className="max-w-2xl mx-auto px-4">
          <SectionHeading>本日の出勤</SectionHeading>
          {schedules.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {schedules.map((s) => (
                <ScheduleCard key={s.id} schedule={s} />
              ))}
            </div>
          ) : (
            <p className="text-center text-[#a1a1aa]/40 text-sm py-8">
              本日の出勤情報はまだありません
            </p>
          )}
        </div>
      </section>

      <div className="divider-gold max-w-xs mx-auto" />

      {/* ===== 最新の日記 ===== */}
      <section className="py-8">
        <div className="max-w-2xl mx-auto px-4">
          <SectionHeading>最新の日記</SectionHeading>
          {diaries.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {diaries.map((d) => (
                  <DiaryCard key={d.id} diary={d} />
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/mitsu/diaries"
                  className="inline-block border border-[#d4a017]/30 text-[#d4a017] text-xs px-6 py-2.5 tracking-wider hover:bg-[#d4a017]/10 transition"
                >
                  日記をすべて見る
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-[#a1a1aa]/40 text-sm py-8">準備中</p>
          )}
        </div>
      </section>

      <div className="divider-gold max-w-xs mx-auto" />

      {/* ===== 在籍キャスト ===== */}
      <section className="py-8">
        <div className="max-w-2xl mx-auto px-4">
          <SectionHeading>在籍キャスト</SectionHeading>
          {girls.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {girls.map((g) => (
                  <GirlCard key={g.id} girl={g} />
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/mitsu/girls"
                  className="inline-block border border-[#d4a017]/30 text-[#d4a017] text-xs px-6 py-2.5 tracking-wider hover:bg-[#d4a017]/10 transition"
                >
                  すべて見る
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-[#a1a1aa]/40 text-sm py-8">準備中</p>
          )}
        </div>
      </section>

      <div className="divider-gold max-w-xs mx-auto" />

      {/* ===== Footer ===== */}
      <footer className="py-12 px-4 text-center">
        <p
          className="text-xl tracking-[0.2em] mb-2"
          style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif JP', serif" }}
        >
          人妻の<span className="text-[#d4a017]">蜜</span>
        </p>
        <div className="divider-gold max-w-[100px] mx-auto my-4" />
        <div className="text-[#a1a1aa]/50 text-xs space-y-1 tracking-wider">
          {brand.area && <p>{brand.area}</p>}
          <p>営業時間: 10:00 - 翌4:00</p>
          {brand.phone && <p>TEL: {brand.phone}</p>}
        </div>
        <p className="text-[#a1a1aa]/20 text-[10px] mt-8">
          &copy; {new Date().getFullYear()} {brand.name} All Rights Reserved.
        </p>
      </footer>

      {/* ===== Sticky Footer ===== */}
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-[#0f0a1a]/95 backdrop-blur border-t border-[#d4a017]/20">
        <div className="max-w-md mx-auto flex">
          {brand.phone && (
            <a
              href={`tel:${brand.phone}`}
              className="flex-1 flex flex-col items-center justify-center py-3 text-[#d4a017] hover:bg-[#d4a017]/10 transition"
            >
              <span className="text-lg">☎</span>
              <span className="text-[10px] tracking-wider mt-0.5">電話予約</span>
            </a>
          )}
          <Link
            href="/mitsu/schedule"
            className="flex-1 flex flex-col items-center justify-center py-3 text-[#a1a1aa] hover:text-[#f5f3ff] transition"
          >
            <span className="text-lg">📅</span>
            <span className="text-[10px] tracking-wider mt-0.5">出勤情報</span>
          </Link>
          <Link
            href="/mitsu/girls"
            className="flex-1 flex flex-col items-center justify-center py-3 text-[#a1a1aa] hover:text-[#f5f3ff] transition"
          >
            <span className="text-lg">👤</span>
            <span className="text-[10px] tracking-wider mt-0.5">キャスト</span>
          </Link>
          <Link
            href="/mitsu/diaries"
            className="flex-1 flex flex-col items-center justify-center py-3 text-[#a1a1aa] hover:text-[#f5f3ff] transition"
          >
            <span className="text-lg">📝</span>
            <span className="text-[10px] tracking-wider mt-0.5">日記</span>
          </Link>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </main>
  )
}
