'use client'
import { useState, useEffect } from 'react'
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

export default function ScheduleSection() {
  const [activeTab, setActiveTab] = useState('today')
  const [girls, setGirls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGirls = async () => {
      setLoading(true)
      let query = supabase.from('girls').select('*')

      if (activeTab === 'today') {
        query = query.eq('is_attending', true)
      } else {
        query = query.order('id', { ascending: true }).limit(10)
      }

      const { data } = await query
      if (data) setGirls(data)
      setLoading(false)
    }

    fetchGirls()
  }, [activeTab])

  return (
    <section className="py-8 px-4 bg-slate-50">
      <h3 className="text-2xl font-black text-center text-slate-800 mb-6">
        <span className="text-pink-500">📅</span> 出勤スケジュール
      </h3>

      {/* タブ切り替え */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            activeTab === 'today'
              ? 'bg-pink-500 text-white shadow-lg scale-105'
              : 'bg-white text-slate-500 border hover:bg-slate-100'
          }`}
        >
          本日の出勤
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            activeTab === 'weekly'
              ? 'bg-blue-500 text-white shadow-lg scale-105'
              : 'bg-white text-slate-500 border hover:bg-slate-100'
          }`}
        >
          週間予定
        </button>
      </div>

      {/* リスト表示 */}
      {loading ? (
        <div className="text-center py-10 text-slate-400">読み込み中...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {girls.length > 0 ? (
            girls.map((girl) => {
              const imageUrl = getImageUrl(girl)
              return (
                <Link key={girl.id} href={`/girls/${girl.id}`} className="group bg-white rounded-lg shadow border border-slate-100 overflow-hidden flex flex-col hover:shadow-lg transition-all">
                  <div className="relative aspect-[3/4] bg-slate-200 overflow-hidden">
                     {imageUrl ? (
                       <img src={imageUrl} alt={girl.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     ) : (
                       <div className="flex items-center justify-center h-full text-xs text-slate-400">No Image</div>
                     )}

                     {/* ステータスバッジ */}
                     <div className={`absolute bottom-0 w-full text-white text-[10px] text-center py-1 font-bold ${
                       activeTab === 'today' ? 'bg-green-600/90' : 'bg-blue-600/90'
                     }`}>
                       {activeTab === 'today' ? '🟢 只今ご案内OK' : '次回: お問合せ下さい'}
                     </div>
                  </div>

                  <div className="p-2 text-center">
                    <div className="font-bold text-slate-800 text-lg">{girl.name}</div>
                    <div className="text-xs text-pink-500 font-bold mb-1">
                      {girl.age}歳 T{girl.height || '??'} <span className="text-slate-300">|</span> B{girl.bust || '??'}({girl.cup || '?'})
                    </div>

                    {girl.schedule_comment ? (
                      <div className="mt-1 text-[10px] bg-yellow-50 text-slate-600 border border-yellow-200 rounded px-1 py-1 line-clamp-1">
                        {girl.schedule_comment}
                      </div>
                    ) : (
                      <div className="mt-1 text-[10px] bg-pink-50 text-pink-600 border border-pink-100 rounded px-1 py-1">
                        12:00 〜 LAST
                      </div>
                    )}
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="col-span-full text-center py-8 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-bold">
                {activeTab === 'today' ? '現在、本日の出勤データはありません🙇‍♂️' : 'スケジュール調整中です'}
              </p>
              <p className="text-xs text-slate-400 mt-1">チャットにてお気軽にお問い合わせください。</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
