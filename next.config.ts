import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase body size limit for API routes (for image uploads)
  experimental: {
    serverActions: {
      bodySizeLimit: '35mb',
    },
  },
};

export default nextConfig;
