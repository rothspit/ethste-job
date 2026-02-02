'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'

// Swiperのスタイル読み込み
import 'swiper/css'
import 'swiper/css/pagination'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function GirlDetailPage() {
  const params = useParams()
  const [girl, setGirl] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGirl = async () => {
      if (!params.id) return
      const { data } = await supabase
        .from('girls')
        .select('*')
        .eq('id', params.id)
        .single()

      setGirl(data)
      setLoading(false)
    }
    fetchGirl()
  }, [params.id])

  if (loading) return <div className="min-h-screen bg-slate-50 pt-20 text-center">読み込み中...</div>
  if (!girl) return <div className="min-h-screen bg-slate-50 pt-20 text-center">データが見つかりません🙇‍♂️</div>

  // 画像配列を作成（images配列 または image1_url〜image5_url に対応）
  const getImages = () => {
    if (girl.images && girl.images.length > 0) {
      return girl.images
    }
    // 個別フィールドから配列を作成
    const imgs = []
    if (girl.image1_url) imgs.push(girl.image1_url)
    if (girl.image2_url) imgs.push(girl.image2_url)
    if (girl.image3_url) imgs.push(girl.image3_url)
    if (girl.image4_url) imgs.push(girl.image4_url)
    if (girl.image5_url) imgs.push(girl.image5_url)
    return imgs
  }
  const images = getImages()

  return (
    <main className="bg-slate-50 min-h-screen pb-24">

      {/* 1. ヘッダー（戻るボタン） */}
      <div className="fixed top-0 z-50 w-full bg-gradient-to-b from-black/60 to-transparent p-4">
        <Link href="/funabashi" className="inline-flex items-center justify-center bg-black/50 text-white rounded-full w-10 h-10 backdrop-blur text-lg">
          ←
        </Link>
      </div>

      {/* 2. 写真スライドショー */}
      <div className="bg-black">
        {images.length > 0 ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={images.length > 1}
            className="w-full max-w-md mx-auto"
          >
            {images.map((img: string, idx: number) => (
              <SwiperSlide key={idx} className="!flex !justify-center !items-center">
                <img src={img} alt={`${girl.name}の写真${idx + 1}`} className="max-w-full max-h-[80vh] object-contain mx-auto" />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-400 text-lg">
            No Image
          </div>
        )}
      </div>

      {/* 3. プロフィール情報 */}
      <div className="max-w-2xl mx-auto -mt-6 relative z-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6">

          {/* 名前 */}
          <div className="text-center mb-6 border-b border-slate-100 pb-4">
            <h1 className="text-3xl font-black text-slate-800 mb-1">{girl.name}</h1>
            <p className="text-pink-500 font-bold text-sm">
              {girl.age}歳
            </p>
            {girl.schedule_comment && (
              <div className="mt-3 bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full inline-block font-bold border border-green-200">
                🟢 {girl.schedule_comment}
              </div>
            )}
          </div>

          {/* スリーサイズ（他ページと同じ表記） */}
          <div className="text-center mb-6">
            <p className="text-pink-500 font-bold text-lg">
              T{girl.height || '??'} B{girl.bust || '??'}({girl.cup || '?'}) W{girl.waist || '??'} H{girl.hip || '??'}
            </p>
          </div>

          {/* スリーサイズカード */}
          <div className="grid grid-cols-4 gap-2 text-center mb-8">
            <div className="bg-pink-50 rounded-lg p-3">
              <div className="text-[10px] text-slate-500 font-bold">身長</div>
              <div className="font-black text-slate-800 text-xl">{girl.height || '??'}</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-3">
              <div className="text-[10px] text-slate-500 font-bold">バスト</div>
              <div className="font-black text-pink-500 text-xl">{girl.bust || '??'}<span className="text-xs text-slate-500">({girl.cup || '?'})</span></div>
            </div>
            <div className="bg-pink-50 rounded-lg p-3">
              <div className="text-[10px] text-slate-500 font-bold">ウエスト</div>
              <div className="font-black text-slate-800 text-xl">{girl.waist || '??'}</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-3">
              <div className="text-[10px] text-slate-500 font-bold">ヒップ</div>
              <div className="font-black text-slate-800 text-xl">{girl.hip || '??'}</div>
            </div>
          </div>

          {/* 店長コメント */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 relative mb-6">
            <div className="absolute -top-3 left-4 bg-slate-800 text-white text-[10px] font-bold px-3 py-1 rounded">
              STAFF COMMENT
            </div>
            <p className="text-sm text-slate-700 leading-relaxed pt-2">
              {girl.description || girl.message || 'まだ紹介文が登録されていません。お問い合わせください！'}
            </p>
          </div>

        </div>
      </div>

      {/* 4. 予約ボタン（画面下固定） */}
      <div className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-3 shadow-lg z-50">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Link href="/chat" className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg text-center shadow active:scale-95 transition-transform flex items-center justify-center gap-2">
            <span>💬 LINE予約</span>
          </Link>
          <a href="tel:000-0000-0000" className="flex-1 bg-pink-600 text-white font-bold py-3 rounded-lg text-center shadow active:scale-95 transition-transform flex items-center justify-center gap-2">
             <span>📞 電話予約</span>
          </a>
        </div>
      </div>

    </main>
  )
}
