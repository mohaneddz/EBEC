import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      new URL('https://randomuser.me/api/portraits/men/**'),
      new URL('https://randomuser.me/api/portraits/women/**'),
      new URL('https://picsum.photos/seed/**'),
    ],
  },
};

export default nextConfig;
