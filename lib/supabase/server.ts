// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers"; // Only used on the server

function createCookieStore() {
  const cookieStore = cookies(); // synchronous

  return {
    get(name: string) {
      return cookieStore.get(name)?.value;
    },
    set(name: string, value: string, options: CookieOptions) {
      try {
        cookieStore.set({
          name,
          value,
          path: options.path,
          domain: options.domain,
          httpOnly: options.httpOnly,
          secure: options.secure,
          sameSite: options.sameSite,
          maxAge: options.expires
            ? Math.floor((options.expires.getTime() - Date.now()) / 1000)
            : options.maxAge,
        });
      } catch {}
    },
    remove(name: string, options: CookieOptions) {
      try {
        cookieStore.delete({
          name,
          path: options.path,
          domain: options.domain,
        });
      } catch {}
    },
  };
}

export function createSupabaseServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: createCookieStore() }
  );
}
