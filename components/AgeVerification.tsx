'use client'

import { useState, useEffect } from 'react'

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export default function AgeVerification() {
  const [visible, setVisible] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (getCookie('age_verified') !== 'true') {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const handleAccept = () => {
    setCookie('age_verified', 'true', 30)
    setFadeOut(true)
    setTimeout(() => setVisible(false), 400)
  }

  const handleReject = () => {
    window.location.href = 'about:blank'
  }

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center transition-opacity duration-400 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      {/* 背景 */}
      <div className="absolute inset-0 bg-black/70" />

      {/* カード */}
      <div className="relative w-[90%] max-w-sm rounded-2xl overflow-hidden shadow-2xl">
        {/* ヘッダー */}
        <div
          className="px-6 pt-8 pb-4 text-center"
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
          }}
        >
          <div className="text-2xl font-bold tracking-wider mb-1 text-white" style={{ fontFamily: "'Rounded Mplus 1c', sans-serif" }}>
            アイドル学園
          </div>
          <div className="text-xs text-white/70">
            IDOL GAKUEN
          </div>
        </div>

        {/* 本文 */}
        <div className="px-6 py-6 text-center bg-white">
          <p className="text-sm mb-1 font-bold text-gray-800">
            年齢確認
          </p>
          <p className="text-xs mb-6 text-gray-500 leading-relaxed">
            当サイトは18歳未満の方の閲覧を禁止しております。<br />
            あなたは18歳以上ですか？
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleAccept}
              className="w-full py-3 rounded-full text-sm font-bold tracking-wider text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                boxShadow: '0 4px 16px #ec489944',
              }}
            >
              18歳以上です ― ENTER
            </button>
            <button
              onClick={handleReject}
              className="w-full py-3 rounded-full text-sm text-gray-400 border border-gray-200 transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
            >
              18歳未満です ― EXIT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
