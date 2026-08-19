import { Metadata } from "next";

import { DeliveryManager } from "@/components/admin/delivery-manager";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminDeliveryRates } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Delivery",
  robots: { index: false, follow: false },
};

export default async function AdminDeliveryPage() {
  const { supabase } = await requireAdmin();
  const rates = await getAdminDeliveryRates(supabase);

  return <DeliveryManager rates={rates} />;
}