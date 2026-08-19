import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import type {
  Category,
  CustomerWithOrders,
  DeliveryRateWithWilaya,
  OrderWithDetails,
  Product,
  ProductVariant,
  ProductImage,
} from "@/lib/types";

export type AdminDb = SupabaseClient<Database>;

function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function getDashboardStats(supabase: AdminDb) {
  const [ordersResult, recentResult] = await Promise.all([
    supabase
      .from("orders")
      .select("id,status,total_amount")
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select(
        "id,order_number,customer_name,total_amount,status,created_at,wilaya:wilayas(name_fr,name_ar)",
      )
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const orders = (ordersResult.data ?? []) as {
    id: string;
    status: string;
    total_amount: number;
  }[];
  const totalOrders = orders.length;
  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + toNumber(order.total_amount), 0);
  const pending = orders.filter((order) => order.status === "pending").length;
  const delivered = orders.filter((order) => order.status === "delivered").length;

  const bestSellersResult = await supabase
    .from("order_items")
    .select("product_name,quantity");

  const counts = new Map<string, { qty: number }>();
  for (const item of bestSellersResult.data ?? []) {
    const entry = counts.get(item.product_name) ?? { qty: 0 };
    entry.qty += toNumber(item.quantity);
    counts.set(item.product_name, entry);
  }
  const bestSellers = [...counts.entries()]
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 5)
    .map(([name, { qty }]) => ({ name, qty }));

  return {
    totalOrders,
    revenue,
    pending,
    delivered,
    recentOrders: (recentResult.data ?? []) as Array<{
      id: string;
      order_number: string;
      customer_name: string;
      total_amount: number;
      status: string;
      created_at: string;
      wilaya: { name_fr: string; name_ar: string } | null;
    }>,
    bestSellers,
  };
}

export interface AdminProduct extends Product {
  category: Pick<Category, "name_fr" | "name_ar" | "slug"> | null;
  images: Pick<ProductImage, "url" | "is_primary" | "display_order">[];
}

export async function getAdminProducts(supabase: AdminDb): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, category:categories(name_fr,name_ar,slug), images:product_images(url,is_primary,display_order)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminProducts:", error.message);
    return [];
  }
  return (data ?? []) as AdminProduct[];
}

export async function getAdminProduct(supabase: AdminDb, id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*), variants:product_variants(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getAdminProduct:", error.message);
    return null;
  }
  return data as unknown as {
    category: Category | null;
    images: ProductImage[];
    variants: ProductVariant[];
  } & Product;
}

export async function getAdminCategories(supabase: AdminDb): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name_fr", { ascending: true });

  if (error) {
    console.error("getAdminCategories:", error.message);
    return [];
  }
  return (data ?? []) as Category[];
}

export async function getAdminOrders(
  supabase: AdminDb,
  status?: string,
): Promise<OrderWithDetails[]> {
  let query = supabase
    .from("orders")
    .select("*, wilaya:wilayas(*), items:order_items(*)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getAdminOrders:", error.message);
    return [];
  }
  return (data ?? []) as OrderWithDetails[];
}

export async function getAdminOrder(
  supabase: AdminDb,
  id: string,
): Promise<OrderWithDetails | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, wilaya:wilayas(*), items:order_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getAdminOrder:", error.message);
    return null;
  }
  return data as OrderWithDetails;
}

export async function getAdminCustomers(
  supabase: AdminDb,
): Promise<CustomerWithOrders[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*, wilaya:wilayas(*)")
    .order("last_order_at", { ascending: false });

  if (error) {
    console.error("getAdminCustomers:", error.message);
    return [];
  }
  return (data ?? []) as CustomerWithOrders[];
}

export async function getAdminDeliveryRates(
  supabase: AdminDb,
): Promise<DeliveryRateWithWilaya[]> {
  const { data, error } = await supabase
    .from("delivery_rates")
    .select("*, wilaya:wilayas(*)")
    .order("wilaya_id", { ascending: true });

  if (error) {
    console.error("getAdminDeliveryRates:", error.message);
    return [];
  }
  return (data ?? []) as DeliveryRateWithWilaya[];
}

export async function getAdminOrderCount(
  supabase: AdminDb,
): Promise<number> {
  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true });
  return count ?? 0;
}