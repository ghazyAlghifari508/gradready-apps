// lib/supabase.ts — Supabase JS client
// Used as a fallback for DB operations when direct Postgres connection is unavailable
// Connects via HTTPS (REST API) — works on any network without special ports

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side is handled via Supabase REST API through the same client
// For admin operations, use the MCP or service_role key
