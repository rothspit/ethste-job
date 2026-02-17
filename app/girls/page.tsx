'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Noto_Sans_JP } from 'next/font/google'

const baseFont = Noto_Sans_JP({ weight: ['700'], subsets: ['latin'], preload: false })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function GirlsListPage() {
  const [girls, setGirls] = useState<any[]>([])

  useEffect(() => {
    const fetchGirls = async () => {
      // 全員取得（ランキング順）
      const { data } = await supabase
        .from('girls')
        .select('*')
        .order('ranking_order', { ascending: true })
        .order('id', { ascending: true })

      if (data) setGirls(data)
    }
    fetchGirls()
  }, [])

  // 画像URLを取得するヘルパー関数
  const getImageUrl = (girl: any) => {
    if (girl.images && girl.images[0]) return girl.images[0]
    if (girl.image1_url) return girl.image1_url
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ヘッダー */}
      <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur text-white shadow-lg p-4 flex items-center justify-between">
        <Link href="/funabashi" className="font-bold text-lg">⬅ トップへ戻る</Link>
        <h1 className="font-bold">在籍キャスト一覧</h1>
      </div>

      <div className="max-w-2xl mx-auto px-2 py-4">
        <p className="text-center text-xs text-slate-500 mb-4">
          気になる子がいたら、お気軽にお問い合わせください💕
        </p>

        {/* グリッド表示（全員） */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {girls.map((girl) => {
            const imageUrl = getImageUrl(girl)
            return (
              <Link
                href={`/girls/${girl.id}`}
                key={girl.id}
                className="relative aspect-[3/4] bg-slate-200 cursor-pointer overflow-hidden group block"
              >
                {imageUrl ? (
                  <img src={imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Img</div>
                )}

                {/* 出勤中の子だけバッジをつける */}
                {girl.is_attending && (
                  <div className="absolute top-0 left-0">
                     <span className="bg-[#ff0066] text-white text-[10px] font-bold px-2 py-1 shadow-md inline-block animate-pulse">本日出勤</span>
                  </div>
                )}

                <div className="absolute bottom-0 w-full bg-black/70 backdrop-blur-[2px] p-1.5 text-white">
                  <p className="font-bold text-sm truncate">{girl.name} <span className="text-[10px] opacity-80">({girl.age})</span></p>
                  <p className="text-[10px] text-slate-300 mt-0.5 truncate">{girl.is_attending ? '✨ 即ご案内可能' : '💤 お休み中'}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
