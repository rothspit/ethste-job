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
  const [mode, setMode] = useState<'daily' | 'ranking'>('daily') // モード切り替え
  const [editingGirl, setEditingGirl] = useState<any>(null)

  // データ取得
  const fetchGirls = async () => {
    // ランキング順（昇順）で取得。ランキング設定がない人(999)は後ろにいく
    const { data } = await supabase
      .from('girls')
      .select('*')
      .order('ranking_order', { ascending: true })
      .order('id', { ascending: true })

    if (data) setGirls(data)
    setLoading(false)
  }

  useEffect(() => { fetchGirls() }, [])

  // 出勤スイッチ
  const toggleAttendance = async (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus
    setGirls(girls.map(g => g.id === id ? { ...g, is_attending: newStatus } : g))
    await supabase.from('girls').update({ is_attending: newStatus }).eq('id', id)
  }

  // ランキング順位の一括保存
  const saveRankings = async () => {
    try {
      setLoading(true)
      // 変更された順位をまとめて保存
      const updates = girls.map((girl) =>
        supabase.from('girls').update({ ranking_order: girl.ranking_order }).eq('id', girl.id)
      )
      await Promise.all(updates)
      alert('ランキングを更新しました！👑')
      fetchGirls() // 再取得して並び直す
    } catch (e) {
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  // プロフィール保存
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGirl) return
    const { error } = await supabase.from('girls').update({
        name: editingGirl.name, age: editingGirl.age,
        height: editingGirl.height, bust: editingGirl.bust,
        waist: editingGirl.waist, hip: editingGirl.hip,
        schedule_comment: editingGirl.schedule_comment
      }).eq('id', editingGirl.id)
    if (!error) {
      alert('保存しました！✨')
      setEditingGirl(null)
      fetchGirls()
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <h1 className="font-bold text-lg">🛠 店長専用 コックピット</h1>
        <a href="/" target="_blank" className="text-xs bg-pink-600 px-3 py-1 rounded hover:bg-pink-500">サイトを確認 ➡</a>
      </header>

      <div className="max-w-4xl mx-auto p-4">

        {/* モード切り替えタブ */}
        <div className="flex bg-white rounded-xl shadow mb-6 overflow-hidden">
          <button
            onClick={() => setMode('daily')}
            className={`flex-1 py-3 font-bold text-center transition-colors ${mode === 'daily' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            📅 日々の出勤管理
          </button>
          <button
            onClick={() => setMode('ranking')}
            className={`flex-1 py-3 font-bold text-center transition-colors ${mode === 'ranking' ? 'bg-yellow-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            👑 ランキング設定
          </button>
        </div>

        {/* --- 📅 出勤管理モード --- */}
        {mode === 'daily' && (
          <div>
             <h2 className="font-bold text-slate-700 mb-2">キャスト一覧</h2>
             <div className="space-y-3">
              {girls.map((girl) => (
                <div key={girl.id} className={`bg-white p-4 rounded-xl shadow border-l-4 ${girl.is_attending ? 'border-green-500 bg-green-50/30' : 'border-slate-300'}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-200 rounded overflow-hidden">
                        {girl.images?.[0] && <img src={girl.images[0]} className="w-full h-full object-cover"/>}
                      </div>
                      <div>
                        <div className="font-bold">{girl.name}</div>
                        <button onClick={() => toggleAttendance(girl.id, girl.is_attending)} className={`text-xs px-2 py-1 rounded border mt-1 ${girl.is_attending ? 'bg-green-500 text-white' : 'bg-white'}`}>
                          {girl.is_attending ? '🟢 出勤中' : '⚪️ お休み'}
                        </button>
                      </div>
                    </div>
                    <button onClick={() => setEditingGirl(girl)} className="bg-slate-100 px-3 py-2 rounded text-sm font-bold">編集</button>
                  </div>
                </div>
              ))}
             </div>
          </div>
        )}

        {/* --- 👑 ランキング設定モード --- */}
        {mode === 'ranking' && (
          <div className="animate-fade-in">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4 text-sm text-yellow-800">
              <p><strong>💡 設定方法</strong></p>
              <p>1位、2位、3位にしたい子に数字を入力して、一番下の「順位を保存」ボタンを押してください。<br/>（ランキング外の子は「999」にしておけば表示されません）</p>
            </div>

            <div className="space-y-2">
              {girls.map((girl) => (
                <div key={girl.id} className="bg-white p-3 rounded-lg shadow flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded overflow-hidden">
                       {girl.images?.[0] && <img src={girl.images[0]} className="w-full h-full object-cover"/>}
                    </div>
                    <span className="font-bold text-lg">{girl.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">順位:</span>
                    <input
                      type="number"
                      className="w-16 p-2 border-2 border-slate-300 rounded font-bold text-center focus:border-yellow-500 outline-none"
                      value={girl.ranking_order || 999}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 999
                        setGirls(girls.map(g => g.id === girl.id ? { ...g, ranking_order: val } : g))
                      }}
                    />
                    <span className="text-sm font-bold">位</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-4 mt-6">
              <button
                onClick={saveRankings}
                className="w-full bg-yellow-500 text-white font-black text-lg py-4 rounded-full shadow-lg hover:bg-yellow-400 transition-transform active:scale-95"
              >
                👑 ランキング順位を保存して更新
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 編集モーダル（省略せずそのまま残します） */}
      {editingGirl && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h3 className="font-bold mb-4">{editingGirl.name}の編集</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
               {/* 入力項目省略なしで記述 */}
               <div className="grid grid-cols-2 gap-2">
                 <input placeholder="名前" value={editingGirl.name} onChange={e=>setEditingGirl({...editingGirl, name:e.target.value})} className="border p-2 rounded"/>
                 <input placeholder="年齢" type="number" value={editingGirl.age} onChange={e=>setEditingGirl({...editingGirl, age:e.target.value})} className="border p-2 rounded"/>
               </div>
               <div className="grid grid-cols-4 gap-2">
                 <input placeholder="T" value={editingGirl.height||''} onChange={e=>setEditingGirl({...editingGirl, height:e.target.value})} className="border p-1 rounded"/>
                 <input placeholder="B" value={editingGirl.bust||''} onChange={e=>setEditingGirl({...editingGirl, bust:e.target.value})} className="border p-1 rounded"/>
                 <input placeholder="W" value={editingGirl.waist||''} onChange={e=>setEditingGirl({...editingGirl, waist:e.target.value})} className="border p-1 rounded"/>
                 <input placeholder="H" value={editingGirl.hip||''} onChange={e=>setEditingGirl({...editingGirl, hip:e.target.value})} className="border p-1 rounded"/>
               </div>
               <input placeholder="ひとこと" value={editingGirl.schedule_comment||''} onChange={e=>setEditingGirl({...editingGirl, schedule_comment:e.target.value})} className="border p-2 w-full rounded"/>
               <div className="flex gap-2">
                 <button type="button" onClick={()=>setEditingGirl(null)} className="flex-1 bg-slate-200 p-2 rounded">キャンセル</button>
                 <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">保存</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
