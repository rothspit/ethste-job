'use client'

import { useMemo, useState } from 'react'
import {
  getMergedCourseRowsForCast,
  getNominationYenFromCast,
  IDOL_TRANSPORT_FEE_OPTIONS,
} from '@/lib/idol-pricing'

type NominationKind = 'none' | 'photo' | 'repeat'
type TransportChoice = 'taxi' | (typeof IDOL_TRANSPORT_FEE_OPTIONS)[number]

function formatYen(n: number) {
  return `¥${n.toLocaleString('ja-JP')}`
}

export default function GirlPricingSectionIdol({ girl }: { girl: Record<string, unknown> }) {
  const rows = useMemo(() => getMergedCourseRowsForCast(girl), [girl])
  const { photoYen, repeatYen } = useMemo(() => getNominationYenFromCast(girl), [girl])

  const [durationKey, setDurationKey] = useState<number | null>(null)
  const [nomination, setNomination] = useState<NominationKind>('none')
  const [transport, setTransport] = useState<TransportChoice>(3_000)

  const effectiveRows = useMemo(() => rows.filter((r) => r.durationMinutes <= 480), [rows])

  const selectedMinutes = durationKey ?? effectiveRows[0]?.durationMinutes ?? null
  const selectedCourse = effectiveRows.find((r) => r.durationMinutes === selectedMinutes) ?? null

  const nominationExtra = useMemo(() => {
    if (nomination === 'photo') return photoYen
    if (nomination === 'repeat') return repeatYen
    return 0
  }, [nomination, photoYen, repeatYen])

  const transportExtra = transport === 'taxi' ? 0 : transport
  const courseYen = selectedCourse?.priceYen ?? 0
  const totalApprox = courseYen + nominationExtra + transportExtra

  const nominationLabel =
    nomination === 'photo' ? '写真指名' : nomination === 'repeat' ? '本指名' : '指名なし'

  if (effectiveRows.length === 0) return null

  return (
    <div className="space-y-4">
      {/* 料金表 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 pb-0">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 border-l-4 border-pink-500 pl-3">
            <span className="text-pink-500">💰</span> 料金表
          </h2>
        </div>
        <div className="border-t border-pink-100 px-5 pb-5 pt-1">
          <div className="grid grid-cols-2 gap-x-4 gap-y-0">
            {effectiveRows.map((row) => (
              <div
                key={row.durationMinutes}
                className="flex justify-between items-center gap-2 py-3 border-b border-pink-50/90 hover:bg-pink-50/30 transition-colors"
              >
                <span className="font-bold text-slate-700 text-sm tabular-nums">{row.durationMinutes}分</span>
                <span className="font-black text-base text-pink-600 shrink-0 tabular-nums">
                  {formatYen(row.priceYen)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 概算計算 */}
      <div className="rounded-2xl border border-pink-200/80 bg-gradient-to-br from-pink-50/90 to-white p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-700 tracking-wide">
          コース + 指名料 + 交通費（概算）
        </h3>

        <div className="space-y-2.5">
          <label className="block">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
              コース
            </span>
            <select
              className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200/60"
              value={selectedMinutes ?? ''}
              onChange={(e) => setDurationKey(Number(e.target.value))}
            >
              {effectiveRows.map((row) => (
                <option key={row.durationMinutes} value={row.durationMinutes}>
                  {row.durationMinutes}分 — {formatYen(row.priceYen)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
              指名料
            </span>
            <select
              className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200/60"
              value={nomination}
              onChange={(e) => setNomination(e.target.value as NominationKind)}
            >
              <option value="none">指名なし（+¥0）</option>
              <option value="photo">写真指名（+{formatYen(photoYen)}）</option>
              <option value="repeat">本指名（+{formatYen(repeatYen)}）</option>
            </select>
          </label>

          <label className="block">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
              交通費（¥1,000〜¥5,000 の範囲から選択）
            </span>
            <select
              className="w-full rounded-xl border border-pink-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200/60"
              value={transport === 'taxi' ? 'taxi' : String(transport)}
              onChange={(e) => {
                const v = e.target.value
                setTransport(v === 'taxi' ? 'taxi' : (Number(v) as TransportChoice))
              }}
            >
              {IDOL_TRANSPORT_FEE_OPTIONS.map((yen) => (
                <option key={yen} value={yen}>
                  交通費 {formatYen(yen)}
                </option>
              ))}
              <option value="taxi">タクシー代（実費）</option>
            </select>
          </label>
        </div>

        <div className="rounded-xl border border-pink-300/70 bg-white/90 px-4 py-3 mt-1 space-y-2">
          <div className="space-y-1.5 text-[11px] border-b border-pink-100/80 pb-2">
            <div className="flex justify-between gap-2 tabular-nums">
              <span className="text-slate-500">コース</span>
              <span className="font-semibold text-slate-800">{formatYen(courseYen)}</span>
            </div>
            <div className="flex justify-between gap-2 tabular-nums">
              <span className="text-slate-500">指名料（{nominationLabel}）</span>
              <span className="font-semibold text-slate-800">{formatYen(nominationExtra)}</span>
            </div>
            <div className="flex justify-between gap-2 tabular-nums">
              <span className="text-slate-500">交通費</span>
              <span className="font-semibold text-slate-800">
                {transport === 'taxi' ? '¥0（実費別）' : formatYen(transportExtra)}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 pt-0.5">
            <span className="text-[11px] font-bold text-slate-600">合計（概算）</span>
            <span className="text-xl font-black text-pink-600 tabular-nums">
              {formatYen(totalApprox)}
            </span>
          </div>
          {transport === 'taxi' && (
            <p className="text-[10px] text-slate-500 leading-relaxed">
              ※ 合計にはタクシー代を含みません（+ タクシー代・実費）
            </p>
          )}
          {transport !== 'taxi' && (
            <p className="text-[10px] text-slate-400">
              ※ 交通費はエリアにより異なります。¥1,000〜¥5,000 のいずれかで目安を表示しています。
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
