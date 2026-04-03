'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function RankingSection() {
  const [girls, setGirls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_CRM_API_URL || 'https://crm.h-mitsu.com/api'
        const res = await fetch(`${baseUrl}/idol/casts?store_id=2`, {
          cache: 'no-store'
        })
        const data = await res.json()
        const castsArray = Array.isArray(data) ? data : (data.casts || data.data || [])
        
        // ランキング用の順位を指定（1位: いちご, 2位: れいら, 3位: なな）
        const rankingIds = [1254, 21, 1255];
        const topCasts = rankingIds.map((targetId, index) => {
          const matchedCast = castsArray.find((c: any) => Number(c.id) === targetId);
          if (!matchedCast) return null;
          return {
            ...matchedCast,
            ranking_order: index + 1
          };
        }).filter(Boolean);
        
        setGirls(topCasts)
      } catch (err) {
        console.error('Failed to fetch ranking:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRanking()
  }, [])

  if (loading) return null;
  if (girls.length === 0) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-xl font-black text-center mb-6 text-pink-600 flex items-center justify-center gap-2">
        <span className="text-pink-400 text-2xl">👑</span> 3月分の人気ランキング
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {girls.map((girl: any) => {
           const imageUrl = girl.idol_image_path || girl.image || (girl.images && girl.images[0]) || girl.image1_url || null;
           
           return (
            <Link href={`/girls/${girl.id}`} key={girl.id} className="block relative group">
              {/* 順位バッジ */}
              <div className={`absolute -top-3 -left-2 z-10 w-8 h-8 flex items-center justify-center rounded-full font-black text-white shadow-sm border-2 border-white ${
                girl.ranking_order === 1 ? 'bg-gradient-to-br from-pink-400 to-rose-400 text-lg shadow-pink-200' :
                girl.ranking_order === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 shadow-slate-200' :
                'bg-gradient-to-br from-amber-600 to-amber-500 shadow-amber-200'
              }`}>
                {girl.ranking_order}
              </div>

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-pink-100 group-hover:shadow-md transition-shadow">
                <div className="aspect-[4/5] bg-pink-50 relative">
                  {imageUrl ? (
                    <Image 
                      src={imageUrl} 
                      alt={girl.name} 
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-pink-300 font-bold">No Photo</div>
                  )}
                </div>
                <div className="p-2 text-center bg-white relative z-10">
                  <div className="font-rounded font-black text-sm text-pink-600 drop-shadow-sm truncate">{girl.name}</div>
                  <div className="font-rounded text-[10px] font-bold text-pink-400 mt-0.5">{girl.age ? `${girl.age}歳` : ''}</div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
