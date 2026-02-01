'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'

// Swiperのスタイル読み込み
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

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

  return (
    <main className="bg-slate-50 min-h-screen pb-24">

      {/* 1. ヘッダー（戻るボタンのみシンプルに） */}
      <div className="fixed top-0 z-50 w-full bg-gradient-to-b from-black/50 to-transparent p-4">
        <Link href="/funabashi" className="inline-flex items-center justify-center bg-black/40 text-white rounded-full w-10 h-10 backdrop-blur">
          ⬅
        </Link>
      </div>

      {/* 2. 写真スライドショー */}
      <div className="bg-slate-200">
        {girl.images && girl.images.length > 0 ? (
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="w-full h-[500px] md:h-[600px]"
          >
            {girl.images.map((img: string, idx: number) => (
              <SwiperSlide key={idx}>
                <img src={img} alt={`${girl.name}の写真${idx + 1}`} className="w-full h-full object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-slate-400">No Image</div>
        )}
      </div>

      {/* 3. プロフィール情報 */}
      <div className="max-w-2xl mx-auto -mt-6 relative z-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6">

          {/* 名前とキャッチコピー */}
          <div className="text-center mb-6 border-b border-slate-100 pb-4">
            <h1 className="text-3xl font-black text-slate-800 mb-2">{girl.name}</h1>
            <p className="text-pink-500 font-bold text-sm">
              {girl.age}歳 ({girl.birth_month || '??'}月{girl.birth_day || '??'}日生まれ)
            </p>
            {girl.schedule_comment && (
              <div className="mt-3 bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full inline-block font-bold border border-green-200">
                🟢 {girl.schedule_comment}
              </div>
            )}
          </div>

          {/* スリーサイズ・身体情報 */}
          <div className="grid grid-cols-4 gap-2 text-center mb-8">
            <div className="bg-pink-50 rounded-lg p-2">
              <div className="text-[10px] text-slate-500 font-bold">身長</div>
              <div className="font-black text-slate-800 text-lg">T{girl.height}</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-2">
              <div className="text-[10px] text-slate-500 font-bold">バスト</div>
              <div className="font-black text-pink-500 text-lg">B{girl.bust}<span className="text-xs text-slate-500 font-normal">({girl.cup || '?'})</span></div>
            </div>
            <div className="bg-pink-50 rounded-lg p-2">
              <div className="text-[10px] text-slate-500 font-bold">ウエスト</div>
              <div className="font-black text-slate-800 text-lg">W{girl.waist}</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-2">
              <div className="text-[10px] text-slate-500 font-bold">ヒップ</div>
              <div className="font-black text-slate-800 text-lg">H{girl.hip}</div>
            </div>
          </div>

          {/* 店長コメント（セールスポイント） */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 relative mb-8">
            <div className="absolute -top-3 left-4 bg-slate-800 text-white text-[10px] font-bold px-3 py-1 rounded">
              STAFF COMMENT
            </div>
            <p className="text-sm text-slate-700 leading-relaxed pt-2">
              {/* データがなければデフォルト文を表示 */}
              {girl.description || 'まだ紹介文が登録されていません。詳細はお問い合わせください！清楚で可愛らしい雰囲気の女の子です。'}
            </p>
          </div>

          {/* 基本データ表 */}
          <h3 className="font-bold text-slate-800 mb-3 text-lg">💎 基本プロフィール</h3>
          <table className="w-full text-sm text-left border-collapse">
            <tbody className="divide-y divide-slate-100">
              <tr>
                <th className="py-3 text-slate-500 font-normal w-1/3">血液型</th>
                <td className="py-3 font-bold text-slate-800">{girl.blood_type || '非公開'}型</td>
              </tr>
              <tr>
                <th className="py-3 text-slate-500 font-normal">職業</th>
                <td className="py-3 font-bold text-slate-800">{girl.job || '秘密'}</td>
              </tr>
              <tr>
                <th className="py-3 text-slate-500 font-normal">性格</th>
                <td className="py-3 font-bold text-slate-800">{girl.personality || '優しくて癒やし系'}</td>
              </tr>
              <tr>
                <th className="py-3 text-slate-500 font-normal">趣味</th>
                <td className="py-3 font-bold text-slate-800">{girl.hobby || 'カフェ巡り、映画'}</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>

      {/* 4. 予約ボタン（画面下固定） */}
      <div className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-3 shadow-lg z-50 safe-area-bottom">
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
