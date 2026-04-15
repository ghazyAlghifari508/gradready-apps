// prisma.config.ts — Prisma v7 config
// URL di prisma.config.ts dipakai untuk CLI (migrate, push, studio)
// Runtime PrismaClient menggunakan adapter dengan DATABASE_URL (pooler)

import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load .env.local first (Next.js convention), then .env as fallback
dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env" });

type Env = {
  DATABASE_URL: string;
  DIRECT_URL: string;
};

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DIRECT_URL untuk CLI operations (migrate, push, studio)
    // Jika DIRECT_URL tidak tersedia (port 5432 diblokir), fallback ke DATABASE_URL
    url: env<Env>("DATABASE_URL"),
  },
});
