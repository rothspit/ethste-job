import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { Noto_Sans_JP } from 'next/font/google'

const baseFont = Noto_Sans_JP({ weight: ['700'], subsets: ['latin'], preload: false })

async function getGirls() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_CRM_API_URL}/idol/casts?store_id=2`, {
    cache: 'no-store' // キャッシュを無効化（常に最新を取得）
  })
  
  if (!res.ok) {
    console.error('Failed to fetch girls from CRM')
    return []
  }

  const json = await res.json()
  return json.casts || []
}

export default async function GirlsListPage() {
  const girls = await getGirls()

  // CRM APIからのデータ構造に合わせて調整
  const getImageUrl = (girl: any) => girl.idol_image_path || girl.image || null
  const getStatusText = (girl: any) => girl.status === '接客中' ? '💕 接客中' : girl.status === '待機中' || girl.status === '即案内可能' || !!girl.is_attending ? '✨ 即ご案内可能' : '💤 お休み中'
  const isAttending = (girl: any) => girl.status !== 'お休み中' && girl.status !== '退店'

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ヘッダー */}
      <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur text-white shadow-lg p-4 flex items-center justify-between">
        <Link href="/funabashi" className="font-bold text-lg">⬅ トップへ戻る</Link>
        <h1 className="font-bold">在籍キャスト一覧</h1>
      </div>

      <div className="max-w-2xl mx-auto px-2 py-4">
        <p className="text-center text-xs text-slate-500 mb-4">
          気になる子がいたら、お気軽にお問い合わせください💕
        </p>

        {/* グリッド表示（全員） */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {girls.map((girl: any) => {
            const imageUrl = getImageUrl(girl)
            return (
              <Link
                href={`/girls/${girl.id}`}
                key={girl.id}
                className="relative aspect-[3/4] bg-slate-200 cursor-pointer overflow-hidden group block"
              >
                {imageUrl ? (
                  imageUrl.includes('placehold.co') || imageUrl.endsWith('.svg') ? (
                    <img src={imageUrl} alt={girl.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <Image 
                      src={imageUrl} 
                      alt={girl.name}
                      fill
                      quality={95}
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Img</div>
                )}

                {/* 出勤中の子だけバッジをつける */}
                {isAttending(girl) && (
                  <div className="absolute top-0 left-0">
                     <span className="bg-[#ff0066] text-white text-[10px] font-bold px-2 py-1 shadow-md inline-block animate-pulse">本日出勤</span>
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 text-white opacity-90 group-hover:opacity-100 transition-opacity">
                  <p className="font-bold text-base drop-shadow-md truncate">{girl.name} <span className="text-xs opacity-90 drop-shadow">({girl.age})</span></p>
                  <p className="text-[10px] text-pink-200 font-medium drop-shadow-md mt-0.5 truncate">{getStatusText(girl)}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
