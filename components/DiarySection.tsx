'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DiarySection() {
  const [diaries, setDiaries] = useState<any[]>([])

  useEffect(() => {
    const fetchDiaries = async () => {
      // 最新10件を取得（書いた子の名前とアイコン画像も一緒に取ってくる）
      const { data } = await supabase
        .from('diaries')
        .select('*, girls(name, images)')
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) setDiaries(data)
    }
    fetchDiaries()
  }, [])

  // 日記がまだなければ何も表示しない
  if (diaries.length === 0) return null

  return (
    <div className="max-w-2xl mx-auto px-4 my-6">
      {/* タイトル */}
      <h2 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
        📷 写メ日記 <span className="text-[10px] font-bold text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100 animate-pulse">New Posts</span>
      </h2>

      {/* 横スクロールエリア */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {diaries.map((diary) => (
          <Link href={`/diaries/${diary.id}`} key={diary.id} className="min-w-[140px] w-[140px] flex-shrink-0 group">

            {/* 画像エリア */}
            <div className="aspect-square bg-slate-200 rounded-xl overflow-hidden mb-2 relative border border-slate-100 shadow-sm">
              {diary.images?.[0] || diary.image_url ? (
                <img src={diary.images?.[0] || diary.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">No Image</div>
              )}

              {/* アイコン重ね（誰の日記かわかるように） */}
              <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-300 shadow-md">
                {diary.girls?.images?.[0] && <img src={diary.girls.images[0]} className="w-full h-full object-cover"/>}
              </div>
            </div>

            {/* テキストエリア */}
            <p className="text-xs font-bold text-slate-700 truncate">{diary.title}</p>
            <div className="flex justify-between items-center mt-0.5">
               <p className="text-[10px] text-pink-500 font-bold truncate">{diary.girls?.name}</p>
               <p className="text-[10px] text-slate-400">{new Date(diary.created_at).getMonth() + 1}/{new Date(diary.created_at).getDate()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
