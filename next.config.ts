import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  cleanDistDir: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
