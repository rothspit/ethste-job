'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getBusinessToday } from '@/lib/business-date'

export default function ScheduleSection() {
  const [girls, setGirls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Generate next 7 days（起点は営業日: 朝8時で日付切替）
  const getDates = () => {
    const datesList = []
    const week = ['日', '月', '火', '水', '木', '金', '土']
    const base = getBusinessToday()
    for (let i = 0; i < 7; i++) {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      
      let label = ''
      if (i === 0) label = '本日'
      else if (i === 1) label = '明日'
      else label = `${d.getMonth() + 1}/${d.getDate()}(${week[d.getDay()]})`
      
      datesList.push({ date: dateStr, label })
    }
    return datesList
  }

  const [dates] = useState(getDates())
  const [selectedDate, setSelectedDate] = useState(dates[0].date)

  useEffect(() => {
    async function getGirlsByDate() {
      setLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_CRM_API_URL}/idol/schedules?store_id=2&date=${selectedDate}`, {
          cache: 'no-store'
        })
        if (!res.ok) throw new Error('Failed to fetch schedules from CRM')

        const json = await res.json()
        
        // Schedules endpoint returns an array of days inside `schedules`. 
        // We requested a specific date so we take the first item's casts.
        const dayData = json.schedules && json.schedules.length > 0 ? json.schedules[0] : null
        const scheduledCasts = dayData ? dayData.casts : []
        
        const activeStatuses = ['出勤', '即案内可能', '待機中', '接客中']
        const filtered = scheduledCasts.filter((c: any) => activeStatuses.includes(c.status))
        setGirls(filtered)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    getGirlsByDate()
  }, [selectedDate])

  // 画像URLを取得するヘルパー関数
  const getImageUrl = (g: any) => g.idol_image_path || g.image || null

  // APIのstatus文字列を見て、状態を判定する関数
  const getStatus = (castStatus: string) => {
    if (!castStatus) return { type: 'normal', text: '時間未定', color: 'bg-white border-2 border-pink-200 text-pink-400' }

    if (castStatus === '即案内可能' || castStatus === '待機中') {
      return {
        type: 'immediate',
        text: '即ご案内OK',
        color: 'bg-gradient-to-r from-pink-400 to-rose-400 text-white animate-pulse shadow-pink-200 shadow-md'
      }
    }
    if (castStatus === '接客中') {
      return {
        type: 'full',
        text: '接客中',
        color: 'bg-slate-100 text-slate-400 border border-slate-200'
      }
    }
    return {
      type: 'time',
      text: `${castStatus}`,
      color: 'bg-white border text-pink-500 border-pink-300 shadow-sm'
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-pink-600 flex items-center gap-2">
          <span className="text-2xl text-pink-400">⚡️</span> 出勤情報
        </h2>
        <span className="text-[10px] font-bold text-pink-400 bg-pink-50 px-3 py-1 rounded-full border border-pink-100" suppressHydrationWarning>
          {new Date().toLocaleDateString()} 更新
        </span>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-2 scrollbar-hide">
        {dates.map((d) => (
          <button
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border-2 transition-all flex-shrink-0 active:scale-95 ${
              selectedDate === d.date
                ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white border-transparent shadow shadow-pink-200'
                : 'bg-white text-pink-400 border-pink-100 hover:bg-pink-50'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {girls.length === 0 ? (
           <div className="col-span-full py-10 text-center text-sm text-pink-400 font-bold bg-white rounded-3xl border border-pink-100 shadow-sm">現在、本日の出勤メンバーはいません</div>
        ) : girls.map((girl: any) => {
          const status = getStatus(girl.status)
          const imageUrl = getImageUrl(girl)

          return (
            <Link
              href={`/girls/${girl.cast_id}`}
              key={`schedule-${girl.id}`}
              className={`block relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98] aspect-[4/5] bg-pink-50 group border border-pink-100 ${status.type === 'full' ? 'opacity-70 grayscale' : ''}`}
            >
              {/* 背景画像 */}
              {imageUrl ? (
                imageUrl.includes('placehold.co') || imageUrl.endsWith('.svg') ? (
                  <img src={imageUrl} alt={girl.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <Image 
                    src={imageUrl} 
                    alt={girl.name} 
                    fill
                    quality={95}
                    priority={true}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-pink-300 bg-gradient-to-br from-pink-50 to-white font-bold">No Image</div>
              )}

              {/* 即マーク */}
              {status.type === 'immediate' && (
                <div className="absolute top-2 left-2 flex items-center gap-1 z-20">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500 border border-white"></span>
                  </span>
                </div>
              )}

              {/* 下部グラデーションと情報 */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 z-10 transition-colors group-hover:from-black/80">
                
                {/* ステータスバッジ */}
                <div className="mb-1.5 flex flex-wrap gap-1">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black text-white shadow-sm ${
                    status.type === 'immediate' ? 'bg-gradient-to-r from-pink-500 to-rose-400 animate-pulse' :
                    status.type === 'full' ? 'bg-slate-400' : 'bg-white/90 text-pink-600 border border-pink-200'
                  }`}>
                    {status.text}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-0.5 mt-auto">
                  <div className="font-black text-white text-lg drop-shadow-md truncate pr-1">{girl.name}</div>
                  <span className="text-[10px] font-bold text-pink-100 drop-shadow-md shrink-0 bg-black/30 px-1.5 py-0.5 rounded">{girl.age}歳</span>
                </div>
                
                {/* コメント表示 */}
                {girl.comment && status.type !== 'full' && (
                  <div className="text-[10px] text-white/90 truncate font-medium drop-shadow-md mt-1 border-t border-white/20 pt-1">
                    {girl.comment}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* もっと見る */}
      <div className="mt-8 text-center">
        <Link href="/girls" className="inline-block bg-white text-sm font-bold text-pink-500 border-2 border-pink-200 px-8 py-3 rounded-full hover:bg-pink-50 hover:border-pink-300 transition-colors shadow-sm">
          全キャストを見る &gt;
        </Link>
      </div>
    </div>
  )
}
