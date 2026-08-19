import type { MetadataRoute } from "next";

import { locales, defaultLocale } from "@/i18n/config";
import { isSupabasePubliclyConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/constants";

function localized(
  path: string,
): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = { "x-default": SITE_URL };
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}/${locale}${path}`;
  }
  return {
    url: `${SITE_URL}/${defaultLocale}${path}`,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    localized(""),
    localized("/products"),
    localized("/categories"),
  ];

  if (isSupabasePubliclyConfigured()) {
    const supabase = await createClient();

    const [productResult, categoryResult] = await Promise.all([
      supabase.from("products").select("slug, updated_at").eq("is_active", true),
      supabase.from("categories").select("slug").eq("is_active", true),
    ]);

    const products = productResult.error ? [] : (productResult.data ?? []);
    const categories = categoryResult.error ? [] : (categoryResult.data ?? []);

    for (const product of products) {
      const entry = localized(`/products/${product.slug}`);
      if (product.updated_at) entry.lastModified = product.updated_at;
      entries.push(entry);
    }

    for (const category of categories) {
      entries.push(localized(`/categories/${category.slug}`));
    }
  }

  return entries;
}