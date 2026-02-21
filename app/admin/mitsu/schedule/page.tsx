'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { getGirlImageUrl } from '@/lib/brand/image-utils'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// --- Types ---
interface Girl {
  id: string
  name: string
  images?: string[]
  is_active: boolean
  [key: string]: unknown
}

interface Area {
  id: string
  name: string
  sort_order: number
}

interface ScheduleRow {
  id: string
  girl_id: string
  date: string
  start_time: string | null
  end_time: string | null
  status: 'working' | 'off' | 'unset'
  comment: string | null
  area_id: string | null
  brand_id: string
}

interface EditForm {
  status: 'working' | 'off' | 'unset'
  start_time: string
  end_time: string
  comment: string
  area_id: string
}

// --- Helpers ---
function getMonday(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function dayLabel(d: Date): string {
  const days = ['日', '月', '火', '水', '木', '金', '土']
  return days[d.getDay()]
}

const TIME_OPTIONS: string[] = []
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }
}

const BRAND_ID = 'hitomitsu'

export default function MitsuSchedulePage() {
  const [girls, setGirls] = useState<Girl[]>([])
  const [schedules, setSchedules] = useState<ScheduleRow[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()))
  const [editingCell, setEditingCell] = useState<{ girlId: string; date: string } | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({
    status: 'unset',
    start_time: '10:00',
    end_time: '20:00',
    comment: '',
    area_id: '',
  })
  const [saving, setSaving] = useState(false)
  const [brandId, setBrandId] = useState<string | null>(null)

  // Resolve brand UUID from slug
  useEffect(() => {
    const resolve = async () => {
      const { data } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', BRAND_ID)
        .single()
      if (data) setBrandId(data.id)
    }
    resolve()
  }, [])

  // Week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const today = formatDate(new Date())

  // Fetch girls
  useEffect(() => {
    if (!brandId) return
    const fetch = async () => {
      const { data } = await supabase
        .from('girls')
        .select('*')
        .eq('brand_id', brandId)
        .eq('is_active', true)
        .order('created_at', { ascending: true })
      if (data) setGirls(data)
    }
    fetch()
  }, [brandId])

  // Fetch areas
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('areas')
        .select('*')
        .eq('brand_id', BRAND_ID)
        .order('sort_order', { ascending: true })
      if (data) setAreas(data)
    }
    fetch()
  }, [])

  // Fetch schedules for the week
  const fetchSchedules = useCallback(async () => {
    if (!brandId) return
    const startStr = formatDate(weekStart)
    const endStr = formatDate(addDays(weekStart, 6))
    const { data } = await supabase
      .from('schedules')
      .select('*')
      .eq('brand_id', brandId)
      .gte('date', startStr)
      .lte('date', endStr)
    if (data) setSchedules(data)
  }, [brandId, weekStart])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  // Navigation
  const goToday = () => setWeekStart(getMonday(new Date()))
  const goPrev = () => setWeekStart(addDays(weekStart, -7))
  const goNext = () => setWeekStart(addDays(weekStart, 7))

  // Get schedule for a specific girl+date
  const getSchedule = (girlId: string, date: string): ScheduleRow | undefined => {
    return schedules.find((s) => s.girl_id === girlId && s.date === date)
  }

  // Open cell editor
  const openEditor = (girlId: string, date: string) => {
    const existing = getSchedule(girlId, date)
    setEditForm({
      status: (existing?.status as EditForm['status']) || 'unset',
      start_time: existing?.start_time?.slice(0, 5) || '10:00',
      end_time: existing?.end_time?.slice(0, 5) || '20:00',
      comment: existing?.comment || '',
      area_id: existing?.area_id || '',
    })
    setEditingCell({ girlId, date })
  }

  // Save
  const handleSave = async () => {
    if (!editingCell || !brandId) return
    setSaving(true)
    try {
      const payload = {
        girl_id: editingCell.girlId,
        date: editingCell.date,
        brand_id: brandId,
        status: editForm.status,
        start_time: editForm.status === 'working' ? editForm.start_time : null,
        end_time: editForm.status === 'working' ? editForm.end_time : null,
        comment: editForm.comment || null,
        area_id: editForm.area_id || null,
      }
      await supabase.from('schedules').upsert(payload, { onConflict: 'girl_id,date' })
      await fetchSchedules()
      setEditingCell(null)
    } finally {
      setSaving(false)
    }
  }

  // Delete (reset to no record)
  const handleDelete = async () => {
    if (!editingCell) return
    const existing = getSchedule(editingCell.girlId, editingCell.date)
    if (existing) {
      await supabase.from('schedules').delete().eq('id', existing.id)
      await fetchSchedules()
    }
    setEditingCell(null)
  }

  // Area name lookup
  const areaName = (areaId: string | null): string | null => {
    if (!areaId) return null
    return areas.find((a) => a.id === areaId)?.name || null
  }

  // Week label
  const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}〜${addDays(weekStart, 6).getMonth() + 1}/${addDays(weekStart, 6).getDate()}`

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-slate-400 hover:text-white text-sm">
              &larr; /admin
            </Link>
            <h1 className="font-bold text-lg">
              <span className="hidden sm:inline">人妻の蜜 </span>スケジュール管理
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToday}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 rounded font-bold"
            >
              今日
            </button>
            <button
              onClick={goPrev}
              className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded"
            >
              &lt;
            </button>
            <span className="text-sm font-bold min-w-[120px] text-center">{weekLabel}</span>
            <button
              onClick={goNext}
              className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded"
            >
              &gt;
            </button>
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-2 py-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 bg-slate-800 w-[120px] min-w-[120px] p-2 text-left text-xs text-slate-400 border-b border-slate-700">
                  キャスト
                </th>
                {weekDates.map((d) => {
                  const dateStr = formatDate(d)
                  const isToday = dateStr === today
                  const isWeekend = d.getDay() === 0 || d.getDay() === 6
                  return (
                    <th
                      key={dateStr}
                      className={`min-w-[90px] p-2 text-center text-xs border-b border-slate-700 ${
                        isToday ? 'bg-slate-700/50' : 'bg-slate-800'
                      } ${isWeekend ? 'text-red-400' : 'text-slate-400'}`}
                    >
                      <div className={`font-bold ${isToday ? 'text-yellow-400' : ''}`}>
                        {dayLabel(d)} {d.getMonth() + 1}/{d.getDate()}
                      </div>
                      {isToday && <div className="text-[9px] text-yellow-400 mt-0.5">TODAY</div>}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {girls.map((girl) => {
                const imageUrl = getGirlImageUrl(girl)
                return (
                  <tr key={girl.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="sticky left-0 z-10 bg-slate-900 p-2 w-[120px] min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden flex-shrink-0">
                          {imageUrl ? (
                            <img src={imageUrl} alt={girl.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">?</div>
                          )}
                        </div>
                        <span className="text-xs font-bold truncate">{girl.name}</span>
                      </div>
                    </td>
                    {weekDates.map((d) => {
                      const dateStr = formatDate(d)
                      const isToday = dateStr === today
                      const sched = getSchedule(girl.id, dateStr)
                      const status = sched?.status || 'unset'

                      let cellBg = ''
                      let content = <span className="text-slate-600">—</span>
                      if (status === 'working') {
                        cellBg = 'bg-green-900/30'
                        const area = areaName(sched?.area_id || null)
                        content = (
                          <div className="text-[11px]">
                            <div className="text-green-400 font-bold">
                              {sched?.start_time?.slice(0, 5)}-{sched?.end_time?.slice(0, 5)}
                            </div>
                            {area && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-blue-900/40 text-blue-300 text-[9px] rounded">
                                {area}
                              </span>
                            )}
                            {sched?.comment && (
                              <div className="text-slate-400 text-[9px] mt-0.5 truncate max-w-[80px]">
                                {sched.comment}
                              </div>
                            )}
                          </div>
                        )
                      } else if (status === 'off') {
                        cellBg = 'bg-red-900/20'
                        content = <span className="text-red-400 text-xs font-bold">休</span>
                      }

                      return (
                        <td
                          key={dateStr}
                          onClick={() => openEditor(girl.id, dateStr)}
                          className={`p-1.5 text-center cursor-pointer transition-colors hover:bg-slate-700/50 border-x border-slate-800/50 ${cellBg} ${
                            isToday ? 'bg-slate-700/30' : ''
                          }`}
                        >
                          {content}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
              {girls.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-20 text-slate-500">
                    キャストが見つかりません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingCell && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setEditingCell(null) }}
        >
          <div className="bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            {/* Modal header */}
            <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">
                  {girls.find((g) => g.id === editingCell.girlId)?.name || '—'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{editingCell.date}</p>
              </div>
              <button
                onClick={() => setEditingCell(null)}
                className="text-slate-400 hover:text-white text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status buttons */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
                  ステータス
                </label>
                <div className="flex gap-2">
                  {([
                    { value: 'working', label: '出勤', color: 'bg-green-600 hover:bg-green-500' },
                    { value: 'off', label: '休み', color: 'bg-red-600 hover:bg-red-500' },
                    { value: 'unset', label: '未設定', color: 'bg-slate-600 hover:bg-slate-500' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setEditForm({ ...editForm, status: opt.value })}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition ${
                        editForm.status === opt.value
                          ? opt.color + ' text-white ring-2 ring-white/30'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time & area (only when working) */}
              {editForm.status === 'working' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                        開始時間
                      </label>
                      <select
                        value={editForm.start_time}
                        onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                        終了時間
                      </label>
                      <select
                        value={editForm.end_time}
                        onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                      エリア
                    </label>
                    <select
                      value={editForm.area_id}
                      onChange={(e) => setEditForm({ ...editForm, area_id: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">未選択</option>
                      {areas.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Comment */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                  コメント
                </label>
                <input
                  type="text"
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  placeholder="備考を入力..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2.5 text-xs text-red-400 bg-red-900/20 border border-red-800/50 rounded-lg hover:bg-red-900/40 transition"
                >
                  削除
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => setEditingCell(null)}
                  className="px-4 py-2.5 text-xs text-slate-400 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-500 transition disabled:opacity-50"
                >
                  {saving ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
