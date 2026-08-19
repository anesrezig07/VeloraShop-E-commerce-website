import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import type { CategoryWithCount } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

export function CategoryGrid({
  locale,
  categories,
}: {
  locale: "fr" | "ar";
  categories: CategoryWithCount[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
      {categories.map((category, index) => {
        const name = locale === "ar" ? category.name_ar : category.name_fr;
        const description = (locale === "ar"
          ? category.description_ar
          : category.description_fr) ?? "";
        const count = category.productCount ?? 0;
        const hasImage = Boolean(category.image_url);

        return (
          <Reveal key={category.id} delay={(index % 4) * 60} className="h-full">
            <Link
              href={`/${locale}/categories/${category.slug}`}
              className="group relative flex h-full min-h-40 flex-col justify-end overflow-hidden rounded-xl border bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-premium"
            >
              {hasImage ? (
                <div className="absolute inset-0 -z-10 bg-muted">
                  <Image
                    src={category.image_url!}
                    alt={name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                </div>
              ) : (
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-card to-card transition-opacity duration-300 group-hover:opacity-80" />
              )}

              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg text-lg font-bold",
                  hasImage
                    ? "bg-white/15 text-white backdrop-blur-sm"
                    : "bg-primary/10 text-primary",
                )}
              >
                {name.charAt(0)}
              </span>
              <span
                className={cn(
                  "mt-2 text-sm font-semibold",
                  hasImage ? "text-white" : "text-foreground",
                )}
              >
                {name}
              </span>
              <span
                className={cn(
                  "mt-0.5 text-xs",
                  hasImage ? "text-white/75" : "text-muted-foreground",
                )}
              >
                {count} {description ? `· ${description.slice(0, 40)}${description.length > 40 ? "…" : ""}` : ""}
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}