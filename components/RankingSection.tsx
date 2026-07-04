'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

type RankingEntry = {
  rank: number
  cast_id: number
  name: string
  age: number | null
  photo_url: string | null
}

type RankingResponse = {
  success: boolean
  period_label?: string
  rankings: RankingEntry[]
}

type RankingSectionProps = {
  storeId?: number
  limit?: number
}

export default function RankingSection({ storeId = 2, limit = 10 }: RankingSectionProps) {
  const [girls, setGirls] = useState<RankingEntry[]>([])
  const [periodLabel, setPeriodLabel] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_CRM_API_URL || 'https://crm.st-online.jp/api'
        const res = await fetch(
          `${baseUrl}/rankings/honshimei?store_id=${storeId}&period=last_month&limit=${limit}`
        )
        if (!res.ok) return

        const data: RankingResponse = await res.json()
        if (!data.success || !Array.isArray(data.rankings) || data.rankings.length === 0) return

        setPeriodLabel(data.period_label || '')
        setGirls(data.rankings)
      } catch (err) {
        console.error('Failed to fetch ranking:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRanking()
  }, [storeId, limit])

  if (loading) return null
  if (girls.length === 0) return null

  const title = periodLabel ? `${periodLabel}分の人気ランキング` : '先月分の人気ランキング'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-xl font-black text-center mb-6 text-pink-600 flex items-center justify-center gap-2">
        <span className="text-pink-400 text-2xl">👑</span> {title}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {girls.map((girl) => (
          <Link href={`/girls/${girl.cast_id}`} key={girl.cast_id} className="block relative group">
            <div
              className={`absolute -top-3 -left-2 z-10 w-8 h-8 flex items-center justify-center rounded-full font-black text-white shadow-sm border-2 border-white ${
                girl.rank === 1
                  ? 'bg-gradient-to-br from-pink-400 to-rose-400 text-lg shadow-pink-200'
                  : girl.rank === 2
                    ? 'bg-gradient-to-br from-slate-300 to-slate-400 shadow-slate-200'
                    : girl.rank === 3
                      ? 'bg-gradient-to-br from-amber-600 to-amber-500 shadow-amber-200'
                      : 'bg-gradient-to-br from-pink-300 to-pink-400 shadow-pink-100 text-sm'
              }`}
            >
              {girl.rank}
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-pink-100 group-hover:shadow-md transition-shadow">
              <div className="aspect-[4/5] bg-pink-50 relative">
                {girl.photo_url ? (
                  <Image
                    src={girl.photo_url}
                    alt={girl.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-pink-300 font-bold">
                    No Photo
                  </div>
                )}
              </div>
              <div className="p-2 text-center bg-white relative z-10">
                <div className="font-rounded font-black text-sm text-pink-600 drop-shadow-sm truncate">
                  {girl.name}
                </div>
                <div className="font-rounded text-[10px] font-bold text-pink-400 mt-0.5">
                  {girl.age ? `${girl.age}歳` : ''}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
