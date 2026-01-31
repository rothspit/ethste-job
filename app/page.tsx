import Link from 'next/link'
import Image from 'next/image'
import { Rampart_One, Zen_Old_Mincho } from 'next/font/google'

// 立体的でロゴっぽいフォント（元気・可愛い）
const logoFont = Rampart_One({
  weight: '400',
  subsets: ['latin'],
  preload: false,
})

// 大人っぽいフォント（人妻用）
const adultFont = Zen_Old_Mincho({
  weight: '900',
  subsets: ['latin'],
  preload: false,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* 1. ロゴ＆ボタンエリア */}
      <div className="py-12 text-center bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image src="/main_idol.jpg" alt="background" fill className="object-cover blur-sm" />
        </div>

        <div className="relative z-10">
          {/* 🎀 ロゴ：立体フォント＋文字間隔を広げる */}
          <h1 className={`${logoFont.className} text-5xl md:text-7xl mb-2 text-white drop-shadow-lg tracking-widest leading-relaxed`}>
            アイドル<span className="text-pink-500">学園</span>
          </h1>
          <p className="text-slate-300 text-xs font-bold tracking-[0.3em] uppercase text-shadow">
            GROUP OFFICIAL PORTAL
          </p>

          <div className="mt-8 flex justify-center gap-4 px-4">
            <Link href="/login" className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-pink-900/50 flex items-center gap-2 transition-transform active:scale-95">
               🔑 共通ログイン
            </Link>
            <Link href="/chat" className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-green-900/50 flex items-center gap-2 transition-transform active:scale-95">
               💬 総合受付
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 店舗選択エリア */}
      <div className="max-w-5xl mx-auto p-4 md:p-8 grid md:grid-cols-2 gap-8 -mt-6 relative z-20">

        {/* 🎀 アイドル学園 */}
        <Link href="/funabashi" className="group relative overflow-hidden rounded-2xl border-4 border-pink-500 transform hover:-translate-y-2 transition-all duration-300 shadow-2xl shadow-pink-500/30">
          <Image src="/main_idol.jpg" alt="アイドル学園" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-900/90 via-pink-500/50 to-transparent mix-blend-multiply"></div>

          <div className="relative p-8 h-80 flex flex-col items-center text-center justify-end">
            <div className="bg-pink-500 text-white text-xs font-black px-4 py-1 rounded-full mb-3 shadow-md">船橋エリア No.1</div>

            <h2 className={`${logoFont.className} text-4xl md:text-6xl text-white mb-2 drop-shadow-md tracking-wider`}>
              アイドル<span className="text-pink-200">学園</span>
            </h2>
            <p className="text-pink-100 font-bold mb-4 text-sm drop-shadow">究極の「かわいい」をお届け</p>
            <div className="bg-white/90 text-pink-600 py-3 px-8 rounded-full font-black shadow-lg group-hover:bg-white transition-colors">
              船橋本店に入店 ➡
            </div>
          </div>
        </Link>

        {/* 💋 人妻の蜜 */}
        <Link href="/mitsu" className="group relative overflow-hidden rounded-2xl border-4 border-purple-600 transform hover:-translate-y-2 transition-all duration-300 shadow-2xl shadow-purple-500/30">
          <Image src="/main_mitsu.jpg" alt="人妻の蜜" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-500/50 to-transparent mix-blend-multiply"></div>

          <div className="relative p-8 h-80 flex flex-col items-center text-center justify-end">
            <div className="bg-purple-600 text-white text-xs font-black px-4 py-1 rounded-full mb-3 shadow-md">大人の極上癒やし</div>

            <h2 className={`${adultFont.className} text-4xl md:text-5xl text-white mb-2 drop-shadow-md leading-tight`}>
              人妻の<span className="text-purple-300">蜜</span>
            </h2>
            <p className="text-purple-200 font-bold mb-4 text-sm drop-shadow">西船橋・葛西・錦糸町</p>
            <div className="bg-white/90 text-purple-600 py-3 px-8 rounded-full font-black shadow-lg group-hover:bg-white transition-colors">
              店舗を選択する ➡
            </div>
          </div>
        </Link>
      </div>

      {/* 3. 準備中エリア */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-8 text-center backdrop-blur relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 bg-yellow-500 text-slate-900 text-[10px] font-black px-8 py-1 transform rotate-45 translate-x-6 translate-y-3 shadow-lg">COMING SOON</div>
          <h3 className="text-2xl font-bold text-white mb-6">🚧 新店舗オープン準備中</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-purple-500/50 flex items-center justify-between shadow-inner">
              <div className="text-left"><span className="text-sm text-purple-400 font-bold block mb-1">人妻の蜜</span><span className="text-xl font-black text-white">錦糸町店</span></div>
              <span className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full animate-pulse">準備中...</span>
            </div>
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-700 flex items-center justify-between opacity-70">
              <div className="text-left"><span className="text-sm text-slate-500 font-bold block mb-1">エリア拡大予定</span><span className="text-xl font-black text-slate-400">秋葉原・幕張</span></div>
              <span className="text-xs text-slate-600 border border-slate-600 px-3 py-1 rounded-full">計画中</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
