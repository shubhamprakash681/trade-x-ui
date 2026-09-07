import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output is required for Docker builds, but conflicts with Vercel serverless builds
  ...(process.env.NEXT_VERCEL_FLAG ? {} : { output: "standalone" }),
};

export default nextConfig;
