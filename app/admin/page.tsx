'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// データベースへの鍵
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPage() {
  const [girls, setGirls] = useState<any[]>([])
  const [status, setStatus] = useState('確認中...')

  useEffect(() => {
    const checkData = async () => {
      // "girls" という引き出しを開けてみる
      const { data, error } = await supabase.from('girls').select('*')

      if (error) {
        setStatus('エラー：データベースに接続できませんでした💦')
        console.error(error)
      } else if (data && data.length > 0) {
        setGirls(data)
        setStatus(`✨ データ生きてます！ ${data.length}人の女の子がいます！`)
      } else {
        setStatus('データは空っぽです...（消えたか、まだ登録していません）')
      }
    }
    checkData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-2xl font-bold mb-6">🕵️‍♂️ データ生存確認モニター</h1>

      <div className={`p-6 rounded-xl border-2 text-center font-bold text-lg mb-8 ${
        girls.length > 0 ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-50 border-red-400 text-red-600'
      }`}>
        {status}
      </div>

      {girls.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">残っていたデータ一覧:</h2>
          <ul className="space-y-2">
            {girls.map((girl) => (
              <li key={girl.id} className="border-b pb-2 flex items-center gap-2">
                <span className="bg-slate-200 px-2 rounded text-sm">ID: {girl.id}</span>
                <span className="font-bold text-lg">{girl.name}</span>
                <span className="text-sm text-slate-500">（{girl.age}歳）</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
