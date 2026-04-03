import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'スタッフ求人 | アイドル学園',
  description:
    '船橋エリア「アイドル学園」の店舗運営スタッフ（ドライバー・受付・事務など）を募集しています。キャスト求人とは別枠です。',
}

export default function StaffRecruitPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white p-4 shadow flex justify-between items-center sticky top-0 z-10 border-b border-slate-100">
        <div>
          <p className="text-[10px] font-bold text-indigo-500 tracking-widest">STAFF RECRUIT</p>
          <h1 className="font-black text-slate-800 text-lg">アイドル学園 スタッフ求人</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/recruit"
            className="text-[10px] font-bold text-pink-600 underline underline-offset-2 hidden sm:inline"
          >
            キャスト求人
          </Link>
          <Link href="/" className="text-xs bg-slate-800 text-white px-3 py-1 rounded">
            TOPへ
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-slate-800 text-white text-center py-14 px-4">
        <h2 className="text-2xl md:text-4xl font-black mb-3 leading-tight">
          店舗を支える
          <br />
          <span className="text-amber-200">スタッフ</span>を募集しています
        </h2>
        <p className="font-bold text-sm md:text-base mb-8 text-white/90 max-w-lg mx-auto">
          ドライバー・受付・事務など、未経験からでもステップアップできる職場です。
          <br />
          <span className="text-white/70 text-xs">※キャスト（派遣）求人とは別の募集です</span>
        </p>
        <a
          href="https://line.me/ti/p/Y_yyUiTXuW"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-indigo-700 font-black text-base md:text-lg px-8 py-4 rounded-full shadow-lg"
        >
          LINEで応募・お問い合わせ 💬
        </a>
      </div>

      <div className="max-w-4xl mx-auto p-4 grid md:grid-cols-3 gap-4 -mt-8">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center border border-slate-100">
          <div className="text-4xl mb-2">🌱</div>
          <h3 className="font-bold text-lg mb-2 text-slate-800">未経験OK</h3>
          <p className="text-sm text-slate-700">業界・職種未経験でも丁寧に研修します。</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center border border-slate-100">
          <div className="text-4xl mb-2">⏰</div>
          <h3 className="font-bold text-lg mb-2 text-slate-800">シフト相談OK</h3>
          <p className="text-sm text-slate-700">曜日・時間はできる限り調整します。</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center border border-slate-100">
          <div className="text-4xl mb-2">🤝</div>
          <h3 className="font-bold text-lg mb-2 text-slate-800">正社員・アルバイト</h3>
          <p className="text-sm text-slate-700">雇用形態はポジションにより異なります（要相談）。</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-12 p-4">
        <h3 className="text-xl font-black text-slate-800 text-center mb-2">募集職種（例）</h3>
        <p className="text-center text-sm text-slate-600 mb-6">
          随時更新します。詳細はLINEまたはお電話にてお問い合わせください。
        </p>
        <ul className="bg-white rounded-xl shadow border border-slate-100 divide-y divide-slate-100 text-sm text-slate-800 font-medium">
          <li className="p-4 flex items-start gap-3">
            <span className="text-lg shrink-0">🚗</span>
            <span>送迎・ドライバー（要普通免許・経験者優遇）</span>
          </li>
          <li className="p-4 flex items-start gap-3">
            <span className="text-lg shrink-0">📞</span>
            <span>受付・電話対応・スケジュール調整</span>
          </li>
          <li className="p-4 flex items-start gap-3">
            <span className="text-lg shrink-0">📋</span>
            <span>事務・データ入力・各種サポート業務</span>
          </li>
        </ul>
      </div>

      <div className="max-w-2xl mx-auto mt-10 p-4">
        <h3 className="text-xl font-black text-slate-800 text-center mb-6">募集要項（目安）</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-100">
          <table className="w-full text-sm text-left text-slate-700">
            <tbody className="divide-y divide-slate-100">
              <tr>
                <th className="bg-slate-50 p-4 font-bold text-slate-700 w-1/3">職種</th>
                <td className="p-4 font-medium">店舗運営スタッフ（上記いずれか）</td>
              </tr>
              <tr>
                <th className="bg-slate-50 p-4 font-bold text-slate-700">勤務地</th>
                <td className="p-4 font-medium">船橋エリア（詳細は応募時にご案内）</td>
              </tr>
              <tr>
                <th className="bg-slate-50 p-4 font-bold text-slate-700">資格</th>
                <td className="p-4 font-medium">
                  18歳以上
                  <br />
                  ※ドライバーは要普通自動車免許
                </td>
              </tr>
              <tr>
                <th className="bg-slate-50 p-4 font-bold text-slate-700">給与</th>
                <td className="p-4 font-medium">経験・ポジションにより応相談</td>
              </tr>
              <tr>
                <th className="bg-slate-50 p-4 font-bold text-slate-700">時間</th>
                <td className="p-4 font-medium">シフト制（詳細は面談時にご相談）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-10 text-center space-y-4">
        <a
          href="https://line.me/ti/p/Y_yyUiTXuW"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full sm:w-auto bg-indigo-600 text-white font-black px-8 py-3 rounded-full shadow-md"
        >
          LINEで応募する
        </a>
        <div>
          <Link href="/recruit" className="text-pink-600 font-bold underline text-sm">
            キャスト（派遣）求人はこちら
          </Link>
        </div>
        <div>
          <Link href="/chat" className="text-slate-600 font-bold underline text-sm">
            サイト内チャットで問い合わせる
          </Link>
        </div>
      </div>
    </div>
  )
}
