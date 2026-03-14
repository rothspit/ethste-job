import Link from 'next/link'
import Image from 'next/image'
import { Noto_Sans_JP } from 'next/font/google'

const baseFont = Noto_Sans_JP({
  weight: ['700', '900'],
  subsets: ['latin'],
  preload: false,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-pink-50 text-slate-800">
      {/* 1. ロゴエリア */}
      <div className="py-12 text-center bg-gradient-to-b from-white to-pink-50 border-b border-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image src="/main_idol.jpg" alt="background" fill className="object-cover blur-sm" />
        </div>

        <div className="relative z-10">
          <h1 className={`${baseFont.className} text-5xl md:text-7xl mb-2 text-pink-600 font-black tracking-wider drop-shadow-sm`}>
            アイドル<span className="text-pink-400">学園</span>
          </h1>
          <p className={`${baseFont.className} text-pink-300 text-xs font-bold tracking-[0.3em] uppercase`}>
            GROUP OFFICIAL PORTAL
          </p>
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

            <h2 className={`${baseFont.className} text-4xl md:text-5xl text-white mb-2 font-black drop-shadow-md tracking-wide`}>
              アイドル<span className="text-pink-200">学園</span>
            </h2>
            <p className="text-pink-100 font-bold mb-4 text-sm drop-shadow">究極の「かわいい」をお届け</p>
            <div className="bg-white/90 text-pink-600 py-3 px-8 rounded-full font-black shadow-lg group-hover:bg-white transition-colors">
              船橋店に入店 ➡
            </div>
          </div>
        </Link>

        {/* 💋 人妻の蜜（外部リンク） */}
        <a href="https://h-mitsu.com" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-2xl border-4 border-purple-600 transform hover:-translate-y-2 transition-all duration-300 shadow-2xl shadow-purple-500/30 bg-gradient-to-t from-purple-900 via-purple-800 to-purple-700">
          <div className="relative p-8 h-80 flex flex-col items-center text-center justify-end">
            <div className="bg-purple-600 text-white text-xs font-black px-4 py-1 rounded-full mb-3 shadow-md">大人の極上癒やし</div>

            <h2 className={`${baseFont.className} text-4xl md:text-5xl text-white mb-2 font-black drop-shadow-md tracking-wide`}>
              人妻の<span className="text-purple-300">蜜</span>
            </h2>
            <p className="text-purple-200 font-bold mb-4 text-sm drop-shadow">西船橋・葛西・錦糸町</p>
            <div className="bg-white/90 text-purple-600 py-3 px-8 rounded-full font-black shadow-lg group-hover:bg-white transition-colors">
              公式サイトへ ➡
            </div>
          </div>
        </a>
      </div>

      {/* 3. 準備中エリア */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white border border-pink-200 rounded-3xl p-8 text-center backdrop-blur relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 bg-yellow-400 text-slate-900 text-[10px] font-black px-8 py-1 transform rotate-45 translate-x-6 translate-y-3 shadow-sm">COMING SOON</div>
          <h3 className="text-2xl font-bold text-pink-600 mb-6">🚧 新店舗オープン準備中</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-pink-50 p-5 rounded-2xl border border-purple-200 flex items-center justify-between shadow-sm">
              <div className="text-left"><span className="text-sm text-purple-500 font-bold block mb-1">人妻の蜜</span><span className="text-xl font-black text-slate-800">錦糸町店</span></div>
              <span className="text-xs bg-purple-500 text-white px-3 py-1 rounded-full animate-pulse">準備中...</span>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-center justify-between opacity-70">
              <div className="text-left"><span className="text-sm text-slate-500 font-bold block mb-1">エリア拡大予定</span><span className="text-xl font-black text-slate-700">秋葉原・幕張</span></div>
              <span className="text-xs text-slate-600 border border-slate-300 px-3 py-1 rounded-full bg-white">計画中</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
