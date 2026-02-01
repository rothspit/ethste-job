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
    const fetchGirls = async () => {
      const { data } = await supabase
        .from('girls')
        .select('*')
        .order('ranking_order', { ascending: true })
        .limit(3)

      if (data) {
        setGirls(data)
      }
    }
    fetchGirls()
  }, [])

  if (girls.length === 0) {
    return (
      <section className="py-10 px-4 text-center">
        <h3 className="text-2xl font-black text-slate-800 mb-6">👑 本日のランキング</h3>
        <p className="text-slate-400">現在集計中です...</p>
      </section>
    )
  }

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
              <div className={`absolute top-0 left-0 text-white text-xs font-black px-3 py-1 rounded-br-lg z-10 ${
                index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-400' : 'bg-orange-400'
              }`}>
                {index + 1}位
              </div>

              {/* 画像エリア */}
              <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={girl.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 font-bold">No Image</div>
                )}
              </div>

              <div className="p-3">
                <div className="flex justify-between items-end mb-1">
                  <h4 className="font-bold text-lg text-slate-800">{girl.name}</h4>
                  <span className="text-sm text-pink-500 font-bold">{girl.age ? `${girl.age}歳` : ''}</span>
                </div>
                <p className="text-xs text-slate-500">
                  {girl.height && `T${girl.height} `}
                  {girl.bust && `B${girl.bust} `}
                  {girl.waist && `W${girl.waist} `}
                  {girl.hip && `H${girl.hip}`}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="text-center mt-8">
        <Link href="/funabashi/girls" className="inline-block border-2 border-pink-500 text-pink-600 font-bold px-8 py-2 rounded-full hover:bg-pink-50 transition-colors">
          女の子一覧を見る
        </Link>
      </div>
    </section>
  )
}
