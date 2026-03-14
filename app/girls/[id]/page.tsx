'use client'
import { useState, useEffect } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import ReviewForm from '@/components/ReviewForm'

export default function GirlDetailPage() {
  const params = useParams()
  const [girl, setGirl] = useState<any>(null)
  const [diaries, setDiaries] = useState<any[]>([]) // 日記用
  const [reviews, setReviews] = useState<any[]>([]) // 口コミ用
  const [relatedGirls, setRelatedGirls] = useState<any[]>([]) // 関連キャスト用
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://crm.h-mitsu.com/api/idol/casts?store_id=2', { cache: 'no-store' });
        const data = await res.json();
        // 一覧データの中から、URLのパラメータ(params.id)と一致するキャストを抽出
        const currentGirl = data.casts ? data.casts.find((c: any) => c.id.toString() === params.id) : null;

        if (currentGirl) {
          setGirl(currentGirl);

          // 2. ページタイトルを動的に変更 (SEO対策: ブラウザのタブ名が変わります)
          document.title = `${currentGirl?.name || 'キャスト'} | 船橋デリヘル アイドル学園`;

          // 2.5 この女の子の日記を取得
          try {
            const diariesRes = await fetch('https://crm.h-mitsu.com/api/idol/diaries?store_id=2&limit=50', { cache: 'no-store' });
            const diariesData = await diariesRes.json();
            if (diariesData.diaries) {
              const myDiaries = diariesData.diaries.filter((d: any) => d.cast_id.toString() === params.id);
              setDiaries(myDiaries);
            }
          } catch (e) {
            console.error('Failed to fetch diaries', e);
          }

          // 2.6 この女の子の口コミを取得 (API未実装のため空)
          setReviews([]);

          // 3. 関連キャスト取得
          if (data.casts) {
            const others = data.casts.filter((c: any) => c.id.toString() !== params.id).slice(0, 3);
            setRelatedGirls(others);
          }
        }
      } catch (err) {
        console.error('Failed to fetch girl data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData()
  }, [params.id])

  // 画像URLを取得するヘルパー関数
  const getImageUrl = (g: any) => {
    if (g.idol_image_path) return g.idol_image_path
    if (g.images && g.images[0]) return g.images[0]
    if (g.image1_url) return g.image1_url
    return null
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">読み込み中...</div>
  if (!girl) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">データが見つかりません</div>

  const allImages = [];
  if (girl.idol_image_path) allImages.push(girl.idol_image_path);
  else if (girl.image) allImages.push(girl.image);

  if (girl.gallery_images && Array.isArray(girl.gallery_images)) {
    allImages.push(...girl.gallery_images);
  }

  const goToSlide = (index: number) => {
    if (index < 0) setCurrentSlide(allImages.length - 1)
    else if (index >= allImages.length) setCurrentSlide(0)
    else setCurrentSlide(index)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(currentSlide + 1)
      else goToSlide(currentSlide - 1)
    }
    setTouchStart(null)
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-36 text-slate-800 font-sans">

      {/* 1. SEO対策: パンくずリスト */}
      <div className="bg-white px-4 py-2 text-[10px] text-slate-500 flex items-center gap-1 border-b border-slate-100">
        <Link href="/funabashi" className="hover:text-pink-600">トップ</Link>
        <span>&gt;</span>
        <Link href="/girls" className="hover:text-pink-600">在籍一覧</Link>
        <span>&gt;</span>
        <span className="font-bold text-slate-800">{girl?.name}</span>
      </div>

      {/* 2. 画像スライダー */}
      <div className="w-full max-w-sm mx-auto my-8">
        <div className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-xl border border-white/50"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {allImages.length > 0 ? (
            <>
              {allImages.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`${girl?.name || ''} ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                  style={{ opacity: i === currentSlide ? 1 : 0 }}
                />
              ))}

              {/* 前へ / 次へボタン */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => goToSlide(currentSlide - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors z-10"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => goToSlide(currentSlide + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors z-10"
                  >
                    ›
                  </button>
                </>
              )}

              {/* ドットインジケーター */}
              {allImages.length > 1 && (
                <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1.5 z-10">
                  {allImages.map((_: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              )}

              {/* 枚数表示 */}
              {allImages.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/40 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm z-10">
                  {currentSlide + 1} / {allImages.length}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* 画像の上に名前を重ねておしゃれに */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-12 z-10">
            <h1 className="text-2xl font-bold text-white shadow-sm">
              {girl?.name}
            </h1>
            <p className="text-white/80 text-sm">{girl?.age ? `${girl.age}歳` : ''}</p>
            {girl?.is_attending && (
              <div className="inline-flex items-center gap-1 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg border border-pink-400 mt-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                本日出勤中！
              </div>
            )}
          </div>
        </div>

        {/* サムネイル一覧 */}
        {allImages.length > 1 && (
          <div className="flex gap-1.5 mt-3 justify-center overflow-x-auto px-2">
            {allImages.map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-12 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${i === currentSlide ? 'border-pink-500 ring-1 ring-pink-300' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-xl mx-auto px-4 -mt-6 relative z-10 space-y-6">

        {/* 3. 本日の出勤時間（最重要！） */}
        <div className="bg-white rounded-2xl shadow-xl p-5 text-center transform transition-transform border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>
          <p className="text-xs font-bold text-slate-400 mb-1 tracking-widest uppercase">Today's Schedule</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl animate-bounce">⏰</span>
            <p className="text-3xl font-black text-slate-800 tracking-tight">
              {girl.today_hours || <span className="text-slate-400 text-xl">時間未定</span>}
            </p>
          </div>
          {girl.today_hours && (
            <p className="text-[10px] text-red-500 font-bold mt-2 bg-red-50 inline-block px-2 py-1 rounded">
              ※人気のため早めのご予約をおすすめします
            </p>
          )}
        </div>

        {/* 4. 店長からの推薦コメント（CVRアップの鍵） */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center gap-2">
            <span className="text-lg">👑</span>
            <h2 className="font-bold text-sm text-slate-700">店長の推薦コメント</h2>
          </div>
          <div className="p-4">
             <div className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 overflow-hidden border border-slate-300">
                 {/* 店長アイコン（仮） */}
                 <div className="w-full h-full flex items-center justify-center text-[10px]">店長</div>
               </div>
               <div className="flex-1">
                  <div className="bg-slate-100 rounded-xl rounded-tl-none p-3 text-sm text-slate-700 leading-relaxed relative">
                    {girl.schedule_comment || 'とっても可愛らしい新人さんが入店しました！写真よりも実物の方が数倍かわいいタイプです。性格もおっとりしていて癒やされますよ。ぜひ一度お会いしてみてください！'}
                    <div className="absolute top-0 left-[-8px] w-0 h-0 border-t-[10px] border-r-[10px] border-t-slate-100 border-r-transparent"></div>
                  </div>
               </div>
             </div>
          </div>
        </div>

        {/* 5. プロフィール詳細データ */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 border-l-4 border-pink-500 pl-3">
            プロフィール詳細
          </h2>

          {/* スリーサイズ */}
          <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-3 gap-2 text-center mb-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400">BUST</p>
              <p className="font-black text-slate-700 text-lg">
                {girl.bust || '-'} <span className="text-xs font-normal text-slate-500">({girl.cup || '-'})</span>
              </p>
            </div>
            <div className="border-x border-slate-200">
              <p className="text-[10px] font-bold text-slate-400">WAIST</p>
              <p className="font-black text-slate-700 text-lg">{girl.waist || '-'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400">HIP</p>
              <p className="font-black text-slate-700 text-lg">{girl.hip || '-'}</p>
            </div>
          </div>

          {/* 詳細テーブル */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-8 mb-4">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-xs font-bold text-slate-400">身長</span>
              <span className="font-bold text-slate-700">{girl.height ? `${girl.height}cm` : '-'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-xs font-bold text-slate-400">年齢</span>
              <span className="font-bold text-slate-700">{girl.age ? `${girl.age}歳` : '-'}</span>
            </div>
            {girl.birthplace && (
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-xs font-bold text-slate-400">出身地</span>
                <span className="font-bold text-slate-700">{girl.birthplace}</span>
              </div>
            )}
            {girl.blood_type && (
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-xs font-bold text-slate-400">血液型</span>
                <span className="font-bold text-slate-700">{girl.blood_type}</span>
              </div>
            )}
            {girl.zodiac && (
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-xs font-bold text-slate-400">星座</span>
                <span className="font-bold text-slate-700">{girl.zodiac}</span>
              </div>
            )}
            {girl.similar_celeb && (
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-xs font-bold text-slate-400">似てる芸能人</span>
                <span className="font-bold text-slate-700">{girl.similar_celeb}</span>
              </div>
            )}
            {girl.charm_point && (
              <div className="col-span-2 flex justify-between border-b border-slate-100 pb-1">
                <span className="text-xs font-bold text-slate-400">チャームポイント</span>
                <span className="font-bold text-slate-700">{girl.charm_point}</span>
              </div>
            )}
            {girl.alcohol && (
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-xs font-bold text-slate-400">お酒</span>
                <span className="font-bold text-slate-700">{girl.alcohol}</span>
              </div>
            )}
            {girl.tobacco && (
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-xs font-bold text-slate-400">タバコ</span>
                <span className="font-bold text-slate-700">{girl.tobacco}</span>
              </div>
            )}
          </div>

          {/* 特徴タグ */}
          {girl.tags && girl.tags.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wide">Features</p>
              <div className="flex flex-wrap gap-2">
                {girl.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-3 py-1 rounded-full border border-pink-200 font-bold shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 6. 本人からのメッセージ */}
        {girl.message && (
          <div className="bg-pink-50 rounded-2xl p-6 shadow-sm relative border border-pink-100">
            <div className="absolute -top-3 left-6 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              MESSAGE
            </div>
            <p className="text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
              {girl.message}
            </p>
            <div className="text-right mt-2 text-pink-400 text-sm">
              From {girl.name}
            </div>
          </div>
        )}

        {/* 6.5 Q&A 一問一答 */}
        {(girl.q_hobby || girl.q_type || girl.q_fetish || girl.q_sensitive || girl.q_play || girl.q_first_time || girl.q_off_day || girl.q_dream) && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 border-l-4 border-blue-400 pl-3">
              教えて！Q&A
            </h2>
            <div className="space-y-4">
              {girl.q_hobby && (
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-blue-400 block mb-1">Q. 趣味・特技は？</span>
                  <p className="text-sm text-slate-700">{girl.q_hobby}</p>
                </div>
              )}
              {girl.q_type && (
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-pink-400 block mb-1">Q. 好きなタイプは？</span>
                  <p className="text-sm text-slate-700">{girl.q_type}</p>
                </div>
              )}
              {girl.q_fetish && (
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-purple-400 block mb-1">Q. 実は〇〇フェチです</span>
                  <p className="text-sm text-slate-700">{girl.q_fetish}</p>
                </div>
              )}
              {girl.q_sensitive && (
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-red-400 block mb-1">Q. 感じやすいところは？</span>
                  <p className="text-sm text-slate-700">{girl.q_sensitive}</p>
                </div>
              )}
              {girl.q_play && (
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-orange-400 block mb-1">Q. 得意プレイは？</span>
                  <p className="text-sm text-slate-700">{girl.q_play}</p>
                </div>
              )}
              {girl.q_first_time && (
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-green-500 block mb-1">Q. 初めてのお客様に一言</span>
                  <p className="text-sm text-slate-700">{girl.q_first_time}</p>
                </div>
              )}
              {girl.q_off_day && (
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-cyan-500 block mb-1">Q. お休みの日は何してる？</span>
                  <p className="text-sm text-slate-700">{girl.q_off_day}</p>
                </div>
              )}
              {girl.q_dream && (
                <div>
                  <span className="text-xs font-bold text-amber-500 block mb-1">Q. 将来の夢は？</span>
                  <p className="text-sm text-slate-700">{girl.q_dream}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 📷 写メ日記 (修正版) --- */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📷</span> 写メ日記
          </h2>

          {diaries && diaries.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {diaries.map((diary) => (
                <Link
                  key={diary.id}
                  href={`/diaries/${diary.id}`}
                  className="block group cursor-pointer"
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-2 relative">
                    {diary.images?.[0] || diary.image_url ? (
                      <img
                        src={diary.images?.[0] || diary.image_url}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2">
                       <span className="text-white text-[10px] font-bold">
                         {new Date(diary.created_at).toLocaleDateString()}
                       </span>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-pink-500 transition">
                    {diary.title}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8 bg-gray-50 rounded-xl">
              まだ投稿がありません
            </p>
          )}

          {/* 「もっと見る」ボタンで一覧ページへ誘導 */}
          <div className="text-center mt-6">
            <Link href="/diaries" className="inline-block border border-gray-300 px-6 py-2 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-100 transition">
              みんなの写メ日記を見る →
            </Link>
          </div>
        </div>

        {/* 8. 口コミセクション */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 border-l-4 border-yellow-400 pl-3">
            <span className="text-yellow-500">⭐️</span> 口コミ
          </h2>

          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                      <span className="text-xs text-slate-500">{review.rating}点</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.title && (
                    <h4 className="font-bold text-slate-800 mb-2">{review.title}</h4>
                  )}
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{review.content}</p>
                  <p className="text-xs text-slate-400 mt-2 text-right">— {review.nickname}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-6 text-center text-slate-400 text-sm border border-dashed border-slate-200">
              まだ口コミがありません
            </div>
          )}

          {/* 口コミ投稿フォーム */}
          <ReviewForm girlId={String(girl.id)} />
        </div>

        {/* 9. 直帰率を下げる「他のおすすめキャスト」 */}
        {relatedGirls.length > 0 && (
          <div className="pt-4 border-t border-slate-200">
            <h3 className="font-bold text-slate-600 mb-3 text-sm">この子を見た人はこんな子も見ています</h3>
            <div className="grid grid-cols-3 gap-2">
              {relatedGirls.map((other) => {
                const otherImage = getImageUrl(other)
                return (
                  <Link href={`/girls/${other.id}`} key={other.id} className="block group">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-slate-200 mb-1 relative">
                      {otherImage ? (
                        <img src={otherImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Img</div>
                      )}
                      {other.is_attending && <div className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full m-1 border border-white"></div>}
                    </div>
                    <p className="text-[10px] font-bold text-slate-700 truncate">{other.name}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* 7. 追尾フッター（CVエリア） */}
      <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-t border-white/40 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] pb-safe"></div>
        <div className="max-w-xl mx-auto relative pointer-events-auto px-4 py-3 pb-safe flex gap-3">

          <a href="tel:05017459665" className="flex-1 bg-white border-2 border-pink-500 text-pink-600 rounded-full flex flex-col items-center justify-center py-2 shadow-lg active:scale-95 transition-transform hover:bg-pink-50">
            <span className="text-[10px] font-bold">電話で空き確認</span>
            <span className="text-lg font-black leading-none tracking-tighter">050-1745-9665</span>
          </a>

          <Link href="/chat" className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center gap-2 py-2 shadow-lg active:scale-95 transition-transform hover:opacity-90 ring-2 ring-white ring-offset-2 ring-offset-blue-200">
            <span className="text-2xl animate-pulse">💬</span>
            <div className="flex flex-col leading-none">
               <span className="text-[10px] font-bold opacity-90">待たずに連絡</span>
               <span className="font-black text-lg">今すぐ指名</span>
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}
