"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

const requiredEnv = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;

function invariantEnv() {
  requiredEnv.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing env var: ${key}`);
    }
  });
}

export function getBrowserSupabaseClient(): SupabaseClient {
  if (browserClient) return browserClient;
  invariantEnv();
  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ) as unknown as SupabaseClient;
  return browserClient;
}

