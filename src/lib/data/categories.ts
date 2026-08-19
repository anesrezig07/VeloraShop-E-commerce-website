import "server-only";

import { isSupabasePubliclyConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

export async function getActiveCategories(): Promise<Category[]> {
  if (!isSupabasePubliclyConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("name_fr", { ascending: true });

  if (error) {
    console.error("getActiveCategories:", error.message);
    return [];
  }
  return (data ?? []) as Category[];
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  if (!isSupabasePubliclyConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getCategoryBySlug:", error.message);
    return null;
  }
  return data as Category;
}

export type CategoryWithCount = Category & { productCount: number };

export async function getActiveCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  if (!isSupabasePubliclyConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*, products!inner(id)")
    .eq("is_active", true)
    .eq("products.is_active", true)
    .order("display_order", { ascending: true })
    .order("name_fr", { ascending: true });

  if (error) {
    console.error("getActiveCategoriesWithCounts:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    ...row,
    products: undefined,
    productCount: Array.isArray(row.products) ? row.products.length : 0,
  })) as unknown as CategoryWithCount[];
}