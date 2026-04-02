import type { NextConfig } from "next";
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'http', hostname: '162.43.91.102' },
      { protocol: 'https', hostname: 'crm.h-mitsu.com' },
      { protocol: 'https', hostname: 'h-mitsu.com' },
      { protocol: 'https', hostname: 'nuxojcydwxhecncbwjpb.supabase.co' },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
