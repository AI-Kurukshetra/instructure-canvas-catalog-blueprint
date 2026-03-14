import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

export const createServerSupabaseClient = async () => {
  // Next's request cookies APIs are sync in some versions and async in others.
  const cookieStore = await Promise.resolve(cookies());

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        if (typeof cookieStore.set !== "function") return;
        try {
          cookieStore.set(name, value, options);
        } catch {
          // Ignore readonly cookie stores (e.g., Server Components).
        }
      },
      remove(name: string, options: CookieOptions) {
        if (typeof cookieStore.set !== "function") return;
        try {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        } catch {
          // Ignore readonly cookie stores (e.g., Server Components).
        }
      },
    },
  });
};
