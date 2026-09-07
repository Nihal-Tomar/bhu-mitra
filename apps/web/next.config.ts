import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ─── BhuMitra Next.js Configuration ───────────────────────────────────────
  // Stage 1: Foundation configuration only.
  // GIS, dynamic imports, image domains etc. added in their respective stages.

  // Strict mode for catching issues early
  reactStrictMode: true,

  // API rewrites — proxies /api/* to NestJS backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },

  // Experimental features (none enabled at Stage 1)
  experimental: {},

  // Transpile monorepo workspace packages
  transpilePackages: ['@bhumitra/ui', '@bhumitra/types'],

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
