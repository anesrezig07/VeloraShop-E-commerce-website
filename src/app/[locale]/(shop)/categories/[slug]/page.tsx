import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CatalogSort } from "@/components/storefront/catalog/catalog-sort";
import { Pagination } from "@/components/storefront/catalog/pagination";
import { ProductGrid } from "@/components/storefront/product-grid";
import { buttonVariants } from "@/components/ui/button";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getCatalogProducts } from "@/lib/data/products";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import { getDictionary, getLocale } from "@/i18n/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(
  props: PageProps<"/[locale]/categories/[slug]">,
): Promise<Metadata> {
  const params = await props.params;
  const dict = await getDictionary();
  const currentLocale = await getLocale();
  const category = await getCategoryBySlug(params.slug);

  if (!category) return { title: dict.categories.title };

  const name = currentLocale === "ar" ? category.name_ar : category.name_fr;
  const description =
    currentLocale === "ar" ? category.description_ar : category.description_fr;

  return {
    title: name,
    description: description ?? undefined,
    alternates: localeAlternates(`/categories/${category.slug}`, currentLocale),
  };
}

export default async function CategoryPage(
  props: PageProps<"/[locale]/categories/[slug]">,
) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const dict = await getDictionary();
  const currentLocale = await getLocale();

  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const sort = typeof searchParams.sort === "string" ? searchParams.sort : undefined;
  const page = Number(searchParams.page ?? 1);

  const result = await getCatalogProducts({
    categorySlug: category.slug,
    sort,
    page: Number.isFinite(page) ? page : 1,
    limit: PRODUCTS_PER_PAGE,
  });

  const name = currentLocale === "ar" ? category.name_ar : category.name_fr;
  const description =
    (currentLocale === "ar" ? category.description_ar : category.description_fr) ?? "";
  const basePath = `/${currentLocale}/categories/${category.slug}`;

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 lg:px-6">
      <nav className="mb-4 text-sm text-muted-foreground" aria-label="breadcrumb">
        <Link href={`/${currentLocale}`} className="hover:text-foreground">
          {dict.nav.home}
        </Link>
        <span aria-hidden="true"> / </span>
        <Link
          href={`/${currentLocale}/categories`}
          className="hover:text-foreground"
        >
          {dict.nav.categories}
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-foreground">{name}</span>
      </nav>

      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          {name}
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
        <p className="text-sm text-muted-foreground">
          {result.total} {dict.common.results}
        </p>
      </div>

      <div className="mb-4 flex justify-end">
        <CatalogSort value={sort} />
      </div>

      {result.items.length > 0 ? (
        <ProductGrid products={result.items} locale={currentLocale} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <p className="font-medium">{dict.products.noProducts}</p>
          <Link
            href={basePath}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            {dict.products.resetFilters}
          </Link>
        </div>
      )}

      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        basePath={basePath}
        query={searchParams.toString()}
        dict={{
          previous: dict.common.previous,
          next: dict.common.next,
          of: dict.common.of,
        }}
      />
    </div>
  );
}