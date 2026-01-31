import Link from 'next/link'

export default function RankingSection() {
  // 表示確認用のダミーデータ（後でデータベースと繋ぎます）
  const girls = [
    { id: 1, name: 'モモ', age: 20, t: 158, b: 88, w: 58, h: 86, point: '新人' },
    { id: 2, name: 'アイ', age: 22, t: 162, b: 85, w: 60, h: 88, point: 'No.1' },
    { id: 3, name: 'リナ', age: 19, t: 155, b: 90, w: 59, h: 89, point: '人気' },
  ]

  return (
    <section className="py-10 px-4">
      <h3 className="text-2xl font-black text-center text-slate-800 mb-6">
        <span className="text-yellow-500">👑</span> 本日のランキング
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {girls.map((girl, index) => (
          <div key={girl.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow relative">
            {/* 順位バッジ */}
            <div className={`absolute top-0 left-0 text-white text-xs font-black px-3 py-1 rounded-br-lg z-10 ${
              index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-400' : 'bg-orange-400'
            }`}>
              {index + 1}位
            </div>

            {/* 画像エリア（グレー） */}
            <div className="aspect-[3/4] bg-slate-200 flex items-center justify-center text-slate-400 font-bold">
              No Image
            </div>

            <div className="p-3">
              <div className="flex justify-between items-end mb-1">
                <h4 className="font-bold text-lg text-slate-800">{girl.name}</h4>
                <span className="text-sm text-pink-500 font-bold">{girl.age}歳</span>
              </div>
              <p className="text-xs text-slate-500">T{girl.t} B{girl.b} W{girl.w} H{girl.h}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
