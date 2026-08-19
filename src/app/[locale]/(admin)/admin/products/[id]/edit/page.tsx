import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminCategories, getAdminProduct } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Edit Product",
  robots: { index: false, follow: false },
};

export default async function AdminEditProductPage(
  props: PageProps<"/[locale]/admin/products/[id]/edit">,
) {
  const params = await props.params;
  const { supabase } = await requireAdmin();

  const [product, categories] = await Promise.all([
    getAdminProduct(supabase, params.id),
    getAdminCategories(supabase),
  ]);

  if (!product) notFound();

  return (
    <div>
      <ProductForm mode="edit" categories={categories} product={product} />
    </div>
  );
}