import "server-only";

import { isSupabasePubliclyConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { DeliveryRateWithWilaya } from "@/lib/types";

export async function getDeliveryOptions(): Promise<DeliveryRateWithWilaya[]> {
  if (!isSupabasePubliclyConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("delivery_rates")
    .select("*, wilaya:wilayas(*)")
    .eq("is_active", true)
    .order("wilaya_id", { ascending: true });

  if (error) {
    console.error("getDeliveryOptions:", error.message);
    return [];
  }
  return (data ?? []) as DeliveryRateWithWilaya[];
}

export async function getDeliveryRate(
  wilayaId: number,
): Promise<DeliveryRateWithWilaya | null> {
  if (!isSupabasePubliclyConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("delivery_rates")
    .select("*, wilaya:wilayas(*)")
    .eq("wilaya_id", wilayaId)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getDeliveryRate:", error.message);
    return null;
  }
  return data as DeliveryRateWithWilaya;
}