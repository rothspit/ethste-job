/**
 * アイドル学園キャスト詳細の料金表・概算用。
 * CRM の public_profile.pricing.courses を優先し、不足分は店舗カタログで補完する。
 */

export type IdolCourseRow = {
  durationMinutes: number
  priceYen: number
  /** 表示用（任意） */
  label?: string
}

/** PriceListIdol / 店舗標準に基づくフォールバックカタログ（税込・円） */
export const IDOL_CATALOG_COURSES: IdolCourseRow[] = [
  { durationMinutes: 60, priceYen: 18_000 },
  { durationMinutes: 80, priceYen: 22_000 },
  { durationMinutes: 100, priceYen: 26_000 },
  { durationMinutes: 120, priceYen: 34_000 },
  { durationMinutes: 150, priceYen: 42_000 },
  { durationMinutes: 180, priceYen: 50_000 },
  // ロング帯（標準表に無い分数は延長イメージで補完）
  { durationMinutes: 210, priceYen: 58_000 },
  { durationMinutes: 240, priceYen: 66_000 },
  { durationMinutes: 270, priceYen: 74_000 },
  { durationMinutes: 300, priceYen: 82_000 },
  { durationMinutes: 330, priceYen: 90_000 },
  { durationMinutes: 360, priceYen: 98_000 },
  { durationMinutes: 390, priceYen: 106_000 },
  { durationMinutes: 420, priceYen: 114_000 },
  { durationMinutes: 450, priceYen: 122_000 },
  { durationMinutes: 480, priceYen: 130_000 },
]

const MAX_DURATION_MINUTES = 480

function num(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim()) {
    const n = parseInt(v.replace(/[^0-9]/g, ''), 10)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function parseCourseEntry(raw: Record<string, unknown>): IdolCourseRow | null {
  const durationMinutes =
    num(raw.duration_minutes) ??
    num(raw.durationMinutes) ??
    num(raw.minutes) ??
    num(raw.duration)
  const priceYen =
    num(raw.price_yen) ??
    num(raw.priceYen) ??
    num(raw.price) ??
    num(raw.amount)
  if (durationMinutes == null || durationMinutes <= 0 || priceYen == null || priceYen < 0) return null
  const label = typeof raw.label === 'string' ? raw.label : typeof raw.name === 'string' ? raw.name : undefined
  return { durationMinutes, priceYen, label }
}

export function parsePublicProfileRecord(girl: Record<string, unknown>): Record<string, unknown> | null {
  const raw = girl.public_profile ?? girl.publicProfile
  if (raw == null) return null
  if (typeof raw === 'string') {
    try {
      const o = JSON.parse(raw) as unknown
      return typeof o === 'object' && o !== null ? (o as Record<string, unknown>) : null
    } catch {
      return null
    }
  }
  if (typeof raw === 'object') return raw as Record<string, unknown>
  return null
}

/** CRM のプロフィールからコース配列だけ抽出 */
export function coursesFromPublicProfile(pp: Record<string, unknown>): IdolCourseRow[] {
  const pricing = pp.pricing as Record<string, unknown> | undefined
  const rawList =
    (pricing?.courses as unknown) ??
    (pricing?.course_list as unknown) ??
    (pp.courses as unknown)
  if (!Array.isArray(rawList)) return []
  const out: IdolCourseRow[] = []
  for (const item of rawList) {
    if (item && typeof item === 'object') {
      const row = parseCourseEntry(item as Record<string, unknown>)
      if (row) out.push(row)
    }
  }
  return out
}

/**
 * プロフィール優先でマージ。同一 duration はプロフィールがカタログを上書き。
 * 最大 MAX_DURATION_MINUTES 分まで。
 */
export function mergeIdolCourses(profileCourses: IdolCourseRow[], catalog: IdolCourseRow[]): IdolCourseRow[] {
  const map = new Map<number, IdolCourseRow>()
  for (const c of catalog) {
    if (c.durationMinutes <= MAX_DURATION_MINUTES) {
      map.set(c.durationMinutes, { ...c })
    }
  }
  for (const c of profileCourses) {
    if (c.durationMinutes <= MAX_DURATION_MINUTES) {
      map.set(c.durationMinutes, { ...c })
    }
  }
  return [...map.values()].sort((a, b) => a.durationMinutes - b.durationMinutes)
}

export function getMergedCourseRowsForCast(girl: Record<string, unknown>): IdolCourseRow[] {
  const pp = parsePublicProfileRecord(girl)
  const profile = pp ? coursesFromPublicProfile(pp) : []
  return mergeIdolCourses(profile, IDOL_CATALOG_COURSES)
}

/** PriceListIdol に合わせたデフォルト。CRM に値があれば上書き */
export function getNominationYenFromCast(girl: Record<string, unknown>): {
  photoYen: number
  repeatYen: number
} {
  const pp = parsePublicProfileRecord(girl)
  const pricing = pp?.pricing as Record<string, unknown> | undefined
  const nom = pricing?.nomination as Record<string, unknown> | undefined

  const photo =
    num(pricing?.nomination_shimei_yen) ??
    num(pricing?.nominationShimeiYen) ??
    num(nom?.photo_yen) ??
    num(nom?.shimei_photo_yen) ??
    num(girl.nomination_shimei_yen) ??
    num(girl.nominationShimeiYen)

  const repeat =
    num(pricing?.hon_shimei_yen) ??
    num(pricing?.honShimeiYen) ??
    num(nom?.repeat_yen) ??
    num(nom?.hon_yen) ??
    num(girl.hon_shimei_yen) ??
    num(girl.honShimeiYen)

  return {
    photoYen: photo ?? 2_000,
    repeatYen: repeat ?? 3_000,
  }
}

/** 交通費レンジ（概算）… UI で個別に選択 */
export const IDOL_TRANSPORT_FEE_OPTIONS = [1_000, 2_000, 3_000, 4_000, 5_000] as const
