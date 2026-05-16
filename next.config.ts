import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cleanDistDir: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
