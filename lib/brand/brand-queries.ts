import { supabase } from '@/lib/supabase'
import { getBrand } from './get-brand'

// ============================================
// 型定義
// ============================================

export interface Girl {
  id: string
  brand_id: string
  name: string
  age?: number
  status?: string
  profile_image_url?: string
  catchphrase?: string
  is_active: boolean
  sort_order?: number
  created_at: string
  updated_at: string
  [key: string]: unknown
}

export interface Schedule {
  id: string
  girl_id: string
  brand_id: string
  work_date: string
  start_time: string
  end_time: string
  status?: string
  girl?: Girl
  [key: string]: unknown
}

export interface Diary {
  id: string
  brand_id: string
  girl_id?: string
  slug: string
  title: string
  content: string
  category?: string
  thumbnail_url?: string
  is_published: boolean
  published_at?: string
  created_at: string
  updated_at: string
  girl?: Girl
  [key: string]: unknown
}

// ============================================
// Girls
// ============================================

export async function getGirlsByBrand(opts?: {
  limit?: number
  status?: string
  forceSlug?: string
}): Promise<Girl[]> {
  const brand = await getBrand(opts?.forceSlug)
  let query = supabase
    .from('girls')
    .select('*')
    .eq('brand_id', brand.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (opts?.status) {
    query = query.eq('status', opts.status)
  }
  if (opts?.limit) {
    query = query.limit(opts.limit)
  }

  const { data, error } = await query
  if (error) {
    console.error('[getGirlsByBrand]', error.message)
    return []
  }
  return (data ?? []) as Girl[]
}

export async function getGirlById(id: string, forceSlug?: string): Promise<Girl | null> {
  const brand = await getBrand(forceSlug)
  const { data, error } = await supabase
    .from('girls')
    .select('*')
    .eq('id', id)
    .eq('brand_id', brand.id)
    .single()

  if (error) {
    console.error('[getGirlById]', error.message)
    return null
  }
  return (data ?? null) as Girl | null
}

// ============================================
// Schedules
// ============================================

export async function getTodaySchedule(forceSlug?: string): Promise<Schedule[]> {
  const brand = await getBrand(forceSlug)
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  const { data, error } = await supabase
    .from('schedules')
    .select('*, girl:girls(*)')
    .eq('brand_id', brand.id)
    .eq('work_date', today)
    .order('start_time', { ascending: true })

  if (error) {
    console.error('[getTodaySchedule]', error.message)
    return []
  }
  return (data ?? []) as Schedule[]
}

// ============================================
// Diaries
// ============================================

export async function getDiariesByBrand(opts?: {
  limit?: number
  category?: string
  forceSlug?: string
}): Promise<Diary[]> {
  const brand = await getBrand(opts?.forceSlug)
  let query = supabase
    .from('diaries')
    .select('*, girl:girls(id, name, profile_image_url)')
    .eq('brand_id', brand.id)
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (opts?.category) {
    query = query.eq('category', opts.category)
  }
  if (opts?.limit) {
    query = query.limit(opts.limit)
  }

  const { data, error } = await query
  if (error) {
    console.error('[getDiariesByBrand]', error.message)
    return []
  }
  return (data ?? []) as Diary[]
}

export async function getDiaryBySlug(slug: string, forceSlug?: string): Promise<Diary | null> {
  const brand = await getBrand(forceSlug)
  const { data, error } = await supabase
    .from('diaries')
    .select('*, girl:girls(id, name, profile_image_url)')
    .eq('slug', slug)
    .eq('brand_id', brand.id)
    .eq('is_published', true)
    .single()

  if (error) {
    console.error('[getDiaryBySlug]', error.message)
    return null
  }
  return (data ?? null) as Diary | null
}
