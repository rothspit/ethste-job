'use server'

import { revalidatePath } from 'next/cache'

/** 写メ日記編集 — Supabase 廃止。CRM で管理。 */
export async function updateDiary(_id: string, _formData: FormData) {
  return { error: '写メ日記は CRM で管理しています' }
}

/** 口コミ投稿 — 将来 CRM API 化予定。現状は受付停止。 */
export async function postReview(_formData: FormData) {
  return { error: '口コミ投稿は現在準備中です。お電話にてお問い合わせください。' }
}

export async function revalidateGirlPage(girlId: string) {
  revalidatePath(`/girls/${girlId}`)
}
