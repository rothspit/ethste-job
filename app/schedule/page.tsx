'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const DAYS = ['日', '月', '火', '水', '木', '金', '土']

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function tabLabel(d: Date, i: number) {
  if (i === 0) return '今日'
  if (i === 1) return '明日'
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function SchedulePage() {
  // 7日分の日付
  const [tabs] = useState(() => {
    const arr: Date[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() + i)
      arr.push(d)
    }
    return arr
  })

  const [selected, setSelected] = useState(0)
  const [casts, setCasts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const dateStr = toDateStr(tabs[selected])

  // 日付が変わるたびにスケジュール取得
  useEffect(() => {
    let ignore = false
    setLoading(true)
    supabase
      .from('schedules')
      .select('*, girls(*)')
      .eq('date', dateStr)
      .eq('status', 'working')
      .order('start_time', { ascending: true })
      .then(({ data }) => {
        if (!ignore) {
          setCasts(data?.filter((s: any) => s.girls) ?? [])
          setLoading(false)
        }
      })
    return () => { ignore = true }
  }, [dateStr])

  const img = (g: any) => g.images?.[0] || g.image1_url || null
  const time = (t: string | null) => t ? t.substring(0, 5) : '--:--'

  return (
    <div className="min-h-screen bg-slate-50 pb-28">

      {/* ===== ヘッダー ===== */}
      <div className="bg-pink-600 text-white px-4 py-3 flex items-center justify-between">
        <Link href="/funabashi" className="text-sm font-bold">← トップ</Link>
        <h1 className="text-lg font-black">出勤スケジュール</h1>
        <div className="w-12" />
      </div>

      {/* ===== 日付タブ（横並び） ===== */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex">
          {tabs.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex-1 py-3 text-center transition-colors ${
                i === selected
                  ? 'bg-pink-500 text-white'
                  : 'text-slate-600 hover:bg-pink-50'
              }`}
            >
              <div className="text-[10px] font-bold">{tabLabel(d, i)}</div>
              <div className={`text-xs font-black ${
                i === selected
                  ? ''
                  : d.getDay() === 0 ? 'text-red-500' : d.getDay() === 6 ? 'text-blue-500' : ''
              }`}>
                {DAYS[d.getDay()]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ===== キャスト一覧 ===== */}
      <div className="max-w-2xl mx-auto px-3 py-4">

        {/* 日付表示 */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-slate-600">
            {tabs[selected].toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
          </p>
          {!loading && (
            <span className="text-[10px] font-bold text-pink-500 bg-pink-50 border border-pink-200 px-2 py-1 rounded-full">
              {casts.length}名出勤
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">読み込み中...</p>
          </div>
        ) : casts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <p className="text-3xl mb-2">😴</p>
            <p className="text-sm text-slate-400 font-bold">この日の出勤情報はまだありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {casts.map((s) => {
              const g = s.girls
              return (
                <Link
                  key={s.id}
                  href={`/girls/${g.id}`}
                  className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
                >
                  {/* 画像 */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-white shadow">
                    {img(g) ? (
                      <img src={img(g)} alt={g.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Img</div>
                    )}
                  </div>

                  {/* 名前・時間 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-base text-slate-800 truncate">{g.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{g.age}歳</span>
                    </div>
                    <div className="inline-flex items-center gap-1 bg-pink-50 border border-pink-200 px-2.5 py-1 rounded-full">
                      <span className="text-xs font-black text-pink-600">
                        {time(s.start_time)} ~ {time(s.end_time)}
                      </span>
                    </div>
                  </div>

                  {/* 詳細 */}
                  <div className="bg-pink-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shrink-0">
                    詳細
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/girls" className="text-xs font-bold text-pink-500 border-b border-pink-500 pb-0.5">
            全キャストを見る &gt;
          </Link>
        </div>
      </div>

      {/* ===== 追尾フッター ===== */}
      <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-t border-slate-200" />
        <div className="max-w-xl mx-auto relative pointer-events-auto px-4 py-3 flex gap-3">
          <a href="tel:05017459665" className="flex-1 bg-white border-2 border-pink-500 text-pink-600 rounded-full flex flex-col items-center justify-center py-2 shadow active:scale-95 transition-transform">
            <span className="text-[10px] font-bold">電話で空き確認</span>
            <span className="text-base font-black leading-none">050-1745-9665</span>
          </a>
          <Link href="/chat" className="flex-1 bg-pink-500 text-white rounded-full flex items-center justify-center gap-2 py-2 shadow active:scale-95 transition-transform">
            <span className="text-xl">💬</span>
            <span className="font-black">今すぐ指名</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
