'use client'
import Link from 'next/link'
import { Noto_Sans_JP } from 'next/font/google'
import ScheduleSection from '@/components/ScheduleSection'
import RankingSection from '@/components/RankingSection'
import PriceListIdol from '@/components/PriceListIdol'
import CardPayment from '@/components/CardPayment'
import DiarySection from '@/components/DiarySection'

const baseFont = Noto_Sans_JP({
  weight: ['700'],
  subsets: ['latin'],
  preload: false,
})

export default function HomeContentPage() {
  return (
    <main className="bg-slate-50 min-h-screen pb-32">

      {/* 1. ヘッダー */}
      <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur text-white shadow-lg border-b border-slate-700">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/funabashi" className={`${baseFont.className} text-xl font-black tracking-wider hover:opacity-80 transition-opacity`}>
            アイドル<span className="text-pink-500">学園</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/recruit" className="bg-yellow-500 text-slate-900 text-[10px] font-black px-2 py-2 rounded shadow hover:bg-yellow-400">
              求人
            </Link>
            <Link href="/login" className="bg-slate-700 text-white text-[10px] font-bold px-3 py-2 rounded-full shadow hover:bg-slate-600">
              ログイン
            </Link>
          </div>
        </div>
      </div>

      {/* 2. メインコンテンツ（画像は削除し、いきなり女の子！） */}
      <div className="pt-4">
        {/* 出勤スケジュール */}
        <ScheduleSection />
      </div>

      {/* 写メ日記セクション */}
      <DiarySection brandSlug="idol-gakuen" />

      {/* 在籍一覧ボタン */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <Link href="/girls" className="block w-full bg-white border-2 border-slate-200 text-slate-600 font-bold py-3 rounded-xl text-center shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
          <span>👥</span> 在籍キャスト一覧を見る
          <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-500">全員</span>
        </Link>
      </div>

      {/* 3. クーポン */}
      <div className="max-w-2xl mx-auto px-4 my-8">
        <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 p-[2px] rounded-2xl shadow-xl hover:scale-[1.02] transition-transform cursor-default">
          <div className="bg-white rounded-2xl p-4 text-center border-2 border-pink-100">
            <p className="text-slate-400 text-xs font-bold mb-1 tracking-widest">SPECIAL COUPON</p>
            <p className="text-slate-800 font-black text-lg md:text-xl">
              ✨ 初回限定 <span className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 font-black">3,000円OFF</span> ✨
            </p>
            <p className="text-xs text-slate-500 mt-2 font-bold">
              「サイト見た」とお伝えください 💕
            </p>
          </div>
          <div className="absolute -top-2 -left-2 text-2xl animate-bounce">🎁</div>
          <div className="absolute -bottom-2 -right-2 text-2xl animate-bounce delay-700">💝</div>
        </div>
      </div>

      {/* 4. その他の情報 */}
      <RankingSection />
      <PriceListIdol />
      <CardPayment />

      {/* フッター */}
      <div className="mt-12 bg-slate-800 text-white text-center py-8 px-4 mb-20">
        <h3 className="font-bold mb-2">キャスト・スタッフ募集中</h3>
        <p className="text-xs text-slate-400 mb-4">アイドル学園で一緒に働きませんか？</p>
        <Link href="/recruit" className="inline-block border border-white px-6 py-2 rounded-full hover:bg-white hover:text-slate-800 transition-colors">
          採用情報を見る
        </Link>
      </div>

      {/* 追尾フッター */}
      <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md border-t border-white/40 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] pb-safe"></div>
        <div className="max-w-2xl mx-auto relative pointer-events-auto px-3 py-2 pb-safe flex gap-3 items-end">
          <a href="tel:05017459665" className="flex-1 group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-rose-300 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-white/90 to-white/60 backdrop-blur rounded-2xl p-[1px] shadow-sm overflow-hidden transform transition-all duration-300 hover:-translate-y-1 active:scale-98 ring-1 ring-pink-200/50">
              <div className="rounded-2xl flex flex-col items-center justify-center py-2.5 h-full transition-colors group-hover:bg-white/50">
                <span className="text-2xl mb-0.5 drop-shadow-sm text-pink-500">📞</span>
                <span className="text-[10px] font-black text-pink-600 tracking-widest">電話予約</span>
              </div>
            </div>
          </a>
          <Link href="/student-council" className="flex-1 group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 active:scale-98 ring-1 ring-blue-300/50">
              <div className="flex flex-col items-center justify-center py-2.5 h-full text-white transition-opacity group-hover:opacity-90 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30 pointer-events-none"></div>
                <span className="text-2xl mb-0.5 drop-shadow">💬</span>
                <span className="text-[10px] font-black tracking-widest">直通チャット</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
