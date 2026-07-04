'use client'

import Link from 'next/link'

const CRM_URL = 'https://crm.st-online.jp'

export function AdminCrmRedirect() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-pink-800 bg-slate-900 p-8 text-center space-y-4">
        <p className="text-3xl">🎀</p>
        <h1 className="text-xl font-bold">アイドル学園 予約管理</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          予約は CRM に統合されました。確定・キャンセルは CRM ダッシュボードで行ってください。
        </p>
        <a
          href={CRM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full py-3 rounded-xl font-bold bg-pink-600 hover:bg-pink-500 transition"
        >
          CRM ダッシュボードを開く
        </a>
        <Link href="/" className="inline-block text-xs text-slate-500 hover:text-slate-300">
          サイトトップへ
        </Link>
      </div>
    </main>
  )
}
