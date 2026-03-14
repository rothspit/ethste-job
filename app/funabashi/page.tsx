'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Noto_Sans_JP } from 'next/font/google'
import { createClient } from '@supabase/supabase-js'
import ScheduleSection from '@/components/ScheduleSection'
import RankingSection from '@/components/RankingSection'
import PriceListIdol from '@/components/PriceListIdol'
import CardPayment from '@/components/CardPayment'
import DiarySection from '@/components/DiarySection'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const baseFont = Noto_Sans_JP({
  weight: ['700', '900'],
  subsets: ['latin'],
  preload: false,
})





export default function FunabashiPage() {
  const [isVerified, setIsVerified] = useState(false)

  // 実際のキャストデータ
  const [realCasts, setRealCasts] = useState<any[]>([])
  const [brandId, setBrandId] = useState<string | null>(null)

  useEffect(() => {
    const checkVerified = localStorage.getItem('age_verified')
    if (checkVerified === 'true') {
      setIsVerified(true)
    }

    // ブランドIDを取得
    const fetchBrand = async () => {
      const { data } = await supabase.from('brands').select('id').eq('slug', 'idol-gakuen').single()
      if (data) setBrandId(data.id)
    }
    fetchBrand()
  }, [])

  // ブランドID取得後にキャストデータを取得
  useEffect(() => {
    if (!brandId) return
    const fetchCasts = async () => {
      const { data } = await supabase
        .from('girls')
        .select('*')
        .eq('brand_id', brandId)
        .eq('is_attending', true)
        .order('ranking_order', { ascending: true })
      if (data) {
        setRealCasts(data)
      }
    }
    fetchCasts()
  }, [brandId])



  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EntertainmentBusiness",
        "name": "アイドル学園 船橋",
        "image": "https://idolgakuen.jp/idol_top.jpg",
        "description": "船橋エリアのデリバリーヘルス「アイドル学園」。最短30分で到着。明朗会計。",
        "telephone": "050-1745-9665",
        "address": { "@type": "PostalAddress", "addressLocality": "Funabashi", "addressRegion": "Chiba", "addressCountry": "JP" },
        "priceRange": "¥10000-",
        "openingHoursSpecification": { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "opens": "10:00", "closes": "04:00" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "船橋のアイドル学園は初心者でも利用できますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい、初心者の方でも安心してご利用いただけるよう、丁寧なご案内を心がけております。" } },
          { "@type": "Question", "name": "クレジットカードは使えますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい、各種クレジットカードをご利用いただけます。" } }
        ]
      }
    ]
  }

  const handleVerify = () => {
    localStorage.setItem('age_verified', 'true')
    setIsVerified(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="bg-slate-50 min-h-screen pb-32 relative">
      {/* フォント&アニメーション */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&display=swap');

        .font-rounded { font-family: 'M PLUS Rounded 1c', sans-serif; }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .wiggle { animation: wiggle 0.5s ease-in-out infinite; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        .sparkle { animation: sparkle 1.5s ease-in-out infinite; }

        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .rainbow-bg {
          background: linear-gradient(90deg, #FF69B4, #87CEEB, #FFD700, #FF69B4);
          background-size: 300% 300%;
          animation: rainbow 3s ease infinite;
        }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 年齢確認モーダル */}
      {!isVerified && (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/idol_top.jpg')] bg-cover bg-center opacity-20 blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/60"></div>
          </div>

          <div className="relative z-10 w-full max-w-md bg-black/80 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-2xl text-center space-y-6">
            <div>
              <h1 className={`${baseFont.className} text-3xl font-black text-white tracking-widest mb-1`}>
                IDOL <span className="text-pink-500">GAKUEN</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Funabashi Delivery Health</p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-2">年齢確認</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                当サイトは風俗営業法に基づき運営されています。<br/>
                <span className="text-pink-500 font-bold underline">18歳未満の方</span>のご利用は固くお断りします。
              </p>
            </div>

            <div className="space-y-3">
              <button onClick={handleVerify} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black py-4 rounded-full shadow-lg hover:scale-[1.02] transition-transform text-lg flex items-center justify-center gap-2">
                <span>ENTER</span>
                <span className="text-xs bg-black/20 px-2 py-0.5 rounded font-normal">18歳以上です</span>
              </button>
              <a href="https://www.google.com" className="block text-xs text-slate-500 hover:text-slate-300 underline">いいえ (退室する)</a>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-left">
              船橋・西船橋・津田沼エリアのデリバリーヘルス「アイドル学園」。厳選された美女セラピストが最短30分で出張いたします。
            </div>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur text-pink-600 shadow-sm border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/funabashi" className={`${baseFont.className} text-xl font-black tracking-wider hover:opacity-80 transition-opacity`}>
            アイドル<span className="text-pink-400">学園</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/recruit" className="bg-yellow-400 text-slate-900 text-[10px] font-black px-2 py-2 rounded shadow-sm hover:bg-yellow-300">求人</Link>
          </div>
        </div>
      </div>

      {/* 出勤スケジュール */}
      <div className="pt-4">
        <ScheduleSection />
      </div>

      <DiarySection brandSlug="idol-gakuen" />

      {/* 在籍一覧ボタン */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <Link href="/girls" className="block w-full bg-white border-2 border-slate-200 text-slate-600 font-bold py-3 rounded-xl text-center shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
          <span>👥</span> 在籍キャスト一覧を見る
          <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-500">全員</span>
        </Link>
      </div>

      {/* ========== 生徒手帳（会員ポイント）カード ========== */}
      <div className="max-w-2xl mx-auto px-4 my-8">
        <div className="relative overflow-hidden rounded-2xl shadow-sm border border-pink-100" style={{
          background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 50%, #F0F8FF 100%)',
        }}>
          {/* キラキラエフェクト */}
          <div className="absolute top-2 right-4 text-2xl sparkle">✨</div>
          <div className="absolute top-8 right-12 text-lg sparkle" style={{ animationDelay: '0.5s' }}>⭐</div>
          <div className="absolute bottom-4 left-4 text-xl sparkle" style={{ animationDelay: '1s' }}>💖</div>

          <div className="relative z-10 p-5">
            {/* ヘッダー部分 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-2xl">🎒</span>
                </div>
                <div>
                  <p className="font-rounded font-bold text-slate-500 text-xs tracking-wider">IDOL GAKUEN</p>
                  <p className="font-rounded font-extrabold text-pink-500 text-lg">生徒手帳</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg px-3 py-1 shadow-sm border border-pink-100">
                <p className="text-[10px] text-pink-400 font-bold">STUDENT ID</p>
              </div>
            </div>

            {/* メインコンテンツ */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="text-center">
                <p className="font-rounded text-pink-600 text-xs font-bold mb-1">🎉 新入生応援キャンペーン 🎉</p>
                <p className="font-rounded text-slate-800 text-sm font-bold mb-2">今なら入学祝いとして</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-rounded text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                    2,000
                  </span>
                  <span className="font-rounded text-xl font-bold text-pink-500">pt</span>
                </div>
                <p className="font-rounded text-slate-600 text-xs mt-1">プレゼント！（2,000円相当）</p>
              </div>

              <div className="mt-4 space-y-2">
                {[
                  '初登校ですぐ使える！',
                  '1pt = 1円で利用OK！',
                  '誕生日には2倍ptプレゼント🎂',
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700 text-xs font-rounded font-bold">
                    <span className="text-pink-400">♡</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <RankingSection />
      <PriceListIdol />
      <CardPayment />

      {/* SEOエリア */}
      <div className="max-w-2xl mx-auto px-4 py-8 bg-white border-t border-slate-100">
        <h2 className="text-lg font-black text-slate-800 mb-4">船橋で人気のデリヘルなら「アイドル学園」</h2>
        <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
          <p>船橋・西船橋エリアを中心に展開する「アイドル学園」は、ルックス重視の厳選採用を行ったデリバリーヘルス店です。津田沼、市川、本八幡エリアのホテルやご自宅へも出張可能です。</p>
          <p><strong>【初心者の方へ】</strong><br/>当店は明朗会計を徹底しております。パネル指名料や消費税などの不明瞭な追加料金は一切ございません。初めての方でも安心して遊んでいただけるよう、スタッフが丁寧にご案内いたします。</p>
          <h3 className="font-bold text-slate-800 mt-4 mb-2">❓ よくある質問 (FAQ)</h3>
          <dl className="space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <dt className="font-bold text-pink-600 text-xs">Q. すぐに来てもらえますか？</dt>
              <dd className="mt-1 text-xs">A. 船橋駅周辺であれば、最短30分程度で到着可能です。混雑状況はチャットやお電話にてリアルタイムにご確認いただけます。</dd>
            </div>
            <div className="border-b border-slate-100 pb-2">
              <dt className="font-bold text-pink-600 text-xs">Q. 領収書は発行できますか？</dt>
              <dd className="mt-1 text-xs">A. はい、可能です。店名が分からない形での発行も対応しておりますので、お気軽にお申し付けください。</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* フッター */}
      <div className="mt-8 bg-pink-50 text-slate-700 text-center py-8 px-4 mb-20">
        <h3 className="font-bold mb-2">キャスト・スタッフ募集中</h3>
        <p className="text-xs text-slate-500 mb-4">アイドル学園で一緒に働きませんか？</p>
        <Link href="/recruit" className="inline-block border-2 border-pink-400 text-pink-500 font-bold px-6 py-2 rounded-full hover:bg-pink-400 hover:text-white transition-colors">採用情報を見る</Link>
      </div>

      {/* 追尾フッター */}
      <div className="fixed bottom-0 left-0 w-full z-40 pointer-events-none">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md border-t border-white/40 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] pb-safe"></div>
        <div className="max-w-2xl mx-auto relative pointer-events-auto px-3 py-2 pb-safe flex gap-3 items-end">
          <a href="tel:05017459665" className="flex-1 w-full group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-rose-300 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-white/90 to-white/60 backdrop-blur rounded-2xl p-[1px] shadow-sm overflow-hidden transform transition-all duration-300 hover:-translate-y-1 active:scale-98 ring-1 ring-pink-200/50">
              <div className="rounded-2xl flex flex-col items-center justify-center py-2.5 h-full transition-colors group-hover:bg-white/50">
                <span className="text-2xl mb-0.5 drop-shadow-sm text-pink-500">📞</span>
                <span className="text-[12px] font-black text-pink-600 tracking-widest">お電話でのご予約・お問い合わせ</span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <div className="pb-32"></div>
    </main>
  )
}
