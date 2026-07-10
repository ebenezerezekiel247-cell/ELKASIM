import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client. NEVER import this into a Client Component or expose
 * SUPABASE_SERVICE_ROLE to the browser. Server-only: server actions, route handlers,
 * and webhooks that must bypass RLS (e.g. verifying payments, writing orders).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
