import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'アイドル学園 | 船橋の制服コンセプト・デリヘル',
  description: '船橋駅徒歩5分。現役女子大生・若手中心の制服専門デリヘル「アイドル学園」の公式サイトです。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {/* フッター：支払い方法バッジ */}
        <footer className="bg-slate-900 text-white py-8 mt-20">
          <div className="container mx-auto px-4 text-center">

            {/* 支払い方法バッジ */}
            <div className="mb-6">
              <p className="text-xs text-slate-400 mb-2 font-bold">お支払い方法</p>
              <div className="flex items-center justify-center gap-3">
                {/* クレジットカード */}
                <div className="bg-white text-slate-900 px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                  💳 Credit Card
                </div>
                {/* PayPay */}
                <div className="bg-[#FF0033] text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <span className="bg-white text-[#FF0033] px-1 rounded-sm text-[10px] mr-1">P</span>
                  PayPay
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                ※PayPayは一部対応していない場合もございます。スタッフまでお問い合わせください。
              </p>
            </div>

            <p className="text-xs text-slate-600">
              &copy; 2026 IDOL GAKUEN. All rights reserved.
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}
