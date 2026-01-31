import Link from 'next/link'
import PriceListIdol from '@/components/PriceListIdol'
import RankingSection from '@/components/RankingSection'

export default function FunabashiPage() {
  return (
    <main className="bg-slate-50 min-h-screen pb-20">
      {/* 🟢 ヘッダー（ここが重要！） */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur text-white shadow-lg border-b border-slate-700">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-black text-xl italic tracking-tighter">IDOL <span className="text-pink-500">GAKUEN</span></h1>
          <div className="flex items-center gap-2">
            <Link href="/chat" className="bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow hover:bg-green-400 flex items-center gap-1">💬 チャット</Link>
            <Link href="/login" className="bg-pink-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow hover:bg-pink-500 flex items-center gap-1">🔑 ログイン</Link>
          </div>
        </div>
      </div>

      {/* 以下コンテンツ */}
      <RankingSection />
      <PriceListIdol />
    </main>
  )
}
