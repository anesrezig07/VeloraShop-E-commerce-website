import "server-only";

import { isSupabasePubliclyConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  Product,
  ProductImage,
  ProductWithDetails,
} from "@/lib/types";

const DETAILED_SELECT =
  "*, category:categories(*), images:product_images(*), variants:product_variants(*)";

const LIST_SELECT =
  "*, category:categories(slug, name_fr, name_ar), images:product_images(url, alt_text, display_order, is_primary)";

export type CatalogProduct = Product & {
  category: Pick<Category, "slug" | "name_fr" | "name_ar"> | null;
  images: Pick<ProductImage, "url" | "alt_text" | "display_order" | "is_primary">[];
};

export function primaryImage(
  images: { url: string; display_order: number; is_primary: boolean }[],
): string | null {
  if (images.length === 0) return null;
  const primary = images.find((image) => image.is_primary);
  if (primary) return primary.url;
  return [...images].sort((a, b) => a.display_order - b.display_order)[0].url;
}

export async function getCatalogProducts({
  q,
  categorySlug,
  sort,
  page,
  maxPrice,
  inStock,
  onSale,
  limit = 12,
}: {
  q?: string;
  categorySlug?: string;
  sort?: string;
  page?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  limit?: number;
}): Promise<{ items: CatalogProduct[]; total: number; page: number; pageCount: number }> {
  if (!isSupabasePubliclyConfigured()) {
    return { items: [], total: 0, page: 1, pageCount: 0 };
  }

  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(LIST_SELECT, { count: "exact" })
    .eq("is_active", true);

  if (categorySlug) {
    query = query.eq("category.slug", categorySlug);
  }

  if (q && q.trim().length > 0) {
    const term = q.trim();
    query = query.or(
      `name_fr.ilike.%${term}%,name_ar.ilike.%${term}%,description_fr.ilike.%${term}%`,
    );
  }

  if (maxPrice && maxPrice > 0) {
    query = query.or(
      `and(sale_price.is.null,price.lte.${maxPrice}),sale_price.lte.${maxPrice}`,
    );
  }

  if (inStock) {
    query = query.gt("stock", 0);
  }

  if (onSale) {
    query = query.not("sale_price", "is", null).gt("sale_price", 0);
  }

  switch (sort) {
    case "featured":
      query = query.order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
      break;
    case "price-asc":
      query = query.order("sale_price", { ascending: true, nullsFirst: false })
        .order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("sale_price", { ascending: false, nullsFirst: false })
        .order("price", { ascending: false });
      break;
    case "name-asc":
      query = query.order("name_fr", { ascending: true });
      break;
    case "name-desc":
      query = query.order("name_fr", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
  }

  const currentPage = Math.max(1, page ?? 1);
  const from = (currentPage - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("getCatalogProducts:", error.message);
    return { items: [], total: 0, page: currentPage, pageCount: 0 };
  }

  const total = count ?? 0;
  return {
    items: (data ?? []) as CatalogProduct[],
    total,
    page: currentPage,
    pageCount: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getFeaturedProducts(limit = 8): Promise<CatalogProduct[]> {
  if (!isSupabasePubliclyConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(LIST_SELECT)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedProducts:", error.message);
    return [];
  }
  return (data ?? []) as CatalogProduct[];
}

export async function getBestSellers(limit = 8): Promise<CatalogProduct[]> {
  if (!isSupabasePubliclyConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(LIST_SELECT)
    .eq("is_active", true)
    .eq("is_best_seller", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getBestSellers:", error.message);
    return [];
  }
  return (data ?? []) as CatalogProduct[];
}

export async function getNewArrivals(limit = 8): Promise<CatalogProduct[]> {
  if (!isSupabasePubliclyConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(LIST_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getNewArrivals:", error.message);
    return [];
  }
  return (data ?? []) as CatalogProduct[];
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithDetails | null> {
  if (!isSupabasePubliclyConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(DETAILED_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getProductBySlug:", error.message);
    return null;
  }
  return data as unknown as ProductWithDetails;
}

export async function getRelatedProducts(
  product: ProductWithDetails,
  limit = 4,
): Promise<CatalogProduct[]> {
  if (!isSupabasePubliclyConfigured() || !product.category_id) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(LIST_SELECT)
    .eq("is_active", true)
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRelatedProducts:", error.message);
    return [];
  }
  return (data ?? []) as CatalogProduct[];
}

export type SearchSuggestion = {
  id: string;
  name_fr: string;
  name_ar: string;
  slug: string;
  price: string | number;
  sale_price: string | number | null;
  image_url: string | null;
};

export async function getSearchSuggestions(
  term: string,
  limit = 6,
): Promise<SearchSuggestion[]> {
  if (!isSupabasePubliclyConfigured() || !term.trim()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name_fr, name_ar, slug, price, sale_price, images:product_images(url, is_primary, display_order)",
    )
    .eq("is_active", true)
    .or(`name_fr.ilike.%${term.trim()}%,name_ar.ilike.%${term.trim()}%`)
    .order("name_fr", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("getSearchSuggestions:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const images = row.images ?? [];
    const primary = images.find((image) => image.is_primary) ?? images[0];
    return {
      id: row.id,
      name_fr: row.name_fr,
      name_ar: row.name_ar,
      slug: row.slug,
      price: row.price,
      sale_price: row.sale_price,
      image_url: primary?.url ?? null,
    } as SearchSuggestion;
  });
}