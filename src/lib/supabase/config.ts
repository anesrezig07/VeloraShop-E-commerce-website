export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  return (
    url.startsWith("https://") &&
    !url.includes("your-project") &&
    anonKey.length > 20 &&
    !anonKey.includes("your-anon") &&
    serviceKey.length > 20 &&
    !serviceKey.includes("your-service")
  );
}

export function isSupabasePubliclyConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  return (
    url.startsWith("https://") &&
    !url.includes("your-project") &&
    anonKey.length > 20 &&
    !anonKey.includes("your-anon")
  );
}
