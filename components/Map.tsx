// components/Map.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Wallet } from 'lucide-react';

// Leaflet アイコンの画像パス問題を修正
// Next.js環境でデフォルトアイコンが表示されないバグ対策
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// カスタムピンクマーカーアイコン
const pinkIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path fill="#EC4899" stroke="#BE185D" stroke-width="1" d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24C24 5.4 18.6 0 12 0z"/>
      <circle fill="#FFF" cx="12" cy="12" r="5"/>
    </svg>
  `),
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
});

// Props型定義
type Shop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  area?: string;
  hourly_wage_min?: number | null;
  hourly_wage_max?: number | null;
  main_concept?: string | null;
};

type MapProps = {
  shops: Shop[];
  center?: [number, number];
  zoom?: number;
};

export default function Map({ 
  shops, 
  center = [35.6762, 139.6503], // デフォルト: 東京
  zoom = 12 
}: MapProps) {
  // 店舗がある場合、最初の店舗を中心に
  const mapCenter: [number, number] = shops.length > 0 
    ? [shops[0].lat, shops[0].lng] 
    : center;

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      scrollWheelZoom={true}
      className="w-full h-full rounded-2xl"
      style={{ minHeight: '500px' }}
    >
      {/* OpenStreetMap タイル */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 店舗マーカー */}
      {shops.map((shop) => (
        <Marker 
          key={shop.id} 
          position={[shop.lat, shop.lng]}
          icon={pinkIcon}
        >
          <Popup>
            <div className="min-w-[200px] p-1">
              {/* 店名 */}
              <h3 className="font-bold text-gray-800 text-base mb-1">
                {shop.name}
              </h3>
              
              {/* エリア */}
              {shop.area && (
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-pink-400" />
                  {shop.area}
                </div>
              )}

              {/* コンセプト */}
              {shop.main_concept && (
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {shop.main_concept}
                </p>
              )}

              {/* 時給 */}
              {shop.hourly_wage_min && (
                <div className="flex items-center bg-pink-50 text-pink-600 text-sm font-medium px-2 py-1 rounded-lg mb-2">
                  <Wallet className="w-4 h-4 mr-1" />
                  時給 ¥{shop.hourly_wage_min.toLocaleString()}〜
                  {shop.hourly_wage_max && `¥${shop.hourly_wage_max.toLocaleString()}`}
                </div>
              )}

              {/* 詳細リンク */}
              <a
                href={`/recruitments/${shop.id}`}
                className="block w-full text-center py-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-medium rounded-lg hover:from-pink-600 hover:to-rose-500 transition-all"
              >
                詳細を見る
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
