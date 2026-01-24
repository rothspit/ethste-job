import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// ▼ Supabaseクライアント（サーバー側）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ▼ データを取得する関数
async function getGirl(id: string) {
  const { data: girl, error } = await supabase
    .from('girls')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching girl:', error)
  }

  return girl
}

// ▼ 詳細ページコンポーネント
// Next.js 15以降は params を await する必要があります
export default async function GirlDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const girl = await getGirl(id)

  // データがなければ404ページへ
  if (!girl) {
    return notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* 写真エリア（大きく表示） */}
      <div className="relative w-full h-[500px] bg-gray-200">
        {girl.image1_url ? (
          <img
            src={girl.image1_url}
            alt={girl.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">NO IMAGE</div>
        )}

        {/* 名前と年齢のオーバーレイ */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 text-white pt-20">
          <h1 className="text-4xl font-bold mb-1">
            {girl.name} <span className="text-2xl font-normal ml-2">{girl.age}歳</span>
          </h1>
          <p className="opacity-90">{girl.status || '受付中'}</p>
        </div>

        {/* 戻るボタン */}
        <Link href="/" className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
          ← 戻る
        </Link>
      </div>

      {/* プロフィール詳細エリア */}
      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

          {/* コメント */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
              キャストからのメッセージ
            </h2>
            <div className="bg-purple-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed border border-purple-100">
              {girl.message || 'よろしくお願いします！'}
            </div>
          </div>

          {/* サイズ情報テーブル */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-3">サイズ・データ</h2>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-400">身長</p>
                <p className="font-bold text-gray-800">{girl.height || '-'} cm</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-400">スリーサイズ</p>
                <p className="font-bold text-gray-800">
                  B{girl.bust || '-'} ( {girl.cup || '-'} )
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-400">W / H</p>
                <p className="font-bold text-gray-800">
                  W{girl.waist || '-'} / H{girl.hip || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* 所属店舗情報（予約ボタン） */}
          <div className="mt-8 border-t pt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">このキャストは以下の店舗に在籍しています</p>
            <p className="font-bold text-lg mb-4">アイドル学園</p>

            <a
              href="tel:09000000000"
              className="block w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-transform"
            >
              電話で予約する
            </a>
          </div>

        </div>
      </div>
    </main>
  )
}
