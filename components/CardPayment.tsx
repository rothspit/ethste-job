import Link from 'next/link'

export default function CardPayment() {
  return (
    <div className="max-w-4xl mx-auto px-4 my-8">
      {/* 枠組み */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden">

        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-center">
          <h3 className="text-xl font-black text-white flex items-center justify-center gap-2">
            💳 クレジットカード決済
          </h3>
        </div>

        {/* 注意書きエリア */}
        <div className="p-6 text-center space-y-4">

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 inline-block w-full">
            <p className="text-red-600 font-bold text-sm md:text-base animate-pulse">
              ※ 手数料として10％がかかります
            </p>
          </div>

          <div className="text-sm text-slate-700 space-y-2 font-bold leading-relaxed">
            <p>決済金額を <a href="tel:05017459665" className="text-blue-600 underline">お電話 (050-1745-9665)</a> にてご確認ください。</p>
            <p>※ 承認が取れてからのご案内となります。</p>
            <p className="text-slate-900 border-b-2 border-yellow-400 inline-block pb-1">
              ご案内前に必ずお手続きをお願い致します。
            </p>
          </div>

          {/* 決済ボタン（いただいたリンク） */}
          <div className="pt-2">
            <a
              href="https://payment.alij.ne.jp/service/vcat/auth?loginId=21931803&loginPass=lneu7045"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full md:w-2/3 mx-auto bg-gradient-to-r from-blue-600 to-slate-400 text-white font-black text-lg py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              カード決済画面へ進む ➡
            </a>
            <p className="text-[10px] text-slate-400 mt-2">
              外部の安全な決済ページへ移動します
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
