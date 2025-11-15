import "server-only";

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const requiredEnv = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;

function invariantEnv() {
  requiredEnv.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing env var: ${key}`);
    }
  });
}

export function getServerSupabaseClient(): SupabaseClient {
  invariantEnv();

  type CookieStore = {
    get: (name: string) => { value?: string } | undefined;
    set: (options: { name: string; value: string } & CookieOptions) => void;
    delete: (options: { name: string } & CookieOptions) => void;
  };
  const cookieStore = (cookies() as unknown) as CookieStore;

  return (createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options });
        },
      },
    },
  ) as unknown) as SupabaseClient;
}

