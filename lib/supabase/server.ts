import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client, scoped to the current user's session via cookies.
 * Use inside Server Components, Server Actions, and Route Handlers.
 */
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
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component without a mutable cookie jar — safe to ignore
            // as long as middleware.ts is refreshing the session.
          }
        },
      },
      global: {
        // Supabase's queries go over fetch under the hood. Next.js caches fetch
        // requests by default; without this, a filtered product query (e.g.
        // ?category=Bags) could in principle be served from a stale Data Cache
        // entry instead of hitting Postgres fresh on every request.
        fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
      },
    }
  );
}
