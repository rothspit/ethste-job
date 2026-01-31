import Link from 'next/link'
import Image from 'next/image'
import PriceListIdol from '@/components/PriceListIdol'
import RankingSection from '@/components/RankingSection'

export default function FunabashiPage() {
  return (
    <main className="bg-slate-50 min-h-screen pb-20">

      {/* 1. ヘッダー */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur text-white shadow-lg border-b border-slate-700">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="font-black text-xl italic tracking-tighter">
            IDOL <span className="text-pink-500">GAKUEN</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/chat" className="bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow hover:bg-green-400 flex items-center gap-1 transition-transform active:scale-95">
              💬 チャット
            </Link>
            <Link href="/login" className="bg-pink-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow hover:bg-pink-500 flex items-center gap-1 transition-transform active:scale-95">
              🔑 ログイン
            </Link>
          </div>
        </div>
      </div>

      {/* 2. メインビジュアル（ここを追加！） */}
      <div className="relative w-full max-w-2xl mx-auto">
        <Image
          src="/idol_top.jpg"
          alt="アイドル学園船橋"
          width={800}
          height={600}
          className="w-full h-auto shadow-md"
          priority
        />
        {/* 画像の下にすぐボタン配置 */}
        <div className="p-4 space-y-3 -mt-2 relative z-10">
          <Link href="/funabashi/girls" className="block w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center font-bold py-4 rounded-xl shadow-lg text-lg animate-pulse">
            今すぐ指名して遊ぶ 💕
          </Link>
        </div>
      </div>

      {/* 3. コンテンツ */}
      <RankingSection />

      {/* 割引バナー風エリア */}
      <div className="mx-4 my-6 bg-yellow-400 p-4 rounded-lg text-center shadow-md transform -rotate-1">
        <p className="text-slate-900 font-black text-xl">初回限定 3,000円OFF！</p>
        <p className="text-xs font-bold text-slate-800">「サイトを見た」とお伝えください</p>
      </div>

      <PriceListIdol />

    </main>
  )
}
