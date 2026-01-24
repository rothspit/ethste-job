import Link from 'next/link'

export default function IdolGakuenTop() {
  return (
    <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* 背景パターン（ドットなど） */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(#db2777 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* ロゴエリア */}
      <div className="text-center mb-10 z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-500 tracking-tighter mb-2 drop-shadow-sm">
          アイドル学園
        </h1>
        <p className="text-xs md:text-sm text-gray-500 tracking-widest font-medium">PRIVATE IDOL GROUP</p>
      </div>

      <div className="z-10 w-full max-w-5xl">
        <h2 className="text-center text-gray-700 font-bold text-lg mb-1">登校する校舎を選んでください</h2>
        <p className="text-center text-gray-400 text-xs mb-8">Select Your Campus</p>

        {/* カードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* 1. 秋葉原校 (Dummy) */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 opacity-80 grayscale hover:grayscale-0 relative">
            <div className="h-32 bg-gray-800 flex items-center justify-center relative">
              <span className="text-white font-bold text-xl tracking-widest">AKIHABARA</span>
            </div>
            <div className="p-6 text-center">
              <h3 className="font-bold text-gray-800 text-lg mb-1">秋葉原校</h3>
              <p className="text-xs text-purple-500 mb-4 font-bold">The Holy Land of Idols</p>
              <div className="space-y-1 text-left text-xs text-gray-500 bg-gray-50 p-3 rounded mb-4">
                <p>究極のアイドル体験</p>
                <p>聖地ならではのクオリティ</p>
              </div>
              <button disabled className="w-full py-3 bg-gray-300 text-white font-bold rounded-full text-sm cursor-not-allowed">
                準備中...
              </button>
            </div>
          </div>

          {/* 2. 船橋校 (Main) */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform md:-translate-y-4 border-4 border-pink-400 relative">
            <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-20">
              本校・在籍数No.1
            </div>
            <div className="h-40 bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center relative overflow-hidden">
               {/* 船橋っぽい背景があればここに画像 */}
               <div className="absolute inset-0 bg-black/20"></div>
               <span className="text-white font-bold text-2xl tracking-widest z-10">FUNABASHI</span>
            </div>
            <div className="p-6 text-center">
              <h3 className="font-bold text-gray-800 text-xl mb-1">船橋校</h3>
              <p className="text-xs text-red-500 mb-4 font-bold">Main Campus</p>
              <div className="space-y-1 text-left text-xs text-gray-600 bg-pink-50 p-3 rounded mb-6 border border-pink-100">
                <p>船橋・西船橋エリア</p>
                <p>最短5分で即到着！</p>
                <p>在籍数No.1</p>
              </div>
              <Link href="/funabashi" className="block w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                登校する（入店）
              </Link>
            </div>
          </div>

          {/* 3. 幕張校 (Dummy) */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 opacity-80 grayscale hover:grayscale-0 relative">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg z-20">
              NEW OPEN
            </div>
            <div className="h-32 bg-blue-900 flex items-center justify-center relative">
              <span className="text-white font-bold text-xl tracking-widest">MAKUHARI</span>
            </div>
            <div className="p-6 text-center">
              <h3 className="font-bold text-gray-800 text-lg mb-1">幕張校</h3>
              <p className="text-xs text-blue-500 mb-4 font-bold">Resort & Event Area</p>
              <div className="space-y-1 text-left text-xs text-gray-500 bg-gray-50 p-3 rounded mb-4">
                <p>幕張メッセ・ホテル対応</p>
                <p>ワンランク上の接客</p>
              </div>
              <button disabled className="w-full py-3 bg-gray-300 text-white font-bold rounded-full text-sm cursor-not-allowed">
                準備中...
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 下部バナー */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 text-center shadow-lg z-50">
        <p className="font-bold text-sm md:text-base flex items-center justify-center gap-2">
          <span>全校舎で即ドル割 -¥3,000 実施中！</span>
        </p>
        <p className="text-[10px] opacity-90">今すぐ行ける子を選ぶとおトク！</p>
      </div>
    </main>
  )
}
