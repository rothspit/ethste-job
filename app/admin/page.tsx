'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPage() {
  const [girls, setGirls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // データを取得
  const fetchGirls = async () => {
    const { data, error } = await supabase
      .from('girls')
      .select('*')
      .order('id', { ascending: true })

    if (data) setGirls(data)
    setLoading(false)
  }

  useEffect(() => { fetchGirls() }, [])

  // 削除機能
  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return
    await supabase.from('girls').delete().eq('id', id)
    fetchGirls() // 画面更新
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-black mb-6">🛠 女の子管理画面（CMS）</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p className="text-sm text-slate-500 mb-2">※ここから新しい女の子を追加できます（現在は簡易版）</p>
        <button className="bg-blue-600 text-white font-bold px-4 py-2 rounded hover:bg-blue-500">
          ＋ 女の子を新規登録
        </button>
      </div>

      <h2 className="font-bold text-lg mb-4">登録済みキャスト一覧</h2>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div className="space-y-4">
          {girls.map((girl) => (
            <div key={girl.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div className="flex gap-4 items-center">
                {girl.images?.[0] && (
                  <img src={girl.images[0]} className="w-12 h-12 rounded object-cover" />
                )}
                <div>
                  <div className="font-bold text-lg">{girl.name} <span className="text-sm font-normal text-slate-500">({girl.age}歳)</span></div>
                  <div className="text-xs text-slate-400">T{girl.height} B{girl.bust} W{girl.waist} H{girl.hip}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-slate-200 text-slate-700 px-3 py-1 rounded text-sm hover:bg-slate-300">編集</button>
                <button onClick={() => handleDelete(girl.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200">削除</button>
              </div>
            </div>
          ))}
          {girls.length === 0 && <p>データがありません。</p>}
        </div>
      )}
    </div>
  )
}
