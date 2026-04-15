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
};

export default nextConfig;
