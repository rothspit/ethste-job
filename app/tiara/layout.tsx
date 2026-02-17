import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'THE TIARA (ザ・ティアラ) | 秋葉原の完全個室・最高級メンズエステ',
  description: '秋葉原エリア最高峰の癒やしを。THE TIARAは、厳選された美女セラピストによる極上のアロマオイルマッサージを提供する完全個室メンズエステです。電気街の喧騒を忘れるプラチナ空間で、至福のひとときをお過ごしください。',
  keywords: ['秋葉原', 'メンズエステ', '高級', 'アロマ', '個室', 'THE TIARA', 'アキバ', '神田', 'メンエス'],
  icons: {
    icon: '/tiara-logo.png',
    apple: '/tiara-logo.png',
  },
  openGraph: {
    title: 'THE TIARA | 秋葉原の最高級メンズエステ',
    description: '日常を忘れる、プラチナ級の癒やし体験。',
    url: 'https://the-tiara.jp',
    siteName: 'THE TIARA',
    images: [
      {
        url: 'https://the-tiara.jp/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function TiaraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
