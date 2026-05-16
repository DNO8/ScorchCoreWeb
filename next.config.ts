import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true, // Disabled temporarily - experimental feature causing Vercel post-build issues
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
