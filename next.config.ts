import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cxmzembwpyykavuboizy.supabase.co',
      },
    ],
  },
};

export default nextConfig;
