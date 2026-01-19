// app/page.tsx
// メンズエステ求人サイト「エステジョブ」トップページ
// Supabase接続 + 地図表示機能

import { createClient } from '@/lib/supabase/server';
import { 
  Search, 
  MapPin, 
  Wallet, 
  Sparkles, 
  Heart, 
  Shield, 
  Clock, 
  Car, 
  Gift, 
  MessageCircle,
  ChevronRight,
  Star,
  BadgeCheck,
  TrendingUp,
} from 'lucide-react';
import ViewToggle from '@/components/ViewToggle';

// 型定義（lat, lng追加）
export type Recruitment = {
  id: string;
  shop_name: string;
  area: string;
  hourly_wage_min: number | null;
  hourly_wage_max: number | null;
  daily_guarantee: number | null;
  bonus: number | null;
  tags: string[] | null;
  image_url: string | null;
  is_featured: boolean;
  description: string | null;
  main_concept: string | null;
  lat: number | null;
  lng: number | null;
};

type Area = {
  id: string;
  name: string;
  slug: string;
};

// エリアデータ（フォールバック用）
const defaultAreas = [
  '全エリア', '新宿', '渋谷', '池袋', '銀座', '六本木', '恵比寿', '品川', '上野', '横浜'
];

// こだわり条件
const preferences = [
  { id: 'inexperienced', label: '未経験歓迎', icon: Heart },
  { id: 'daily_pay', label: '日払いOK', icon: Wallet },
  { id: 'pickup', label: '送迎あり', icon: Car },
  { id: 'bonus', label: '入店祝い金', icon: Gift },
];

