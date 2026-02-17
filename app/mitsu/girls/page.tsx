import Link from 'next/link'
import type { Metadata } from 'next'
import { getBrand } from '@/lib/brand/get-brand'
import { getGirlsByBrand } from '@/lib/brand/brand-queries'
import type { Girl } from '@/lib/brand/brand-queries'

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand()
  return {
    title: `在籍キャスト｜${brand.name}`,
    description: `${brand.name}の在籍キャスト一覧。${brand.area || ''}`,
  }
}

function GirlCard({ girl }: { girl: Girl }) {
  const imageUrl = girl.profile_image_url ?? (girl as any)?.image1_url ?? null

  return (
    <Link
      href={`/mitsu/girls/${girl.id}`}
      className="bg-[#1a1225] rounded-lg overflow-hidden border border-[#d4a017]/10 hover:border-[#d4a017]/30 transition group"
    >
      <div className="aspect-[3/4] bg-[#2d1b4e] flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={girl.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-5xl opacity-20">👤</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-bold text-[#f5f3ff]">{girl.name}</p>
        {girl.age && <p className="text-[10px] text-[#a1a1aa] mt-0.5">{girl.age}歳</p>}
        {girl.catchphrase && (
          <p className="text-[10px] text-[#a1a1aa]/70 mt-1 truncate">{girl.catchphrase}</p>
        )}
      </div>
    </Link>
  )
}

export default async function MitsuGirlsPage() {
  const [brand, girls] = await Promise.all([
    getBrand(),
    getGirlsByBrand(),
  ])

  return (
    <main className="min-h-screen bg-[#0f0a1a] text-[#f5f3ff] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0a1a]/95 backdrop-blur border-b border-[#d4a017]/20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/mitsu" className="text-[#a1a1aa] text-sm hover:text-[#f5f3ff] transition">
            ← 戻る
          </Link>
          <h1
            className="text-lg font-bold tracking-[0.1em]"
            style={{ fontFamily: "var(--font-noto-serif), 'Noto Serif JP', serif" }}
          >
            在籍キャスト
          </h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-center text-[#a1a1aa]/50 text-xs tracking-wider mb-8">
          {brand.name}｜{brand.area || ''}
        </p>

        {girls.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {girls.map((g) => (
              <GirlCard key={g.id} girl={g} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#a1a1aa]/40 text-sm">準備中</p>
          </div>
        )}
      </div>
    </main>
  )
}
