export default function UpdateNotice() {
  return (
    <div className="bg-yellow-400 border-b-2 border-slate-900 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-center gap-2">
        <span className="text-xl animate-bounce">📣</span>
        <p className="text-slate-900 text-xs md:text-sm font-black text-center leading-tight">
          サイト・リニューアル進行中！
          <span className="hidden md:inline"> － </span>
          <br className="md:hidden"/>
          <span className="text-slate-800 font-bold">「口コミ機能」や「詳細検索」など、新機能がどんどん追加されます✨</span>
        </p>
      </div>
    </div>
  )
}
