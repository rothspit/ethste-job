'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // ログイン確認（未ログインなら強制的にログイン画面へ）
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return window.location.href = '/login'
      setUser(user)

      // メッセージ取得
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) console.error('取得エラー:', error)
      if (data) setMessages(data) // 自分のIDで絞らず一旦全表示で見れるかテスト
    }
    init()

    // リアルタイム受信
    const channel = supabase.channel('chat_room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // 画像アップロード
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return
    setUploading(true)
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage.from('chat-images').upload(filePath, file)
    if (uploadError) {
      alert('画像アップ失敗: ' + uploadError.message)
      setUploading(false)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('chat-images').getPublicUrl(filePath)

    await supabase.from('chat_messages').insert({
      user_id: user.id,
      content: '画像を送信しました',
      image_url: publicUrl,
      is_admin: false
    })
    setUploading(false)
  }

  // メッセージ送信
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    // エラーを確認しながら送信
    const { error } = await supabase.from('chat_messages').insert({
      user_id: user.id,
      content: newMessage,
      is_admin: false
    })

    if (error) {
      alert('送信エラー: ' + error.message) // エラーがあれば画面に出す
    } else {
      setNewMessage('') // 成功したら空にする
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* ヘッダー：黒背景・白文字 */}
      <div className="bg-slate-900 text-white p-4 shadow flex justify-between items-center sticky top-0 z-10">
        <h1 className="font-bold">💬 店長直通チャット</h1>
        <a href="/" className="text-xs bg-slate-700 px-3 py-1 rounded border border-slate-500">戻る</a>
      </div>

      {/* メッセージエリア：白背景 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}>
            {/* 吹き出しのデザイン修正 */}
            <div className={`max-w-[80%] p-3 rounded-xl text-sm shadow-md border ${
              msg.is_admin
                ? 'bg-white text-slate-800 border-slate-200 rounded-tl-none' // 店長：白吹き出し・黒文字
                : 'bg-green-500 text-white border-green-600 rounded-tr-none' // 自分：緑吹き出し・白文字
            }`}>
              {msg.image_url && <img src={msg.image_url} className="rounded mb-2 max-w-full bg-white" />}
              {(!msg.image_url || msg.content !== '画像を送信しました') && <p className="font-medium">{msg.content}</p>}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 入力エリア：白背景・境界線あり */}
      <form onSubmit={sendMessage} className="bg-white p-3 border-t border-slate-300 flex gap-2 items-center pb-8 md:pb-3">
        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-slate-500 bg-slate-100 p-2 rounded-full hover:bg-slate-200 border border-slate-200">📷</button>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

        {/* 入力欄：背景白・文字黒・枠線あり */}
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={uploading ? "画像送信中..." : "メッセージを入力..."}
          disabled={uploading}
          className="flex-1 p-3 bg-white text-slate-900 rounded-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none placeholder-slate-400"
        />

        <button type="submit" disabled={uploading} className="bg-green-600 text-white px-5 py-2 rounded-full font-bold shadow hover:bg-green-500 active:scale-95">送信</button>
      </form>
    </div>
  )
}
