import Link from 'next/link'

type Props = {
  title?: string
  message?: string
  backHref?: string
  backLabel?: string
}

export function FeatureClosed({
  title = '準備中',
  message = 'この機能は現在ご利用いただけません。',
  backHref = '/funabashi',
  backLabel = 'トップへ戻る',
}: Props) {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <p className="text-4xl">🔧</p>
        <h1 className="text-xl font-black text-slate-800">{title}</h1>
        <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
        <Link
          href={backHref}
          className="inline-block mt-4 bg-pink-500 text-white font-bold px-6 py-3 rounded-full"
        >
          {backLabel}
        </Link>
      </div>
    </main>
  )
}
