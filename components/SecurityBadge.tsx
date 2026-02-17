import React from 'react'

export const SecurityBadge = () => {
  return (
    <div className="mt-6 w-full max-w-md mx-auto">
      {/* 外枠：信頼感のあるグレーと、安心感の緑をアクセントに */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-4 shadow-sm">

        {/* アイコン部分 (盾と鍵) */}
        <div className="bg-white p-2 rounded-full border border-slate-100 shadow-sm shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-emerald-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        </div>

        {/* テキスト部分 */}
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            Security by AWS Cloud
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Verified</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            お客様の個人情報は、Amazon Web Services(AWS)の高度な暗号化技術により保護されています。キャストには直接送信されず、匿名性が保たれます。
          </p>
        </div>
      </div>

      {/* 下の小さな補足 (さらにプロっぽく見せる) */}
      <div className="flex justify-end gap-3 mt-2 px-2">
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          SSL Encrypted
        </span>
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Privacy Protected
        </span>
      </div>
    </div>
  )
}
