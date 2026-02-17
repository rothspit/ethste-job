'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [inputText, setInputText] = useState('')
  const [sessionId, setSessionId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let storedId = localStorage.getItem('chat_session_id')
    if (!storedId) {
      storedId = Math.random().toString(36).substring(2) + Date.now().toString(36)
      localStorage.setItem('chat_session_id', storedId)
    }
    setSessionId(storedId)

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', storedId)
        .order('created_at', { ascending: true })

      if (data) setMessages(data)
    }

    fetchMessages()
    const timer = setInterval(fetchMessages, 3000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newMessage = {
      session_id: sessionId,
      content: inputText,
      sender: 'user',
    }

    setMessages([...messages, { ...newMessage, created_at: new Date().toISOString() }])

    const messageToSend = inputText
    setInputText('')

    await supabase.from('messages').insert([newMessage])

    // 通知APIへ送信
    try {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend, sessionId: sessionId }),
      })
    } catch (err) {
      console.error('通知エラー', err)
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-100">

      {/* ヘッダー */}
      <div className="bg-slate-900 text-white p-3 flex justify-between items-center shadow-md z-10">
        <div className="font-bold flex items-center gap-2">
          <Link href="/funabashi" className="text-xl">⬅</Link>
          <span className="text-sm md:text-base">チャット受付</span>
        </div>

        <a href="tel:05017459665" className="bg-pink-600 text-xs px-4 py-2 rounded-full font-bold animate-pulse shadow-lg hover:bg-pink-500">
          📞 電話する
        </a>
      </div>

      {/* 注意書き */}
      <div className="bg-yellow-50 p-2 text-[10px] text-center text-slate-600 border-b border-yellow-100">
        ※匿名で利用できます。お気軽にご質問ください。<br/>
      </div>

      {/* チャットエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        <div className="flex justify-start">
          <div className="bg-white text-slate-800 p-3 rounded-2xl rounded-tl-none shadow max-w-[85%] text-sm">
            いらっしゃいませ！😊<br/>
            こちらは匿名チャットです。<br/>
            「今から入れますか？」など、お気軽にお問い合わせください！
          </div>
        </div>

        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl shadow max-w-[85%] text-sm whitespace-pre-wrap leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-green-500 text-white rounded-tr-none'
                : 'bg-white text-slate-800 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <form onSubmit={handleSend} className="bg-slate-200 p-3 border-t border-slate-300 flex gap-2 fixed bottom-0 w-full pb-safe">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-full px-4 py-3 shadow-inner focus:outline-none focus:border-green-500 text-base font-bold"
        />
        <button type="submit" className="bg-green-600 text-white font-bold px-5 py-2 rounded-full shadow-lg hover:bg-green-500 active:scale-95 transition-transform disabled:opacity-50">
          送信
        </button>
      </form>
    </div>
  )
}
