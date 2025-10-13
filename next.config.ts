import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/mockingbird',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
