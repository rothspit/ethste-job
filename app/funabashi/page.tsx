import Link from 'next/link'
import Image from 'next/image'
import PriceListIdol from '@/components/PriceListIdol'
import RankingSection from '@/components/RankingSection'
import ScheduleSection from '@/components/ScheduleSection'

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
            <Link href="/recruit" className="bg-yellow-500 text-slate-900 text-[10px] font-black px-2 py-2 rounded shadow hover:bg-yellow-400">
              求人
            </Link>
            <Link href="/chat" className="bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow hover:bg-green-400">
              💬 チャット
            </Link>
            <Link href="/login" className="bg-pink-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow hover:bg-pink-500">
              🔑 ログイン
            </Link>
          </div>
        </div>
      </div>

      {/* 2. メインビジュアル */}
      <div className="relative w-full max-w-2xl mx-auto">
        <Image
          src="/idol_top.jpg"
          alt="アイドル学園船橋"
          width={800} height={600}
          className="w-full h-auto shadow-md"
          priority
        />
        <div className="p-4 space-y-3 -mt-2 relative z-10">
          <Link href="/funabashi/girls" className="block w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center font-bold py-4 rounded-xl shadow-lg text-lg animate-pulse">
            今すぐ指名して遊ぶ 💕
          </Link>
        </div>
      </div>

      {/* 3. 各種セクション */}
      <RankingSection />

      <div className="mx-4 my-2 bg-yellow-400 p-3 rounded-lg text-center shadow transform -rotate-1 border-2 border-slate-900">
        <p className="text-slate-900 font-black text-lg">初回限定 3,000円OFF！</p>
      </div>

      {/* 出勤スケジュール */}
      <ScheduleSection />

      <PriceListIdol />

      {/* フッター求人バナー */}
      <div className="mt-12 bg-slate-800 text-white text-center py-8 px-4">
        <h3 className="font-bold mb-2">キャスト・スタッフ募集中</h3>
        <p className="text-xs text-slate-400 mb-4">アイドル学園で一緒に働きませんか？</p>
        <Link href="/recruit" className="inline-block border border-white px-6 py-2 rounded-full hover:bg-white hover:text-slate-800 transition-colors">
          採用情報を見る
        </Link>
      </div>
    </main>
  )
}
