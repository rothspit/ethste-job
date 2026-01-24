'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

// ▼ Supabaseクライアント（ブラウザ用）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ▼ 型定義
type Cast = {
  id: string
  name: string
  age: number | null
  image1_url: string | null
  status: string
  message: string | null
  shop_id: string
}

export default function FunabashiShopPage() {
  // ▼ 店舗ID (アイドル学園)
  const SHOP_ID = '15b052ec-c582-418e-854e-6de6049ea0f7'

  // ▼ 状態管理 (Alpine.jsの x-data に相当)
  const [casts, setCasts] = useState<Cast[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedCast, setSelectedCast] = useState<Cast | null>(null)

  // 予約フォーム用
  const [nominationType, setNominationType] = useState('free')
  const [selectedMinutes, setSelectedMinutes] = useState(80)
  const [locationType, setLocationType] = useState('hotel_funabashi')
  const [customerPhone, setCustomerPhone] = useState('')

  // ▼ データ取得 (useEffect)
  useEffect(() => {
    async function fetchCasts() {
      try {
        const { data, error } = await supabase
          .from('girls')
          .select('*')
          .eq('shop_id', SHOP_ID) // 自分の店の女の子だけ
          .eq('is_active', true)

        if (error) throw error
        setCasts(data || [])
      } catch (e) {
        console.error('データ取得エラー:', e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCasts()
  }, [])

  // ▼ 料金計算ロジック
  const prices: { [key: number]: number } = { 60: 18000, 80: 22000, 100: 26000, 120: 34000, 150: 42000, 180: 50000 }

  const getCourseName = (min: number) => {
    const names: { [key: number]: string } = { 60: '基本授業', 80: '放課後デート', 100: '濃厚レッスン', 120: '秘密の合宿' }
    return names[min] || 'ロングコース'
  }

  const calculateTotal = () => {
    let base = prices[selectedMinutes] || 0
    let nom = nominationType === 'free' ? 0 : (nominationType === 'photo' ? 2000 : 3000)
    let transport = (locationType.includes('hotel')) ? 0 : 1000
    return base + nom + transport
  }

  const openBooking = (cast: Cast | null) => {
    setSelectedCast(cast)
    setNominationType(cast ? 'photo' : 'free')
    setIsModalOpen(true)
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 pb-28 font-sans">

      {/* ヘッダー */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-40 border-b border-pink-100">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-md">
          <Link href="/" className="font-bold text-xl text-pink-500 flex items-center">
            アイドル学園
            <span className="text-xs ml-2 bg-pink-100 text-pink-600 px-2 py-0.5 rounded">船橋校</span>
          </Link>
          <a href="tel:09000000000" className="bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow hover:bg-green-600 transition">
            電話
          </a>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="mt-16 max-w-md mx-auto relative">
        <div className="h-96 bg-gray-200 overflow-hidden relative group">
          <img
            src="/images/hero-funabashi.jpg"
            alt="アイドル学園 船橋校"
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block shadow">
              最短5分で到着
            </span>
          </div>
        </div>

        <div className="p-4 -mt-6 relative z-10 space-y-3">
          <button onClick={() => setIsChatOpen(true)} className="block w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white text-center font-bold text-lg py-4 rounded-xl shadow-lg transform active:scale-95 transition border-2 border-white mb-3">
            学園コンシェルジュ
          </button>
          <a href="tel:09000000000" className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-center font-bold text-lg py-4 rounded-xl shadow-lg transform active:scale-95 transition border-2 border-white animate-pulse">
            今すぐ電話で予約する
          </a>
          <p className="text-center text-xs text-gray-500">※現在、船橋駅周辺へ【最短5分】で到着！</p>
        </div>
      </section>

      {/* 即ドル割バナー */}
      <section className="max-w-md mx-auto px-4 my-6">
        <div className="py-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-xl shadow-lg">
          <div className="text-center">
            <p className="text-white font-bold flex items-center justify-center gap-2 text-lg">
              即ドル割 -¥3,000
            </p>
            <p className="text-white/90 text-xs">今すぐ行ける子を選ぶとおトク！</p>
          </div>
        </div>
      </section>

      {/* キャスト一覧 */}
      <section className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-xl text-gray-800">
            <span className="text-pink-500">●</span> 登校メンバー
          </h3>
          <span className="text-xs bg-red-100 text-red-500 font-bold px-2 py-1 rounded-full animate-pulse">即案内OK</span>
        </div>

        {/* ローディング表示 */}
        {isLoading && (
          <div className="text-center py-10 text-gray-400">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full mb-2"></div>
            <p>読み込み中...</p>
          </div>
        )}

        {/* キャストリスト */}
        {!isLoading && casts.map((cast) => (
          <div key={cast.id} className="bg-white rounded-xl overflow-hidden shadow-md mb-4 border border-gray-100 relative">
            <div className="flex">
              <div className="w-1/3 bg-gray-200 relative h-40">
                {cast.image1_url ? (
                   <img src={cast.image1_url} className="w-full h-full object-cover" alt={cast.name} />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image</div>
                )}
                {/* 新人バッジ等のロジックは必要に応じて追加 */}
              </div>
              <div className="w-2/3 p-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <h4 className="font-bold text-lg">{cast.name}</h4>
                    <span className="text-xs text-gray-500">{cast.age}歳</span>
                  </div>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded line-clamp-2">
                    {cast.message || 'よろしくお願いします♪'}
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                    <Link href={`/girls/${cast.id}`} className="flex-1 bg-gray-100 text-gray-600 text-center text-xs font-bold py-2 rounded-lg hover:bg-gray-200">
                        詳細
                    </Link>
                    <button onClick={() => openBooking(cast)} className="flex-[2] bg-pink-500 text-white text-center text-sm font-bold py-2 rounded-lg shadow hover:bg-pink-600 transition">
                        この子を指名
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-4">
          <button onClick={() => openBooking(null)} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition">
            おまかせフリー予約
            <span className="block text-xs font-normal opacity-90">指名なしでスタッフにお任せ</span>
          </button>
        </div>
      </section>

      {/* 料金表 */}
      <section className="max-w-md mx-auto px-4 py-6 bg-white my-6 rounded-xl shadow-sm mx-4">
        <h3 className="text-center font-bold text-lg mb-6">学費（授業料）</h3>
        <div className="space-y-3">
            {[60, 80, 100, 120].map((min) => (
                <div key={min} className="flex justify-between items-center border-b border-dashed border-gray-300 pb-3">
                    <div>
                        <span className="font-bold text-gray-700">{getCourseName(min)}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-1 rounded ml-1">{min}分</span>
                    </div>
                    <div className="text-xl font-bold text-pink-500">¥{prices[min].toLocaleString()}</div>
                </div>
            ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-200 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">写真指名</span><span>+¥2,000</span></div>
            <div className="flex justify-between"><span className="text-gray-600">本指名</span><span>+¥3,000</span></div>
        </div>
      </section>

      {/* 予約モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-pink-500 to-pink-400 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold">入学願書（予約）</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-xl">✕</button>
            </div>

            <div className="p-5">
              {/* 選択キャスト */}
              <div className="flex items-center mb-6 bg-pink-50 p-3 rounded-lg border border-pink-100">
                {selectedCast?.image1_url ? (
                    <img src={selectedCast.image1_url} className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-white shadow" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 mr-3 border-2 border-white shadow flex items-center justify-center text-xs">Free</div>
                )}
                <div>
                  <div className="text-xs text-gray-500">{selectedCast ? 'ご指名' : 'フリー'}</div>
                  <div className="font-bold text-lg">{selectedCast?.name || 'おまかせ'}</div>
                </div>
              </div>

              {/* 簡易フォーム */}
              <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">コース選択</label>
                    <select value={selectedMinutes} onChange={(e) => setSelectedMinutes(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm">
                        {[60, 80, 100, 120].map(m => (
                            <option key={m} value={m}>{getCourseName(m)} ({m}分) - ¥{prices[m].toLocaleString()}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">電話番号</label>
                    <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="090-0000-0000" className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm" />
                  </div>

                  {/* 合計金額 */}
                  <div className="text-right py-3 border-t border-b border-gray-100 my-4 bg-pink-50 -mx-5 px-5">
                      <span className="text-xs text-gray-500">お支払い予定額</span>
                      <div className="text-2xl font-bold text-pink-500">¥{calculateTotal().toLocaleString()}</div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-90 transition">
                      この内容で送信する (デモ)
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <h4 className="font-bold text-lg mb-1">アイドル学園 船橋校</h4>
        <p className="text-xs text-gray-400 mb-4">千葉県船橋市本町エリア中心</p>
        <p className="text-[10px] text-gray-500">© 2026 Idol Gakuen Funabashi</p>
      </footer>
    </div>
  )
}
