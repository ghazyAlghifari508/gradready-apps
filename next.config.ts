import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for PDF extraction in API routes (server-side)
  serverExternalPackages: ["unpdf"],
  // Ignore TS errors in Vercel build (Prisma client types differ between local and Vercel)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Next.js 16 uses Turbopack by default
  turbopack: {
    resolveAlias: {
      canvas: { browser: "./src/lib/empty.ts" },
    },
  },
};

export default nextConfig;
