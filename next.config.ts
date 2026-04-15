import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for PDF extraction in API routes (server-side)
  serverExternalPackages: ["unpdf"],
  // Next.js 16 uses Turbopack by default
  turbopack: {
    resolveAlias: {
      canvas: { browser: "./src/lib/empty.ts" },
    },
  },
  // @ts-ignore - NextConfig types might be strict for eslint
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
