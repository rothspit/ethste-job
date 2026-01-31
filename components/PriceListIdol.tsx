export default function PriceListIdol() {
  return (
    <div className="max-w-4xl mx-auto p-4 my-8">
      <h3 className="text-2xl font-black text-center text-slate-800 mb-6">
        <span className="text-pink-500">💰</span> 料金システム
      </h3>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-pink-100">
        <div className="bg-pink-500 text-white p-3 text-center font-bold">
          基本コース（税込・指名料込）
        </div>
        <div className="divide-y divide-slate-100">
          <div className="flex justify-between p-4 hover:bg-pink-50 transition-colors">
            <span className="font-bold text-slate-700">60分</span>
            <span className="font-black text-xl text-pink-600">12,000円</span>
          </div>
          <div className="flex justify-between p-4 hover:bg-pink-50 transition-colors">
            <span className="font-bold text-slate-700">90分</span>
            <span className="font-black text-xl text-pink-600">17,000円</span>
          </div>
          <div className="flex justify-between p-4 hover:bg-pink-50 transition-colors bg-yellow-50">
            <span className="font-bold text-slate-700">120分 (人気No.1)</span>
            <span className="font-black text-xl text-pink-600">23,000円</span>
          </div>
          <div className="flex justify-between p-4 hover:bg-pink-50 transition-colors">
            <span className="font-bold text-slate-700">延長 30分</span>
            <span className="font-black text-xl text-slate-600">6,000円</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-400 text-center mt-2">※交通費は地域により別途1,000円〜掛かります。</p>
    </div>
  )
}
