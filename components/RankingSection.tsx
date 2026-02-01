'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 画像URLを取得するヘルパー関数
const getImageUrl = (girl: any) => {
  if (girl.images && girl.images[0]) return girl.images[0]
  if (girl.image1_url) return girl.image1_url
  return null
}

export default function RankingSection() {
  const [girls, setGirls] = useState<any[]>([])

  useEffect(() => {
    const fetchRanking = async () => {
      const { data } = await supabase
        .from('girls')
        .select('*')
        .lt('ranking_order', 100)
        .order('ranking_order', { ascending: true })
        .limit(5)

      if (data) setGirls(data)
    }
    fetchRanking()
  }, [])

  if (girls.length === 0) return null

  return (
    <section className="py-10 px-4">
      <h3 className="text-2xl font-black text-center text-slate-800 mb-6">
        <span className="text-yellow-500">👑</span> 本日のランキング
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {girls.map((girl, index) => {
          const imageUrl = getImageUrl(girl)
          return (
            <Link key={girl.id} href={`/girls/${girl.id}`} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all relative">
              {/* 順位バッジ */}
              <div className={`absolute top-0 left-0 text-white text-xs font-black px-3 py-1 rounded-br-lg z-10 shadow-md ${
                index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                index === 1 ? 'bg-gradient-to-r from-slate-300 to-slate-500' :
                index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-slate-800'
              }`}>
                {index + 1}位
              </div>

              <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt={girl.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 font-bold">No Image</div>
                )}
              </div>

              <div className="p-3">
                <div className="flex justify-between items-end mb-1">
                  <h4 className="font-bold text-lg text-slate-800">{girl.name}</h4>
                  <span className="text-sm text-pink-500 font-bold">{girl.age}歳</span>
                </div>
                <p className="text-xs text-slate-500">
                   T{girl.height} B{girl.bust}({girl.cup || '?'})
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