// メインページ（Server Component）
export default async function HomePage() {
  // Supabaseクライアント作成
  const supabase = await createClient();

  // 求人データを取得（lat, lng含む）
  const { data: recruitments, error: recruitmentsError } = await supabase
    .from('recruitments')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(12);

  // エリアデータを取得
  const { data: areas } = await supabase
    .from('areas')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('sort_order');

  // エリア名のリスト作成
  const areaNames = areas 
    ? ['全エリア', ...areas.map((a: Area) => a.name)]
    : defaultAreas;

  // エラーハンドリング
  if (recruitmentsError) {
    console.error('Error fetching recruitments:', recruitmentsError);
  }

  const displayRecruitments: Recruitment[] = recruitments || [];

  // 地図表示用: lat/lngがある店舗のみ抽出
  const shopsWithLocation = displayRecruitments
    .filter((r): r is Recruitment & { lat: number; lng: number } => 
      r.lat !== null && r.lng !== null
    )
    .map(r => ({
      id: r.id,
      name: r.shop_name,
      lat: r.lat,
      lng: r.lng,
      area: r.area,
      hourly_wage_min: r.hourly_wage_min,
      hourly_wage_max: r.hourly_wage_max,
      main_concept: r.main_concept,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-800 text-lg leading-tight">エステジョブ</div>
              <div className="text-[10px] text-pink-400 font-medium">メンエス専門求人</div>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="/recruitments" className="text-gray-600 hover:text-pink-500 transition-colors">求人一覧</a>
            <a href="/areas" className="text-gray-600 hover:text-pink-500 transition-colors">エリアから探す</a>
            <a href="/guide" className="text-gray-600 hover:text-pink-500 transition-colors">お役立ち情報</a>
          </nav>
          <a 
            href="/register"
            className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm"
          >
            会員登録
          </a>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-pink-50 to-white" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-rose-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-pink-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <BadgeCheck className="w-4 h-4 text-pink-500" />
              <span className="text-sm text-gray-600">厳選された優良店のみ掲載</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
              未経験から
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">
                月収100万円
              </span>
              。
              <br />
              あなたらしく輝く場所。
            </h1>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              エステの技術を身につけながら、<br className="hidden md:block" />
              自分らしいペースで高収入を実現。<br className="hidden md:block" />
              丁寧な研修と安心のサポート体制で、はじめての方も安心です。
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-pink-100">
                <Shield className="w-5 h-5 text-pink-400" />
                <span className="text-sm text-gray-600">安心の身バレ対策</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-pink-100">
                <Clock className="w-5 h-5 text-pink-400" />
                <span className="text-sm text-gray-600">週1〜自由出勤</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-pink-100">
                <Heart className="w-5 h-5 text-pink-400" />
                <span className="text-sm text-gray-600">ノンアダルト</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 検索ボックス */}
      <section className="relative -mt-8 z-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-pink-100 p-6">
          <form action="/recruitments" method="GET">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">エリア</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                  <select 
                    name="area"
                    className="w-full pl-10 pr-4 py-3 bg-pink-50 border-0 rounded-xl text-gray-700 focus:ring-2 focus:ring-pink-300 appearance-none cursor-pointer"
                  >
                    {areaNames.map((area) => (
                      <option key={area} value={area === '全エリア' ? '' : area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">最低時給</label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                  <select 
                    name="min_wage"
                    className="w-full pl-10 pr-4 py-3 bg-pink-50 border-0 rounded-xl text-gray-700 focus:ring-2 focus:ring-pink-300 appearance-none cursor-pointer"
                  >
                    <option value="">指定なし</option>
                    <option value="5000">5,000円以上</option>
                    <option value="8000">8,000円以上</option>
                    <option value="10000">10,000円以上</option>
                    <option value="15000">15,000円以上</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">こだわり</label>
                <div className="relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                  <select 
                    name="tag"
                    className="w-full pl-10 pr-4 py-3 bg-pink-50 border-0 rounded-xl text-gray-700 focus:ring-2 focus:ring-pink-300 appearance-none cursor-pointer"
                  >
                    <option value="">すべて</option>
                    <option value="未経験歓迎">未経験歓迎</option>
                    <option value="日払いOK">日払いOK</option>
                    <option value="送迎あり">送迎あり</option>
                    <option value="入店祝い金">入店祝い金あり</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Search className="w-5 h-5" />
                  検索する
                </button>
              </div>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-pink-100">
            {preferences.map((pref) => (
              <a
                key={pref.id}
                href={`/recruitments?tag=${encodeURIComponent(pref.label)}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 text-sm rounded-full transition-colors border border-pink-200"
              >
                <pref.icon className="w-4 h-4" />
                {pref.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 求人一覧 + 地図切り替え */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">注目の求人</h2>
            <p className="text-gray-500 text-sm mt-1">厳選された優良店舗の求人情報</p>
          </div>
          <a href="/recruitments" className="text-pink-500 hover:text-pink-600 text-sm font-medium flex items-center gap-1 transition-colors">
            すべて見る
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* リスト/地図表示切り替え（Client Component） */}
        <ViewToggle 
          recruitments={displayRecruitments}
          shopsWithLocation={shopsWithLocation}
        />
      </section>

      {/* 安心ポイント */}
      <section className="bg-gradient-to-br from-pink-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">エステジョブが選ばれる理由</h2>
            <p className="text-gray-500">安心して働ける環境をサポートします</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">身バレ対策サポート</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                顔出しなしOKの店舗多数。プライバシーを守りながら安心して働けます。
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BadgeCheck className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">厳選された優良店</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                すべての掲載店舗を審査。安心して働ける環境の店舗のみ掲載しています。
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">無料LINE相談</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                不安なことは何でも相談OK。女性スタッフが親身にサポートします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-lg">エステジョブ</div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                メンエス専門の求人サイト。あなたらしい働き方を応援します。
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">求人を探す</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/areas" className="hover:text-pink-400 transition-colors">エリアから探す</a></li>
                <li><a href="/recruitments" className="hover:text-pink-400 transition-colors">条件から探す</a></li>
                <li><a href="/recruitments?sort=new" className="hover:text-pink-400 transition-colors">新着求人</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">お役立ち情報</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/guide/beginner" className="hover:text-pink-400 transition-colors">はじめての方へ</a></li>
                <li><a href="/guide/work" className="hover:text-pink-400 transition-colors">働き方ガイド</a></li>
                <li><a href="/faq" className="hover:text-pink-400 transition-colors">よくある質問</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">運営情報</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/company" className="hover:text-pink-400 transition-colors">運営会社</a></li>
                <li><a href="/privacy" className="hover:text-pink-400 transition-colors">プライバシーポリシー</a></li>
                <li><a href="/terms" className="hover:text-pink-400 transition-colors">利用規約</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
            © 2026 エステジョブ All rights reserved.
          </div>
        </div>
      </footer>

      {/* 固定LINE相談ボタン */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto">
          <a 
            href="https://line.me/R/ti/p/@your-line-id"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-[#06C755] hover:bg-[#05b04c] text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            LINEで相談する（無料）
          </a>
          <p className="text-center text-xs text-gray-500 mt-2">
            24時間対応・女性スタッフが対応します
          </p>
        </div>
      </div>

      <div className="h-28" />
    </div>
  );
}
