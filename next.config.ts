import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'http', hostname: '162.43.91.102' },
      { protocol: 'https', hostname: 'crm.h-mitsu.com' },
      { protocol: 'https', hostname: 'h-mitsu.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
};

export default nextConfig;
