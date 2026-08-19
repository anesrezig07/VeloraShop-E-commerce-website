import { Metadata } from "next";

import { CategoriesManager } from "@/components/admin/categories-manager";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminCategories } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Categories",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const { supabase } = await requireAdmin();
  const categories = await getAdminCategories(supabase);

  return (
    <div>
      <CategoriesManager categories={categories} />
    </div>
  );
}