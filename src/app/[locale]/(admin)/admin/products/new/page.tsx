import { Metadata } from "next";

import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminCategories } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "New Product",
  robots: { index: false, follow: false },
};

export default async function AdminNewProductPage() {
  const { supabase } = await requireAdmin();
  const categories = await getAdminCategories(supabase);

  return (
    <div>
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}