import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | アイドル学園 船橋・秋葉原',
    default: 'アイドル学園 船橋・秋葉原 | 制服・コスプレ専門デリヘル',
  },
  description: '船橋・秋葉原エリアのデリヘル「アイドル学園」。現役女子大生やかわいい制服コスプレで放課後デート気分！最短30分で到着。',
  keywords: ['デリヘル', '船橋', '秋葉原', '制服', 'コスプレ', '女子大生', '派遣'],
  openGraph: {
    title: 'アイドル学園 船橋・秋葉原 | 制服・コスプレ専門デリヘル',
    description: '船橋・秋葉原で一番かわいい制服デリヘル！',
    images: [{ url: '/idol_top.jpg', width: 1200, height: 630 }],
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/idol_top.jpg'],
  },
  alternates: {
    canonical: 'https://idolgakuen.jp',
  },
}

export default function FunabashiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
