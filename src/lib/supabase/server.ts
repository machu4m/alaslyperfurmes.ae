import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Server Component / Route Handler Supabase client — uses the public anon key, respects RLS. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component with no writable cookies
            // (e.g. static rendering) — safe to ignore, middleware refreshes sessions.
          }
        },
      },
    }
  );
}
