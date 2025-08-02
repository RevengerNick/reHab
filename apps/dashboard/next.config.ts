import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        // Все запросы, начинающиеся с /api/
        source: '/api/:path*',
        // будут перенаправлены на наш бэкенд-сервис
        destination: 'http://api:3000/:path*',
      },
    ];
  },
};

export default nextConfig;
