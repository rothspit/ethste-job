import { FeatureClosed } from '@/components/FeatureClosed'

export default function ChatPage() {
  return (
    <FeatureClosed
      title="チャット"
      message="チャットでのお問い合わせは停止しました。ご予約は学級委員長ページまたはお電話にてお願いします。"
      backHref="/student-council"
      backLabel="予約ページへ"
    />
  )
}
