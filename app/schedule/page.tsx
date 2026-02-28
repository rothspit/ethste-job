'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Noto_Sans_JP } from 'next/font/google'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const baseFont = Noto_Sans_JP({
  weight: ['700', '900'],
  subsets: ['latin'],
  preload: false,
})

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

function formatDateStr(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getWeekDates() {
  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + i)
    dates.push(d)
  }
  return dates
}

function formatTime(time: string | null) {
  if (!time) return '--:--'
  return time.substring(0, 5)
}

export default function SchedulePage() {
  const [dates] = useState(getWeekDates)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const tabsRef = useRef<HTMLDivElement>(null)

  const selectedDate = formatDateStr(dates[selectedIndex])

  useEffect(() => {
    let cancelled = false
    const fetchSchedules = async () => {
      setLoading(true)

      const { data } = await supabase
        .from('schedules')
        .select('*, girls(*)')
        .eq('date', selectedDate)
        .eq('status', 'working')
        .order('start_time', { ascending: true })

      if (!cancelled) {
        setSchedules(data?.filter((s: any) => s.girls) ?? [])
        setLoading(false)
      }
    }
    fetchSchedules()
    return () => { cancelled = true }
  }, [selectedDate])

  // 選択タブをスクロールで見えるようにする
  useEffect(() => {
    if (tabsRef.current) {
      const tab = tabsRef.current.children[selectedIndex] as HTMLElement
      if (tab) {
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [selectedIndex])

  const getImageUrl = (girl: any) => {
    if (girl.images && girl.images[0]) return girl.images[0]
    if (girl.image1_url) return girl.image1_url
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* ヘッダー + 日付タブ */}
      <div className="sticky top-0 z-40 shadow-lg">
        <div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/funabashi" className="text-sm font-bold opacity-90 hover:opacity-100 transition-opacity">
              &#8592; トップ
            </Link>
            <h1 className={`${baseFont.className} text-lg font-black tracking-wide`}>
              出勤スケジュール
            </h1>
            <div className="w-12" />
          </div>

          {/* 日付タブ */}
          <div ref={tabsRef} className="flex overflow-x-auto border-t border-pink-400/30" style={{ scrollbarWidth: 'none' }}>
            {dates.map((date, i) => {
              const isSelected = i === selectedIndex
              const dayOfWeek = DAY_LABELS[date.getDay()]
              const isSun = date.getDay() === 0
              const isSat = date.getDay() === 6

              return (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`flex-shrink-0 px-4 py-2.5 text-center transition-all relative min-w-[72px] ${
                    isSelected
                      ? 'bg-slate-50 text-pink-600'
                      : 'text-white/80 hover:bg-pink-500/50'
                  }`}
                >
                  <div className="text-[10px] font-bold mb-0.5">
                    {i === 0 ? '今日' : i === 1 ? '明日' : `${date.getMonth() + 1}/${date.getDate()}`}
                  </div>
                  <div className={`text-xs font-black ${
                    isSelected
                      ? isSun ? 'text-red-500' : isSat ? 'text-blue-500' : ''
                      : isSun ? 'text-red-300' : isSat ? 'text-blue-300' : ''
                  }`}>
                    {i <= 1
                      ? `${date.getMonth() + 1}/${date.getDate()}(${dayOfWeek})`
                      : `${dayOfWeek}曜日`}
                  </div>
                  {isSelected && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-transparent border-b-slate-50" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-2xl mx-auto px-3 py-4">
        {/* 日付と人数 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-slate-700 flex items-center gap-2">
            <span className="text-xl">&#x1F4C5;</span>
            {dates[selectedIndex].toLocaleDateString('ja-JP', {
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </h2>
          {!loading && (
            <span className="text-[10px] font-bold text-pink-500 bg-pink-50 border border-pink-200 px-2.5 py-1 rounded-full">
              {schedules.length}名出勤
            </span>
          )}
        </div>

        {/* ローディング */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-3" />
            <p className="text-sm text-slate-400 font-bold">読み込み中...</p>
          </div>
        ) : schedules.length === 0 ? (
          /* 出勤なし */
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <p className="text-4xl mb-3">&#x1F634;</p>
            <p className="text-sm text-slate-400 font-bold">この日の出勤情報はまだありません</p>
            <p className="text-[10px] text-slate-300 mt-1">近日中に更新予定です</p>
          </div>
        ) : (
          /* キャストカード一覧 */
          <div className="grid grid-cols-1 gap-3">
            {schedules.map((schedule) => {
              const girl = schedule.girls
              if (!girl) return null
              const imageUrl = getImageUrl(girl)

              return (
                <Link
                  href={`/girls/${girl.id}`}
                  key={schedule.id}
                  className="block bg-white rounded-xl p-3 shadow-sm border border-slate-100 transition-all active:scale-[0.98] hover:shadow-md"
                >
                  <div className="flex gap-3 items-center">
                    {/* プロフィール画像 */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 shadow-md">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={girl.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                          No Image
                        </div>
                      )}
                      {/* 即ヒメバッジ */}
                      {girl.is_attending && girl.today_hours?.includes('即') && (
                        <div className="absolute top-0 left-0 bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-br-lg">
                          即OK
                        </div>
                      )}
                    </div>

                    {/* 名前・年齢・時間 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-black text-lg text-slate-800 truncate">
                          {girl.name}
                        </h3>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                          {girl.age}歳
                        </span>
                      </div>

                      {/* 出勤時間 */}
                      <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 px-3 py-1.5 rounded-full">
                        <span className="text-pink-500 text-sm">&#x23F0;</span>
                        <span className="text-sm font-black text-pink-600 tracking-wide">
                          {formatTime(schedule.start_time)} ~ {formatTime(schedule.end_time)}
                        </span>
                      </div>

                      {/* コメント */}
                      {schedule.comment && (
                        <p className="text-[10px] text-slate-400 mt-1 truncate">
                          &#x1F4AC; {schedule.comment}
                        </p>
                      )}
                    </div>

                    {/* 詳細ボタン */}
                    <div className="shrink-0">
                      <div className="bg-pink-500 text-white text-[10px] font-bold px-3 py-2 rounded-full text-center shadow hover:bg-pink-400 transition-colors">
                        詳細 &#x2192;
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* フッターリンク */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-[10px] text-slate-300">
            ※出勤情報は変更になる場合がございます
          </p>
          <Link
            href="/girls"
            className="inline-block text-xs font-bold text-pink-500 border-b border-pink-500 pb-0.5 hover:opacity-70 transition-opacity"
          >
            全キャストを見る &gt;
          </Link>
        </div>
      </div>

      {/* 追尾フッターCTA */}
      <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-t border-white/40 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]" />
        <div className="max-w-xl mx-auto relative pointer-events-auto px-4 py-3 pb-safe flex gap-3">
          <a
            href="tel:05017459665"
            className="flex-1 bg-white border-2 border-pink-500 text-pink-600 rounded-full flex flex-col items-center justify-center py-2 shadow-lg active:scale-95 transition-transform hover:bg-pink-50"
          >
            <span className="text-[10px] font-bold">電話で空き確認</span>
            <span className="text-lg font-black leading-none tracking-tighter">050-1745-9665</span>
          </a>
          <Link
            href="/chat"
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center gap-2 py-2 shadow-lg active:scale-95 transition-transform hover:opacity-90 ring-2 ring-white ring-offset-2 ring-offset-blue-200"
          >
            <span className="text-2xl animate-pulse">&#x1F4AC;</span>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold opacity-90">待たずに連絡</span>
              <span className="font-black text-lg">今すぐ指名</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
