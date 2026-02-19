'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { getGirlImageUrls } from '@/lib/brand/image-utils'
import type { Girl } from '@/lib/brand/brand-queries'
import type { Brand } from '@/lib/brand/brand-context'

const serif = "var(--font-noto-serif), 'Noto Serif JP', serif"

// ============================================
// 画像スライダー
// ============================================

function ImageSlider({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef(0)

  const goTo = useCallback((idx: number) => {
    setCurrent(Math.max(0, Math.min(idx, images.length - 1)))
  }, [images.length])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current
    }
  }, [])

  const onTouchEnd = useCallback(() => {
    if (Math.abs(touchDeltaX.current) > 40) {
      goTo(current + (touchDeltaX.current < 0 ? 1 : -1))
    }
    touchStartX.current = null
    touchDeltaX.current = 0
  }, [current, goTo])

  const single = images.length <= 1

  return (
    <div className="relative">
      <div
        className="aspect-[3/4] bg-[#f5f5f4] overflow-hidden relative"
        onTouchStart={single ? undefined : onTouchStart}
        onTouchMove={single ? undefined : onTouchMove}
        onTouchEnd={single ? undefined : onTouchEnd}
      >
        {images.length > 0 ? (
          <img
            src={images[current]}
            alt={`${name} ${current + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl opacity-10">&#128100;</span>
          </div>
        )}

        {/* 左右タップエリア */}
        {!single && (
          <>
            <button
              type="button"
              aria-label="前の画像"
              className="absolute inset-y-0 left-0 w-1/3 z-10"
              onClick={() => goTo(current - 1)}
            />
            <button
              type="button"
              aria-label="次の画像"
              className="absolute inset-y-0 right-0 w-1/3 z-10"
              onClick={() => goTo(current + 1)}
            />
          </>
        )}
      </div>

      {/* ドットインジケーター */}
      {!single && (
        <div className="flex justify-center gap-1.5 py-3">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`画像 ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? 'bg-[#b8860b]' : 'bg-[#d6d3d1]'
              }`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// 詳細ページ本体
// ============================================

export default function MitsuGirlDetail({
  girl,
  brand,
}: {
  girl: Girl | null
  brand: Brand
}) {
  if (!girl) {
    return (
      <main className="min-h-screen bg-white text-[#1c1917] flex flex-col items-center justify-center p-4">
        <p className="text-[#78716c] text-base mb-6">キャストが見つかりません</p>
        <Link
          href="/mitsu/girls"
          className="border border-[#b8860b]/30 text-[#b8860b] text-xs px-6 py-2.5 tracking-wider hover:bg-[#b8860b]/5 transition"
        >
          一覧に戻る
        </Link>
      </main>
    )
  }

  const imageUrls = getGirlImageUrls(girl)
  const extra = girl as any

  return (
    <main className="min-h-screen bg-white text-[#1c1917] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#b8860b]/30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/mitsu/girls" className="text-[#78716c] text-xs tracking-wider hover:text-[#b8860b] transition">
            ← 一覧
          </Link>
          <h1 className="text-base text-[#1c1917] tracking-[0.2em] font-medium" style={{ fontFamily: serif }}>
            {girl.name}
          </h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        {/* Photo Slider */}
        <ImageSlider images={imageUrls} name={girl.name} />

        {/* Profile */}
        <div className="px-5 py-10">
          <h2
            className="text-2xl font-medium tracking-[0.2em] text-[#1c1917] mb-1"
            style={{ fontFamily: serif }}
          >
            {girl.name}
          </h2>
          {girl.catchphrase && (
            <p className="text-[#b8860b] text-sm mt-2 tracking-wider">{girl.catchphrase}</p>
          )}

          <div className="w-10 h-px bg-[#b8860b] my-8" />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {girl.age && (
              <div className="bg-[#fafaf9] rounded-lg p-4">
                <p className="text-[10px] text-[#a8a29e] mb-1 tracking-wider">年齢</p>
                <p className="font-medium" style={{ fontFamily: serif }}>{girl.age}歳</p>
              </div>
            )}
            {extra.height && (
              <div className="bg-[#fafaf9] rounded-lg p-4">
                <p className="text-[10px] text-[#a8a29e] mb-1 tracking-wider">身長</p>
                <p className="font-medium" style={{ fontFamily: serif }}>{extra.height}cm</p>
              </div>
            )}
            {(extra.bust || extra.waist || extra.hip) && (
              <div className="bg-[#fafaf9] rounded-lg p-4 col-span-2">
                <p className="text-[10px] text-[#a8a29e] mb-1 tracking-wider">スリーサイズ</p>
                <p className="font-medium" style={{ fontFamily: serif }}>
                  B{extra.bust || '?'} / W{extra.waist || '?'} / H{extra.hip || '?'}
                </p>
              </div>
            )}
          </div>

          {/* Bio */}
          {extra.bio && (
            <>
              <div className="w-10 h-px bg-[#b8860b]/30 my-8" />
              <h3
                className="text-xs tracking-[0.2em] text-[#78716c] mb-4"
                style={{ fontFamily: serif }}
              >
                自己紹介
              </h3>
              <p className="text-sm text-[#44403c] leading-loose whitespace-pre-line">
                {extra.bio}
              </p>
            </>
          )}

          {/* Manager Comment */}
          {extra.manager_comment && (
            <>
              <div className="w-10 h-px bg-[#b8860b]/30 my-8" />
              <h3
                className="text-xs tracking-[0.2em] text-[#78716c] mb-4"
                style={{ fontFamily: serif }}
              >
                店長コメント
              </h3>
              <div className="bg-[#fafaf9] rounded-lg p-5">
                <p className="text-sm text-[#44403c] leading-loose whitespace-pre-line">
                  {extra.manager_comment}
                </p>
              </div>
            </>
          )}

          {/* Phone CTA */}
          {brand.phone && (
            <>
              <div className="w-10 h-px bg-[#b8860b]/30 my-8" />
              <a
                href={`tel:${brand.phone}`}
                className="block text-center border border-[#b8860b]/40 text-[#b8860b] py-4 tracking-[0.2em] font-medium hover:bg-[#b8860b]/5 transition"
                style={{ fontFamily: serif }}
              >
                &#9742; {girl.name}を予約する
              </a>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
