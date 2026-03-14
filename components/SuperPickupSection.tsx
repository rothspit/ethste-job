'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function SuperPickupSection() {
  const [girls, setGirls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getPickupCasts() {
      setLoading(true)
      try {
        const d = new Date()
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const res = await fetch(`${process.env.NEXT_PUBLIC_CRM_API_URL}/idol/schedules?store_id=2&date=${dateStr}`)
        if (!res.ok) throw new Error('Failed to fetch schedules from CRM')

        const json = await res.json()
        const dayData = json.schedules && json.schedules.length > 0 ? json.schedules[0] : null
        const scheduledCasts = dayData ? dayData.casts : []
        
        // Filter active & pickup
        const activeStatuses = ['出勤', '即案内可能', '待機中', '接客中']
        const filtered = scheduledCasts.filter((c: any) => activeStatuses.includes(c.status) && c.is_pickup)
        
        setGirls(filtered)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    getPickupCasts()
  }, [])

  if (loading) return null
  if (girls.length === 0) return null

  // APIのstatus文字列を見て、状態を判定する関数
  const getStatus = (castStatus: string) => {
    if (!castStatus) return { type: 'normal', text: '時間未定' }
    if (castStatus === '即案内可能' || castStatus === '待機中') return { type: 'immediate', text: '即ご案内OK' }
    if (castStatus === '接客中') return { type: 'full', text: '接客中' }
    return { type: 'time', text: `${castStatus}` }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 relative">
      {/* キラキラ・ネオン装飾のヘッダー */}
      <div className="mb-6 text-center relative z-10">
         <div className="inline-block relative">
           <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-yellow-500 drop-shadow-[0_0_10px_rgba(255,105,180,0.8)] font-rounded tracking-widest relative z-10 py-1">
             🌟 超目玉キャスト 🌟
           </h2>
           <p className="text-xs md:text-sm font-bold text-pink-400 mt-2 tracking-widest uppercase animate-pulse">Super Pickup Casts</p>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
        {girls.map((girl: any) => {
          const status = getStatus(girl.status)
          const imageUrl = girl.image || null
          const videoUrl = girl.pickup_video_url || null

          return (
            <Link
              href={`/girls/${girl.id}`}
              key={girl.id}
              className="block relative rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(255,105,180,0.5)] hover:shadow-[0_0_30px_rgba(255,215,0,0.8)] transition-all transform hover:-translate-y-2 active:scale-95 aspect-[3/4] group border-4 border-transparent"
              style={{
                background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #ff007f, #ffd700, #ff007f, #8a2be2) border-box',
              }}
            >
              {/* 動画 or 背景画像 */}
              {videoUrl ? (
                <video 
                  src={videoUrl} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : imageUrl ? (
                <Image 
                  src={imageUrl} 
                  alt={girl.name} 
                  fill
                  quality={95}
                  priority={true}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-pink-300 bg-gradient-to-br from-pink-50 to-white font-bold">No Image</div>
              )}

              {/* オーバーレイグラデーション */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none"></div>

              {/* 即マーク */}
              {status.type === 'immediate' && (
                <div className="absolute top-3 left-3 flex items-center gap-1 z-20">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500 border-2 border-white shadow-lg"></span>
                  </span>
                </div>
              )}

              {/* キャスト情報 */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <div className="mb-2 flex flex-wrap gap-1">
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-black shadow-lg border ${
                    status.type === 'immediate' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-200 animate-pulse' :
                    status.type === 'full' ? 'bg-slate-700/80 text-white border-slate-500' : 'bg-black/60 text-pink-300 border-pink-500/50 backdrop-blur-sm'
                  }`}>
                    {status.text}
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <h3 className="font-black text-white text-2xl md:text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate">
                    {girl.name}
                  </h3>
                  <span className="text-sm font-bold text-yellow-300 drop-shadow-md bg-black/50 px-2 py-1 rounded border border-yellow-500/30">
                    {girl.age}歳
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
