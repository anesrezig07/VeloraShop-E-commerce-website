import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

const PLACEHOLDER = "your-service-role-key";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    !url ||
    !serviceRoleKey ||
    serviceRoleKey === PLACEHOLDER ||
    serviceRoleKey.length < 30
  ) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Add it to your environment variables before using admin operations.",
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}