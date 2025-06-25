import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['media3.giphy.com', 'giphy.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media3.giphy.com',
      },
      {
        protocol: 'https',
        hostname: 'giphy.com',
      },
    ],
  },
};

export default nextConfig;
