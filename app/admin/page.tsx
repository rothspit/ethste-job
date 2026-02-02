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
  const [mode, setMode] = useState<'daily' | 'ranking'>('daily')

  // 編集・新規作成用
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGirl, setEditingGirl] = useState<any>(null) // nullなら新規作成モード

  // 入力フォーム用state
  const [formData, setFormData] = useState({
    name: '', age: '', height: '', bust: '', waist: '', hip: '', cup: '', schedule_comment: ''
  })
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  // データ取得
  const fetchGirls = async () => {
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

  // ランキング保存
  const saveRankings = async () => {
    try {
      setLoading(true)
      const updates = girls.map((girl) =>
        supabase.from('girls').update({ ranking_order: girl.ranking_order }).eq('id', girl.id)
      )
      await Promise.all(updates)
      alert('ランキングを更新しました！👑')
      fetchGirls()
    } catch (e) {
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  // 削除機能
  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？この操作は取り消せません。')) return
    await supabase.from('girls').delete().eq('id', id)
    fetchGirls()
  }

  // モーダルを開く（新規or編集）
  const openModal = (girl: any = null) => {
    if (girl) {
      // 編集モード
      setEditingGirl(girl)
      setFormData({
        name: girl.name, age: girl.age,
        height: girl.height, bust: girl.bust, waist: girl.waist, hip: girl.hip, cup: girl.cup || '',
        schedule_comment: girl.schedule_comment || ''
      })
    } else {
      // 新規モード
      setEditingGirl(null)
      setFormData({
        name: '', age: '', height: '', bust: '', waist: '', hip: '', cup: '', schedule_comment: ''
      })
    }
    setImageFile(null)
    setIsModalOpen(true)
  }

  // 保存処理（新規・更新共通）
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return alert('名前は必須です！')

    try {
      setUploading(true)
      let imageUrls = editingGirl ? (editingGirl.images || []) : []

      // 画像アップロード処理
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`

        // 既存の 'cast-photos' バケツを使用します！
        const { error: uploadError } = await supabase.storage
          .from('cast-photos') // 👈 ここを変更しました
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        // 公開URLを取得
        const { data: { publicUrl } } = supabase.storage
          .from('cast-photos') // 👈 ここも変更しました
          .getPublicUrl(fileName)

        // 新しい画像を登録（1枚目を上書きする仕様にします）
        imageUrls = [publicUrl]
      }

      const saveData = {
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height,
        bust: formData.bust,
        waist: formData.waist,
        hip: formData.hip,
        cup: formData.cup,
        schedule_comment: formData.schedule_comment,
        images: imageUrls
      }

      if (editingGirl) {
        // 更新
        await supabase.from('girls').update(saveData).eq('id', editingGirl.id)
      } else {
        // 新規作成
        await supabase.from('girls').insert([saveData])
      }

      alert('保存しました！✨')
      setIsModalOpen(false)
      fetchGirls()

    } catch (error: any) {
      console.error(error)
      alert(`エラーが発生しました: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <h1 className="font-bold text-lg">🛠 店長専用 コックピット</h1>
        <a href="/" target="_blank" className="text-xs bg-pink-600 px-3 py-1 rounded hover:bg-pink-500">サイトを確認 ➡</a>
      </header>

      <div className="max-w-4xl mx-auto p-4">

        {/* モード切り替え */}
        <div className="flex bg-white rounded-xl shadow mb-6 overflow-hidden">
          <button onClick={() => setMode('daily')} className={`flex-1 py-3 font-bold transition-colors ${mode === 'daily' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
            📅 日々の管理
          </button>
          <button onClick={() => setMode('ranking')} className={`flex-1 py-3 font-bold transition-colors ${mode === 'ranking' ? 'bg-yellow-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
            👑 ランキング
          </button>
        </div>

        {/* --- 📅 出勤・キャスト管理モード --- */}
        {mode === 'daily' && (
          <div>
             <div className="flex justify-between items-center mb-4">
               <h2 className="font-bold text-slate-700">キャスト一覧</h2>
               <button onClick={() => openModal()} className="bg-pink-600 text-white font-bold px-4 py-2 rounded-full shadow hover:bg-pink-500 flex items-center gap-1">
                 ＋ 新規入店
               </button>
             </div>

             <div className="space-y-3">
              {girls.map((girl) => (
                <div key={girl.id} className={`bg-white p-4 rounded-xl shadow border-l-4 ${girl.is_attending ? 'border-green-500 bg-green-50/30' : 'border-slate-300'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                        {girl.images?.[0] ? <img src={girl.images[0]} className="w-full h-full object-cover"/> : <div className="p-2 text-[10px] text-slate-400">No Image</div>}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{girl.name} <span className="text-sm font-normal text-slate-500">{girl.age}歳</span></div>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => toggleAttendance(girl.id, girl.is_attending)} className={`text-xs px-3 py-1 rounded-full border font-bold ${girl.is_attending ? 'bg-green-500 text-white border-green-600' : 'bg-white text-slate-500'}`}>
                            {girl.is_attending ? '🟢 出勤中' : '⚪️ お休み'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => openModal(girl)} className="bg-slate-100 px-3 py-1 rounded text-sm font-bold border text-slate-600">編集</button>
                      <button onClick={() => handleDelete(girl.id)} className="bg-red-50 px-3 py-1 rounded text-sm font-bold border border-red-100 text-red-400">削除</button>
                    </div>
                  </div>
                </div>
              ))}
             </div>
          </div>
        )}

        {/* --- 👑 ランキングモード --- */}
        {mode === 'ranking' && (
          <div>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4 text-sm text-yellow-800">
              <p><strong>💡 順位設定</strong>：1〜3位の数字を入力して保存してください。</p>
            </div>
            <div className="space-y-2">
              {girls.map((girl) => (
                <div key={girl.id} className="bg-white p-3 rounded-lg shadow flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded overflow-hidden">
                       {girl.images?.[0] && <img src={girl.images[0]} className="w-full h-full object-cover"/>}
                    </div>
                    <span className="font-bold">{girl.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">順位</span>
                    <input type="number" className="w-16 p-2 border-2 border-slate-300 rounded font-bold text-center focus:border-yellow-500 outline-none"
                      value={girl.ranking_order || 999}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 999
                        setGirls(girls.map(g => g.id === girl.id ? { ...g, ranking_order: val } : g))
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={saveRankings} className="sticky bottom-4 w-full bg-yellow-500 text-white font-black text-lg py-4 rounded-full shadow-lg mt-6">
              👑 順位を保存
            </button>
          </div>
        )}
      </div>

      {/* --- 新規登録・編集モーダル --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white p-4 font-bold flex justify-between items-center">
              <span>{editingGirl ? 'プロフィール編集' : '✨ 新規キャスト登録'}</span>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl leading-none">&times;</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
              {/* 画像アップロード */}
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center bg-slate-50">
                <p className="text-xs font-bold text-slate-500 mb-2">プロフィール写真</p>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"/>
                {editingGirl?.images?.[0] && !imageFile && (
                  <img src={editingGirl.images[0]} className="h-20 mx-auto mt-2 rounded object-cover shadow"/>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500">名前 <span className="text-red-500">*</span></label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded p-2" placeholder="例: さくら"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">年齢</label>
                  <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full border rounded p-2" placeholder="20"/>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div><label className="text-[10px] font-bold text-slate-400">身長</label><input type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full border rounded p-2 text-sm"/></div>
                <div><label className="text-[10px] font-bold text-slate-400">B</label><input type="number" value={formData.bust} onChange={e => setFormData({...formData, bust: e.target.value})} className="w-full border rounded p-2 text-sm"/></div>
                <div><label className="text-[10px] font-bold text-slate-400">Cup</label><input type="text" value={formData.cup} onChange={e => setFormData({...formData, cup: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="F"/></div>
                <div><label className="text-[10px] font-bold text-slate-400">W</label><input type="number" value={formData.waist} onChange={e => setFormData({...formData, waist: e.target.value})} className="w-full border rounded p-2 text-sm"/></div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500">ひとこと / 出勤予定</label>
                <input type="text" value={formData.schedule_comment} onChange={e => setFormData({...formData, schedule_comment: e.target.value})} className="w-full border rounded p-2" placeholder="例: 癒やします💕"/>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-lg">キャンセル</button>
                <button type="submit" disabled={uploading} className="flex-1 bg-pink-600 text-white font-bold py-3 rounded-lg shadow disabled:opacity-50">
                  {uploading ? '送信中...' : '保存する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
