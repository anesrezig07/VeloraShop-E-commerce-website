import { Metadata } from "next";
import Link from "next/link";

import { CatalogCategories } from "@/components/storefront/catalog/catalog-categories";
import { CatalogSort } from "@/components/storefront/catalog/catalog-sort";
import { MaxPriceFilter } from "@/components/storefront/catalog/max-price-filter";
import { MobileFilters } from "@/components/storefront/catalog/mobile-filters";
import { Pagination } from "@/components/storefront/catalog/pagination";
import { ProductGrid } from "@/components/storefront/product-grid";
import { Button } from "@/components/ui/button";
import { getActiveCategories } from "@/lib/data/categories";
import { getCatalogProducts } from "@/lib/data/products";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import { getDictionary, getLocale } from "@/i18n/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  const currentLocale = await getLocale();
  return {
    title: dict.products.title,
    alternates: localeAlternates("/products", currentLocale),
  };
}

export default async function ProductsPage(props: PageProps<"/[locale]/products">) {
  const searchParams = await props.searchParams;
  const dict = await getDictionary();
  const currentLocale = await getLocale();

  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const categorySlug =
    typeof searchParams.category === "string" ? searchParams.category : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : undefined;
  const page = Number(searchParams.page ?? 1);
  const maxPrice = Number(searchParams.maxPrice ?? 0) || undefined;

  const [result, categories] = await Promise.all([
    getCatalogProducts({
      q,
      categorySlug,
      sort,
      page: Number.isFinite(page) ? page : 1,
      maxPrice,
      limit: PRODUCTS_PER_PAGE,
    }),
    getActiveCategories(),
  ]);

  const basePath = `/${currentLocale}/products`;

  const filterPanel = (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-semibold">{dict.products.filters}</p>
        <CatalogCategories
          locale={currentLocale}
          categories={categories}
          activeSlug={categorySlug ?? null}
          basePath={basePath}
          dict={{ categoryAll: dict.products.categoryAll }}
        />
      </div>
      <MaxPriceFilter defaultValue={searchParams.maxPrice?.toString()} />
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 lg:px-6">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          {dict.products.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {result.total} {dict.common.results}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">{filterPanel}</div>
        </aside>

        <div className="flex flex-col">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <MobileFilters label={dict.products.filters}>
              {filterPanel}
            </MobileFilters>
            <CatalogSort value={sort} />
          </div>

          {result.items.length > 0 ? (
            <ProductGrid products={result.items} locale={currentLocale} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
              <p className="font-medium">{dict.products.noProducts}</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {dict.products.noProductsSubtitle}
              </p>
              <Button variant="outline" size="sm" render={<Link href={basePath} />}>
                {dict.products.resetFilters}
              </Button>
            </div>
          )}

          <Pagination
            page={result.page}
            pageCount={result.pageCount}
            basePath={basePath}
            query={searchParams.toString()}
            dict={{ previous: dict.common.previous, next: dict.common.next, of: dict.common.of }}
          />
        </div>
      </div>
    </div>
  );
}