'use client'
import { useEffect, useState } from 'react'
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
      const { data } = await supabase
        .from('girls')
        .select('*')
        .eq('is_active', true)
        .limit(6)

      if (data) {
        setGirls(data)
      }
    }
    fetchGirls()
  }, [])

  return (
    <section className="py-8 px-4">
      <h3 className="text-2xl font-black text-center text-slate-800 mb-6">
        <span className="text-green-500">📅</span> 本日の出勤
      </h3>

      {girls.length === 0 ? (
        <p className="text-center text-slate-400">出勤情報を読み込み中...</p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 max-w-4xl mx-auto">
          {girls.map((girl) => (
            <Link key={girl.id} href={`/girls/${girl.id}`} className="group">
              <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden relative">
                {girl.images && girl.images[0] ? (
                  <img
                    src={girl.images[0]}
                    alt={girl.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-xs">No Image</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1 font-bold">
                  {girl.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-6">
        <Link href="/funabashi/girls" className="text-pink-600 font-bold text-sm underline">
          出勤一覧を見る →
        </Link>
      </div>
    </section>
  )
}
