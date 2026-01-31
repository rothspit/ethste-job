import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* 1. ロゴ＆ボタンエリア */}
      <div className="py-12 text-center bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-2">
          IDOL <span className="text-pink-500">GAKUEN</span>
        </h1>
        <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">
          Group Official Portal
        </p>

        <div className="mt-8 flex justify-center gap-4 px-4">
          <Link href="/login" className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-pink-900/50 flex items-center gap-2 transition-transform active:scale-95">
             共通 会員ログイン
          </Link>
          <Link href="/chat" className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-green-900/50 flex items-center gap-2 transition-transform active:scale-95">
             総合 受付チャット
          </Link>
        </div>
      </div>

      {/* 2. 店舗選択エリア */}
      <div className="max-w-5xl mx-auto p-4 md:p-8 grid md:grid-cols-2 gap-8 -mt-6">
        {/* 🎀 アイドル学園 */}
        <Link href="/funabashi" className="group relative overflow-hidden rounded-2xl border-4 border-pink-500 bg-white transform hover:-translate-y-1 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-white opacity-90"></div>
          <div className="relative p-8 h-full flex flex-col items-center text-center">
            <div className="bg-pink-100 text-pink-600 text-xs font-black px-3 py-1 rounded-full mb-4 border border-pink-200">船橋エリア No.1</div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">
              <span className="text-pink-500">🎀</span> アイドル学園
            </h2>
            <div className="mt-auto bg-pink-500 text-white py-2 px-4 rounded-lg font-bold shadow-md w-full group-hover:bg-pink-400">
              船橋本店 ➡
            </div>
          </div>
        </Link>

        {/* 💋 人妻の蜜 */}
        <Link href="/mitsu" className="group relative overflow-hidden rounded-2xl border-4 border-purple-600 bg-white transform hover:-translate-y-1 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white opacity-90"></div>
          <div className="relative p-8 h-full flex flex-col items-center text-center">
            <div className="bg-purple-100 text-purple-600 text-xs font-black px-3 py-1 rounded-full mb-4 border border-purple-200">大人の極上癒やし</div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">
              <span className="text-purple-600">💋</span> 人妻の蜜
            </h2>
            <div className="mt-auto bg-purple-600 text-white py-2 px-4 rounded-lg font-bold shadow-md w-full group-hover:bg-purple-500">
              西船橋・葛西・錦糸町 ➡
            </div>
          </div>
        </Link>
      </div>

      {/* 3. 準備中エリア */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center backdrop-blur relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-500 text-slate-900 text-[10px] font-black px-6 py-1 transform rotate-45 translate-x-4 translate-y-2 shadow-lg">COMING SOON</div>
          <h3 className="text-xl font-bold text-white mb-4">🚧 新店舗オープン準備中</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-purple-500/30 flex items-center justify-between">
              <div className="text-left"><span className="text-xs text-purple-400 font-bold block">人妻の蜜</span><span className="text-lg font-black text-white">錦糸町店</span></div>
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">準備中...</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center justify-between opacity-60">
              <div className="text-left"><span className="text-xs text-slate-500 font-bold block">エリア拡大中</span><span className="text-lg font-black text-slate-400">秋葉原・幕張</span></div>
              <span className="text-xs text-slate-600">計画中</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
