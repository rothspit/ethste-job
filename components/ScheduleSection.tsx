'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ScheduleSection() {
  const [girls, setGirls] = useState<any[]>([])

  useEffect(() => {
    const fetchGirls = async () => {
      // 出勤フラグが立っている子だけを取得
      const { data } = await supabase
        .from('girls')
        .select('*')
        .eq('is_attending', true)
        .order('ranking_order', { ascending: true })

      if (data) setGirls(data)
    }
    fetchGirls()
  }, [])

  // 画像URLを取得するヘルパー関数
  const getImageUrl = (g: any) => {
    if (g.images && g.images[0]) return g.images[0]
    if (g.image1_url) return g.image1_url
    return null
  }

  if (girls.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 text-center">
        <p className="text-sm text-slate-400 font-bold bg-slate-100 py-4 rounded-xl">
          現在、出勤情報の更新中です...
        </p>
      </div>
    )
  }

  // 時間の文字列を見て、状態を判定する関数
  const getStatus = (timeStr: string) => {
    if (!timeStr) return { type: 'normal', text: '時間未定', color: 'bg-slate-100 text-slate-500' }

    // "即" という文字が含まれていたら「即ご案内」モード
    if (timeStr.includes('即')) {
      return {
        type: 'immediate',
        text: '即ご案内OK',
        color: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white animate-pulse shadow-pink-200 shadow-lg'
      }
    }
    // "満" という文字が含まれていたら「満了」モード
    if (timeStr.includes('満')) {
      return {
        type: 'full',
        text: '予約満了',
        color: 'bg-slate-200 text-slate-400'
      }
    }
    // それ以外は通常時間表示
    return {
      type: 'time',
      text: `${timeStr}~`,
      color: 'bg-white border-2 border-pink-500 text-pink-600'
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <span className="text-2xl">⚡️</span> 本日の出勤
        </h2>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
          {new Date().toLocaleDateString()} 更新
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {girls.map((girl) => {
          const status = getStatus(girl.today_hours)

          return (
            <Link
              href={`/girls/${girl.id}`}
              key={girl.id}
              className={`block relative bg-white rounded-xl p-3 shadow-sm border border-slate-100 transition-transform active:scale-[0.98] ${status.type === 'full' ? 'opacity-70 grayscale' : ''}`}
            >
              <div className="flex gap-3 items-center">

                {/* アイコン画像 */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-white shadow-md">
                  {getImageUrl(girl) ? (
                    <img src={getImageUrl(girl)} alt={girl.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Image</div>
                  )}
                  {/* 即マーク */}
                  {status.type === 'immediate' && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full z-10 animate-bounce"></div>
                  )}
                </div>

                {/* 名前と情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-lg text-slate-800 truncate">{girl.name}</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{girl.age}歳</span>
                  </div>

                  {/* ステータス表示エリア */}
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-black tracking-wide ${status.color}`}>
                    {status.text}
                  </div>
                </div>

                {/* 予約ボタン */}
                {status.type !== 'full' && (
                  <div className="flex flex-col gap-1 shrink-0">
                    <div className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full text-center shadow hover:bg-slate-700">
                      詳細
                    </div>
                  </div>
                )}
              </div>

              {/* 一言コメントがあれば表示 */}
              {girl.schedule_comment && status.type !== 'full' && (
                <div className="mt-3 bg-pink-50 p-2 rounded-lg text-xs text-slate-600 relative ml-4">
                  <span className="absolute -left-1 top-3 w-2 h-2 bg-pink-50 rotate-45"></span>
                  "{girl.schedule_comment}"
                </div>
              )}
            </Link>
          )
        })}
      </div>

      {/* もっと見る */}
      <div className="mt-4 text-center">
        <Link href="/girls" className="text-xs font-bold text-pink-500 border-b border-pink-500 pb-0.5 hover:opacity-70">
          全キャストを見る &gt;
        </Link>
      </div>
    </div>
  )
}
