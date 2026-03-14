'use client'
import Image from 'next/image'

export default function RankingSection() {
  const girls = [
    {
      id: 1,
      name: 'いちごさん',
      ranking_order: 1,
      image1_url: '/ichigo-dummy.jpg', // Replace with real URL if available, or keep dummy
      age: 21,
    },
    {
      id: 2,
      name: 'らんさん',
      ranking_order: 2,
      image1_url: '/ran-dummy.jpg',
      age: 22,
    },
    {
      id: 3,
      name: 'れいらさん',
      ranking_order: 3,
      image1_url: '/reira-dummy.jpg',
      age: 20,
    }
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-xl font-black text-center mb-6 text-pink-600 flex items-center justify-center gap-2">
        <span className="text-pink-400 text-2xl">👑</span> 先月の人気ランキング
      </h2>

      <div className="grid grid-cols-3 gap-3">
        {girls.map((girl: any) => (
          <div key={girl.id} className="relative group">
            {/* 順位バッジ */}
            <div className={`absolute -top-3 -left-2 z-10 w-8 h-8 flex items-center justify-center rounded-full font-black text-white shadow-sm border-2 border-white ${
              girl.ranking_order === 1 ? 'bg-gradient-to-br from-pink-400 to-rose-400 text-lg shadow-pink-200' :
              girl.ranking_order === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 shadow-slate-200' :
              'bg-gradient-to-br from-amber-600 to-amber-500 shadow-amber-200'
            }`}>
              {girl.ranking_order}
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-pink-100 hover:shadow-md transition-shadow">
              <div className="aspect-[4/5] bg-pink-50 relative">
                {girl.idol_image_path || girl.image1_url ? (
                  <Image 
                    src={girl.idol_image_path || girl.image1_url} 
                    alt={girl.name} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-pink-300 font-bold">No Photo</div>
                )}
              </div>
              <div className="p-2 text-center bg-white relative z-10">
                <p className="font-rounded font-black text-sm text-pink-600 drop-shadow-sm">{girl.name}</p>
                <p className="font-rounded text-[10px] font-bold text-pink-400 mt-0.5">{girl.age ? `${girl.age}歳` : ''}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
