'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RankingSection() {
  const [girls, setGirls] = useState<any[]>([])

  useEffect(() => {
    const fetchRanking = async () => {
      // 1位〜3位だけを取得
      const { data } = await supabase
        .from('girls')
        .select('*')
        .lte('ranking_order', 3) // 3位以内
        .order('ranking_order', { ascending: true })

      if (data) setGirls(data)
    }
    fetchRanking()
  }, [])

  if (girls.length === 0) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 👇 タイトル変更：先月のランキング */}
      <h2 className="text-xl font-black text-center mb-6 text-slate-800 flex items-center justify-center gap-2">
        <span className="text-yellow-500 text-2xl">👑</span> 先月の人気ランキング
      </h2>

      <div className="grid grid-cols-3 gap-3">
        {girls.map((girl) => (
          <div key={girl.id} className="relative group">
            {/* 順位バッジ */}
            <div className={`absolute -top-3 -left-2 z-10 w-8 h-8 flex items-center justify-center rounded-full font-black text-white shadow-md border-2 border-white ${
              girl.ranking_order === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-lg' :
              girl.ranking_order === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500' :
              'bg-gradient-to-br from-amber-600 to-amber-700'
            }`}>
              {girl.ranking_order}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-100">
              <div className="aspect-[3/4] bg-slate-200 relative">
                {(girl.images?.[0] || girl.image1_url) ? (
                  <img src={girl.images?.[0] || girl.image1_url} alt={girl.name} className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Photo</div>
                )}
              </div>
              <div className="p-2 text-center">
                <p className="font-bold text-sm text-slate-800">{girl.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{girl.age ? `${girl.age}歳` : ''}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
