import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['image.tmdb.org'],
  },
  experimental: {
    serverActions: {},
  }
};

export default nextConfig;
