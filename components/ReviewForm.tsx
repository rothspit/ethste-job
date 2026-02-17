'use client'

import { useState, useRef } from 'react'
import { postReview } from '@/app/actions'

export default function ReviewForm({ girlId }: { girlId: string }) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const result = await postReview(formData)

    if (result.error) {
      setMessage(result.error)
    } else {
      setMessage('投稿ありがとうございます！')
      formRef.current?.reset()
      setRating(5)
    }
    setIsSubmitting(false)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        ✏️ 口コミを投稿する
      </h3>

      <input type="hidden" name="girl_id" value={girlId} />
      <input type="hidden" name="rating" value={rating} />

      <div className="space-y-4">
        {/* ニックネーム */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">お名前 (ニックネーム)</label>
          <input
            name="nickname"
            placeholder="名無し様"
            className="w-full border border-gray-300 rounded p-2 text-sm text-slate-900"
          />
        </div>

        {/* タイトル */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">タイトル</label>
          <input
            name="title"
            required
            placeholder="例: 最高でした！"
            className="w-full border border-gray-300 rounded p-2 text-sm font-bold text-slate-900"
          />
        </div>

        {/* 星評価 */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">評価</label>
          <div className="flex gap-1 cursor-pointer w-max" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-2xl transition-colors ${
                  star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">{rating}点</p>
        </div>

        {/* 本文 */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">口コミ内容</label>
          <textarea
            name="content"
            required
            placeholder="女の子の良かったところを教えてください！"
            className="w-full border border-gray-300 rounded p-2 h-24 text-sm text-slate-900"
          />
        </div>

        {message && (
          <p className={`text-sm font-bold ${message.includes('ありがとう') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-500 shadow transition disabled:opacity-50"
        >
          {isSubmitting ? '投稿中...' : '投稿する'}
        </button>
      </div>
    </form>
  )
}
