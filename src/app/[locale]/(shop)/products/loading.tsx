import { ProductGridSkeleton } from "@/components/storefront/product-grid";

export default function ProductsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 lg:px-6">
      <div className="premium-skeleton mb-8 h-8 w-48" />
      <div className="premium-skeleton mb-6 h-4 w-32" />
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="flex flex-col gap-6">
            <div className="premium-skeleton h-64" />
            <div className="premium-skeleton h-24" />
          </div>
        </aside>
        <ProductGridSkeleton count={12} />
      </div>
    </div>
  );
}