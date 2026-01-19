// src/components/ViewToggle.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  List, 
  Map as MapIcon,
  MapPin,
  Sparkles,
  Star,
  Gift,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import type { Recruitment } from '@/app/page';

// Leaflet地図をSSR無効でdynamic import
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-pink-50 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-300 border-t-pink-500 rounded-full mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">地図を読み込み中...</p>
      </div>
    </div>
  ),
});

// 地図用の店舗データ型
type ShopWithLocation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  area?: string;
  hourly_wage_min?: number | null;
  hourly_wage_max?: number | null;
  main_concept?: string | null;
};

type ViewToggleProps = {
  recruitments: Recruitment[];
  shopsWithLocation: ShopWithLocation[];
};

// 求人カードコンポーネント
function RecruitmentCard({ recruitment }: { recruitment: Recruitment }) {
  const tags = recruitment.tags || [];
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden hover:shadow-lg hover:border-pink-200 transition-all duration-300 group">
      {/* 画像エリア */}
      <div className="relative h-40 bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
        {recruitment.is_featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-current" />
            注目求人
          </div>
        )}
        {recruitment.image_url ? (
          <img 
            src={recruitment.image_url} 
            alt={recruitment.shop_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-pink-300">
            <Sparkles className="w-16 h-16" />
          </div>
        )}
        {/* 時給バッジ */}
        {recruitment.hourly_wage_min && (
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md">
            <div className="text-xs text-gray-500">時給</div>
            <div className="text-lg font-bold text-pink-500">
              ¥{recruitment.hourly_wage_min.toLocaleString()}〜
            </div>
          </div>
        )}
      </div>

      {/* コンテンツ */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-gray-800 group-hover:text-pink-500 transition-colors">
              {recruitment.shop_name}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {recruitment.area}
            </div>
          </div>
        </div>

        {(recruitment.description || recruitment.main_concept) && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {recruitment.main_concept || recruitment.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {recruitment.daily_guarantee && (
            <div className="flex items-center bg-pink-50 text-pink-600 text-xs font-medium px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              日給保証 ¥{recruitment.daily_guarantee.toLocaleString()}
            </div>
          )}
          {recruitment.bonus && recruitment.bonus > 0 && (
            <div className="flex items-center bg-amber-50 text-amber-600 text-xs font-medium px-2.5 py-1 rounded-lg">
              <Gift className="w-3.5 h-3.5 mr-1" />
              祝い金 ¥{recruitment.bonus.toLocaleString()}
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-pink-100 text-pink-500 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <a 
          href={`/recruitments/${recruitment.id}`}
          className="w-full py-2.5 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm hover:shadow-md"
        >
          詳細を見る
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export default function ViewToggle({ recruitments, shopsWithLocation }: ViewToggleProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  return (
    <div>
      {/* 表示切替ボタン */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            viewMode === 'list'
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-pink-200 hover:bg-pink-50'
          }`}
        >
          <List className="w-4 h-4" />
          リスト
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            viewMode === 'map'
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-pink-200 hover:bg-pink-50'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          地図
          {shopsWithLocation.length > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              viewMode === 'map' ? 'bg-white/20' : 'bg-pink-100 text-pink-500'
            }`}>
              {shopsWithLocation.length}
            </span>
          )}
        </button>
      </div>

      {/* コンテンツ表示 */}
      {viewMode === 'list' ? (
        // リスト表示
        recruitments.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recruitments.map((recruitment) => (
              <RecruitmentCard key={recruitment.id} recruitment={recruitment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-pink-100">
            <Sparkles className="w-12 h-12 text-pink-300 mx-auto mb-4" />
            <p className="text-gray-500">求人情報を準備中です</p>
            <p className="text-sm text-gray-400 mt-2">まもなく掲載開始予定</p>
          </div>
        )
      ) : (
        // 地図表示
        <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm">
          {shopsWithLocation.length > 0 ? (
            <div className="h-[500px]">
              <Map shops={shopsWithLocation} />
            </div>
          ) : (
            <div className="h-[500px] flex items-center justify-center bg-pink-50">
              <div className="text-center">
                <MapIcon className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                <p className="text-gray-500">位置情報のある求人がありません</p>
                <p className="text-sm text-gray-400 mt-2">リスト表示でご確認ください</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
