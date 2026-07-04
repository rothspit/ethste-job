/** CRM 公開 API（正本）。Phase 2: Supabase ではなく pull のみ。 */
export const CRM_API_BASE =
  (process.env.NEXT_PUBLIC_CRM_API_URL || 'https://crm.st-online.jp/api').replace(/\/$/, '')

export const IDOL_STORE_ID = parseInt(process.env.NEXT_PUBLIC_IDOL_STORE_ID || '2', 10)

export const IDOL_STORE_CODE = process.env.NEXT_PUBLIC_IDOL_STORE_CODE || 'idol_funabashi'

export function crmUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${CRM_API_BASE}${p}`
}

/** アイドル学園 wait_status → 表示バッジ */
export function idolWaitStatusBadge(
  waitStatus: number | undefined | null,
  attendEndTime: string | null | undefined,
  isToday: boolean,
): { show: boolean; label: string; className: string; dimCard: boolean } | null {
  if (!isToday || waitStatus == null || waitStatus === 0) {
    return null
  }

  if (waitStatus === 1) {
    return {
      show: true,
      label: '即ドル',
      className:
        'bg-gradient-to-r from-pink-500 to-rose-500 text-white animate-pulse shadow-md font-black',
      dimCard: false,
    }
  }

  if (waitStatus === 2) {
    const time =
      attendEndTime && attendEndTime !== '即ドル' && attendEndTime !== '即姫'
        ? `次回${attendEndTime}より`
        : '授業中'
    return {
      show: true,
      label: time,
      className: 'bg-slate-600/90 text-white font-bold',
      dimCard: false,
    }
  }

  if (waitStatus === 3) {
    return {
      show: true,
      label: '下校',
      className: 'bg-slate-400/90 text-white font-bold',
      dimCard: true,
    }
  }

  return null
}
