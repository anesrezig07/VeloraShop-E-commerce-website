"use server";

import { revalidatePath } from "next/cache";

import { loginSchema } from "@/lib/validators";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type AdminAuthResult =
  | { ok: true }
  | { ok: false; error?: string; notConfigured?: boolean };

export async function adminSignIn(
  email: string,
  password: string,
): Promise<AdminAuthResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, notConfigured: true };
  }

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { ok: false, error: "invalidCredentials" };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !user) {
    return { ok: false, error: "invalidCredentials" };
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return { ok: false, error: "notAdmin" };
  }

  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function adminSignOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/admin", "layout");
}