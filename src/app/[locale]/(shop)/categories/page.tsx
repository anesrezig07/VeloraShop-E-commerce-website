import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getActiveCategoriesWithCounts } from "@/lib/data/categories";
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
  const categories = await getActiveCategoriesWithCounts();

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
          {categories.map((category, index) => {
            const name =
              currentLocale === "ar" ? category.name_ar : category.name_fr;
            const description =
              (currentLocale === "ar"
                ? category.description_ar
                : category.description_fr) ?? "";
            const count = category.productCount ?? 0;
            return (
              <Reveal key={category.id} delay={(index % 3) * 80}>
                <Link
                  href={`/${currentLocale}/categories/${category.slug}`}
                  className="group flex flex-col gap-3 overflow-hidden rounded-xl border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-premium"
                >
                  <span className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-xl font-bold text-primary">
                    {category.image_url ? (
                      <Image
                        src={category.image_url}
                        alt={name}
                        width={48}
                        height={48}
                        className="size-full object-cover"
                      />
                    ) : (
                      name.charAt(0)
                    )}
                  </span>
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-semibold">{name}</h2>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {count} {dict.categories.products}
                      </span>
                    </div>
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
              </Reveal>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <p className="font-medium">{dict.categories.empty}</p>
          <Link
            href={`/${currentLocale}/products`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            {dict.products.title}
          </Link>
        </div>
      )}
    </div>
  );
}