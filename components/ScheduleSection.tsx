'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ScheduleSection() {
  const [girls, setGirls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getTodayGirls() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_CRM_API_URL}/idol/casts?store_id=2`)
        if (!res.ok) throw new Error('Failed to fetch girls from CRM')

        const json = await res.json()
        const allCasts = json.casts || []
        
        const filtered = allCasts.filter((c: any) => c.status !== 'お休み中' && c.status !== '退店')
        setGirls(filtered)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    getTodayGirls()
  }, [])

  // 画像URLを取得するヘルパー関数
  const getImageUrl = (g: any) => g.image || null

  // APIのstatus文字列を見て、状態を判定する関数
  const getStatus = (castStatus: string) => {
    if (!castStatus) return { type: 'normal', text: '時間未定', color: 'bg-slate-100 text-slate-500' }

    if (castStatus === '即案内可能' || castStatus === '待機中') {
      return {
        type: 'immediate',
        text: '即ご案内OK',
        color: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white animate-pulse shadow-pink-200 shadow-lg'
      }
    }
    if (castStatus === '接客中') {
      return {
        type: 'full',
        text: '接客中',
        color: 'bg-slate-200 text-slate-400'
      }
    }
    return {
      type: 'time',
      text: `${castStatus}`,
      color: 'bg-white border-2 border-pink-500 text-pink-600'
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <span className="text-2xl">⚡️</span> 本日の出勤
        </h2>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded" suppressHydrationWarning>
          {new Date().toLocaleDateString()} 更新
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {girls.length === 0 ? (
           <div className="col-span-full py-6 text-center text-sm text-slate-400 font-bold bg-slate-100 rounded-xl">現在、本日の出勤メンバーはいません</div>
        ) : girls.map((girl: any) => {
          const status = getStatus(girl.status)
          const imageUrl = getImageUrl(girl)

          return (
            <Link
              href={`/girls/${girl.id}`}
              key={girl.id}
              className={`block relative rounded-xl overflow-hidden shadow-lg transition-transform active:scale-[0.98] aspect-[4/5] bg-slate-200 group ${status.type === 'full' ? 'opacity-70 grayscale' : ''}`}
            >
              {/* 背景画像 */}
              {imageUrl ? (
                <Image 
                  src={imageUrl} 
                  alt={girl.name} 
                  fill
                  quality={95}
                  priority={true}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Image</div>
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
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 z-10">
                
                {/* ステータスバッジ */}
                <div className="mb-1.5 flex flex-wrap gap-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm ${
                    status.type === 'immediate' ? 'bg-pink-600' :
                    status.type === 'full' ? 'bg-slate-600' : 'bg-slate-800/80 border border-slate-600'
                  }`}>
                    {status.text}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-0.5 mt-auto">
                  <h3 className="font-black text-white text-lg drop-shadow-md truncate pr-1">{girl.name}</h3>
                  <span className="text-[10px] font-bold text-slate-200 drop-shadow-md shrink-0">{girl.age}歳</span>
                </div>
                
                {/* コメント表示 */}
                {girl.comment && status.type !== 'full' && (
                  <p className="text-[10px] text-slate-300 truncate font-medium drop-shadow-md">
                    {girl.comment}
                  </p>
                )}
              </div>
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
