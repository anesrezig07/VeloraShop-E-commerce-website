import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getActiveCategories } from "@/lib/data/categories";
import { getDictionary, getLocale } from "@/i18n/server";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  const currentLocale = await getLocale();
  return {
    title: dict.categories.title,
    alternates: localeAlternates("/categories", currentLocale),
  };
}

export default async function CategoriesPage() {
  const dict = await getDictionary();
  const currentLocale = await getLocale();
  const categories = await getActiveCategories();

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 lg:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          {dict.categories.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {dict.categories.subtitle}
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const name = currentLocale === "ar" ? category.name_ar : category.name_fr;
            const description =
              (currentLocale === "ar" ? category.description_ar : category.description_fr) ?? "";
            return (
              <Link
                key={category.id}
                href={`/${currentLocale}/categories/${category.slug}`}
                className="group flex flex-col gap-3 rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
                  {name.charAt(0)}
                </span>
                <div>
                  <h2 className="font-semibold">{name}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-auto w-fit"
                  tabIndex={-1}
                >
                  {dict.categories.browse}
                </Button>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <p className="font-medium">{dict.categories.empty}</p>
          <Button variant="outline" size="sm" render={<Link href={`/${currentLocale}/products`} />}>
            {dict.products.title}
          </Button>
        </div>
      )}
    </div>
  );
}