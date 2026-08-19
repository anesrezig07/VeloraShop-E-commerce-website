import { ProductCard } from "@/components/storefront/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDictionary } from "@/i18n/server";
import type { CatalogProduct } from "@/lib/data/products";

export async function ProductGrid({
  products,
  locale,
  className,
}: {
  products: CatalogProduct[];
  locale: "fr" | "ar";
  className?: string;
}) {
  const dict = await getDictionary();

  return (
    <div
      className={
        className ??
        "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-4"
      }
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} dict={dict.common} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 rounded-xl border p-3"
        >
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  );
}