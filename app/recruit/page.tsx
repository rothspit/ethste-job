import Link from 'next/link'

export default function RecruitPage() {
  return (
    <div className="min-h-screen bg-pink-50 pb-20">
      {/* ヘッダー */}
      <div className="bg-white p-4 shadow flex justify-between items-center sticky top-0 z-10">
        <h1 className="font-black text-pink-500 italic">IDOL GAKUEN RECRUIT</h1>
        <Link href="/" className="text-xs bg-slate-800 text-white px-3 py-1 rounded">TOPへ</Link>
      </div>

      {/* メインビジュアル */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-16 px-4">
        <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
          船橋エリア<br/><span className="text-yellow-300">最高クラス</span>の待遇を。
        </h2>
        <p className="font-bold mb-8">未経験でも日給3万円〜スタート！<br/>あなたの夢を応援します。</p>
        <Link href="/chat" className="inline-block bg-white text-pink-600 font-black text-lg px-8 py-4 rounded-full shadow-lg animate-pulse">
          LINEで簡単応募する 💬
        </Link>
      </div>

      {/* ポイント */}
      <div className="max-w-4xl mx-auto p-4 grid md:grid-cols-3 gap-4 -mt-8">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="text-4xl mb-2">💰</div>
          <h3 className="font-bold text-lg mb-2">全額日払いOK</h3>
          <p className="text-sm text-slate-500">急な出費でも安心。働いたその日がお給料日です。</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="text-4xl mb-2">🚗</div>
          <h3 className="font-bold text-lg mb-2">完全送迎あり</h3>
          <p className="text-sm text-slate-500">行きも帰りも無料送迎。プライバシーもしっかり守ります。</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="text-4xl mb-2">👗</div>
          <h3 className="font-bold text-lg mb-2">衣装・メイク貸出</h3>
          <p className="text-sm text-slate-500">手ぶらで出勤OK！可愛い衣装を多数用意しています。</p>
        </div>
      </div>

      {/* 募集要項 */}
      <div className="max-w-2xl mx-auto mt-12 p-4">
        <h3 className="text-xl font-black text-slate-800 text-center mb-6">募集要項</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <tbody className="divide-y divide-slate-100">
              <tr>
                <th className="bg-slate-50 p-4 font-bold text-slate-600 w-1/3">職種</th>
                <td className="p-4">メンズエステ・リラクゼーション</td>
              </tr>
              <tr>
                <th className="bg-slate-50 p-4 font-bold text-slate-600">資格</th>
                <td className="p-4">18歳以上（高校生不可）<br/>未経験者大歓迎！</td>
              </tr>
              <tr>
                <th className="bg-slate-50 p-4 font-bold text-slate-600">給与</th>
                <td className="p-4">バック率 60%〜75%<br/>※各種ボーナスあり</td>
              </tr>
              <tr>
                <th className="bg-slate-50 p-4 font-bold text-slate-600">時間</th>
                <td className="p-4">11:00〜翌3:00<br/>※週1日・3時間〜OK</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link href="/chat" className="text-pink-600 font-bold underline">
          もっと詳しく聞く（チャットへ）
        </Link>
      </div>
    </div>
  )
}
