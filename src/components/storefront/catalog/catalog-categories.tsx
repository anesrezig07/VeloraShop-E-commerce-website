import Link from "next/link";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function CatalogCategories({
  locale,
  categories,
  activeSlug,
  basePath,
  dict,
}: {
  locale: "fr" | "ar";
  categories: Category[];
  activeSlug: string | null;
  basePath: string;
  dict: { categoryAll: string };
}) {
  const hrefFor = (slug: string | null) =>
    slug ? `${basePath}?category=${slug}` : basePath;

  return (
    <div className="flex flex-col gap-1">
      <Link
        href={hrefFor(null)}
        className={cn(
          "rounded-lg px-3 py-2 text-sm transition-colors",
          !activeSlug
            ? "bg-primary/10 font-medium text-primary"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        {dict.categoryAll}
      </Link>
      {categories.map((category) => {
        const active = category.slug === activeSlug;
        return (
          <Link
            key={category.id}
            href={hrefFor(category.slug)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {locale === "ar" ? category.name_ar : category.name_fr}
          </Link>
        );
      })}
    </div>
  );
}