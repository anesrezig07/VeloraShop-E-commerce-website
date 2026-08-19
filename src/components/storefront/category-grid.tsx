import Link from "next/link";

import type { Category } from "@/lib/types";

export function CategoryGrid({
  locale,
  categories,
}: {
  locale: "fr" | "ar";
  categories: Category[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => {
        const name = locale === "ar" ? category.name_ar : category.name_fr;
        const description = (locale === "ar"
          ? category.description_ar
          : category.description_fr) ?? "";
        return (
          <Link
            key={category.id}
            href={`/${locale}/categories/${category.slug}`}
            className="group flex flex-col gap-2 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
              {name.charAt(0)}
            </span>
            <span className="text-sm font-semibold">{name}</span>
            <span className="text-xs text-muted-foreground">
              {description.length > 60
                ? `${description.slice(0, 60)}…`
                : description}
            </span>
          </Link>
        );
      })}
    </div>
  );
}