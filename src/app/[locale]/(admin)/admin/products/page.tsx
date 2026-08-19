import { Metadata } from "next";

import { ProductsTable } from "@/components/admin/products-table";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminProducts } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Products",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  const { supabase } = await requireAdmin();
  const products = await getAdminProducts(supabase);

  return (
    <div>
      <ProductsTable products={products} />
    </div>
  );
}