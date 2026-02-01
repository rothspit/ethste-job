'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

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

export default function AdminPage() {
  const [girls, setGirls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingGirl, setEditingGirl] = useState<any>(null) // 編集中の女の子

  // データ取得
  const fetchGirls = async () => {
    const { data } = await supabase.from('girls').select('*').order('id', { ascending: true })
    if (data) setGirls(data)
    setLoading(false)
  }

  useEffect(() => { fetchGirls() }, [])

  // 出勤スイッチの切り替え
  const toggleAttendance = async (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus
    // 画面を先に更新（サクサク感のため）
    setGirls(girls.map(g => g.id === id ? { ...g, is_attending: newStatus } : g))

    // 裏で保存
    await supabase.from('girls').update({ is_attending: newStatus }).eq('id', id)
  }

  // プロフィール更新保存
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGirl) return

    const { error } = await supabase
      .from('girls')
      .update({
        name: editingGirl.name,
        age: editingGirl.age,
        height: editingGirl.height,
        bust: editingGirl.bust,
        waist: editingGirl.waist,
        hip: editingGirl.hip,
        schedule_comment: editingGirl.schedule_comment
      })
      .eq('id', editingGirl.id)

    if (!error) {
      alert('保存しました！✨')
      setEditingGirl(null) // モーダル閉じる
      fetchGirls() // データ再取得
    } else {
      alert('エラーが発生しました💦')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* ヘッダー */}
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <h1 className="font-bold text-lg">🛠 店長専用 コックピット</h1>
        <a href="/" target="_blank" className="text-xs bg-pink-600 px-3 py-1 rounded hover:bg-pink-500">サイトを確認 ➡</a>
      </header>

      <div className="max-w-4xl mx-auto p-4">

        {/* ステータスバー */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-bold">在籍キャスト</p>
            <p className="text-2xl font-black">{girls.length}名</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold">本日の出勤</p>
            <p className="text-2xl font-black text-green-600">
              {girls.filter(g => g.is_attending).length}名
            </p>
          </div>
        </div>

        {/* キャスト一覧 */}
        <h2 className="font-bold text-slate-700 mb-2">キャスト管理リスト</h2>
        {loading ? <p>読み込み中...</p> : (
          <div className="space-y-3">
            {girls.map((girl) => (
              <div key={girl.id} className={`bg-white p-4 rounded-xl shadow border-l-4 transition-all ${girl.is_attending ? 'border-green-500 bg-green-50/30' : 'border-slate-300'}`}>
                <div className="flex justify-between items-start">

                  {/* 左側：情報 */}
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                      {getImageUrl(girl) ? (
                        <img src={getImageUrl(girl)} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Image</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">
                        {girl.name} <span className="text-sm font-normal text-slate-500">{girl.age}歳</span>
                      </h3>
                      <p className="text-xs text-slate-400 mb-1">T{girl.height} B{girl.bust} W{girl.waist} H{girl.hip}</p>

                      {/* 出勤スイッチ */}
                      <button
                        onClick={() => toggleAttendance(girl.id, girl.is_attending)}
                        className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${
                          girl.is_attending
                            ? 'bg-green-500 text-white border-green-600 shadow-md'
                            : 'bg-white text-slate-400 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {girl.is_attending ? '🟢 本日出勤中' : '⚪️ お休み'}
                      </button>
                    </div>
                  </div>

                  {/* 右側：編集ボタン */}
                  <button
                    onClick={() => setEditingGirl(girl)}
                    className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-slate-200"
                  >
                    編集
                  </button>
                </div>

                {/* ひとことコメント表示 */}
                {girl.schedule_comment && (
                  <div className="mt-2 text-xs text-slate-500 bg-slate-100 p-2 rounded">
                    💬 {girl.schedule_comment}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 編集モーダル（画面の上に重なって出るやつ） */}
      {editingGirl && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-slate-900 text-white p-4 font-bold flex justify-between">
              <span>{editingGirl.name}さんの編集</span>
              <button onClick={() => setEditingGirl(null)}>✕</button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500">名前</label>
                  <input type="text" value={editingGirl.name} onChange={e => setEditingGirl({...editingGirl, name: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">年齢</label>
                  <input type="number" value={editingGirl.age} onChange={e => setEditingGirl({...editingGirl, age: e.target.value})} className="w-full border rounded p-2" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-500">身長</label>
                  <input type="number" value={editingGirl.height || ''} onChange={e => setEditingGirl({...editingGirl, height: e.target.value})} className="w-full border rounded p-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">B</label>
                  <input type="number" value={editingGirl.bust || ''} onChange={e => setEditingGirl({...editingGirl, bust: e.target.value})} className="w-full border rounded p-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">W</label>
                  <input type="number" value={editingGirl.waist || ''} onChange={e => setEditingGirl({...editingGirl, waist: e.target.value})} className="w-full border rounded p-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">H</label>
                  <input type="number" value={editingGirl.hip || ''} onChange={e => setEditingGirl({...editingGirl, hip: e.target.value})} className="w-full border rounded p-1" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500">出勤時のひとこと (例: 12時〜います！)</label>
                <input type="text" value={editingGirl.schedule_comment || ''} onChange={e => setEditingGirl({...editingGirl, schedule_comment: e.target.value})} className="w-full border rounded p-2" placeholder="本日の予定など" />
              </div>

              <div className="pt-4 flex gap-2">
                <button type="button" onClick={() => setEditingGirl(null)} className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-lg">キャンセル</button>
                <button type="submit" className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg shadow">保存する</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
