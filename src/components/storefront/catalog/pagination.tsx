import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export function Pagination({
  page,
  pageCount,
  basePath,
  query,
  dict,
}: {
  page: number;
  pageCount: number;
  basePath: string;
  query: string;
  dict: { previous: string; next: string; of: string };
}) {
  if (pageCount <= 1) return null;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams(query);
    if (p <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(p));
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages: (number | "ellipsis")[] = [];
  for (let i = 1; i <= pageCount; i += 1) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1"
      aria-label="pagination"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          className={buttonVariants({ variant: "outline", size: "icon-sm" })}
          aria-label={dict.previous}
        >
          <ChevronLeft className="rtl:rotate-180" />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className={buttonVariants({ variant: "outline", size: "icon-sm" })}
          aria-label={dict.previous}
        >
          <ChevronLeft className="rtl:rotate-180" />
        </button>
      )}
      {pages.map((p, index) =>
        p === "ellipsis" ? (
          <span key={`e-${index}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : p === page ? (
          <button
            key={p}
            type="button"
            className={buttonVariants({ variant: "default", size: "icon-sm" })}
            aria-current="page"
          >
            {p}
          </button>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            className={buttonVariants({
              variant: "ghost",
              size: "icon-sm",
              className: "text-muted-foreground",
            })}
          >
            {p}
          </Link>
        ),
      )}
      {page < pageCount ? (
        <Link
          href={hrefFor(page + 1)}
          className={buttonVariants({ variant: "outline", size: "icon-sm" })}
          aria-label={dict.next}
        >
          <ChevronRight className="rtl:rotate-180" />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className={buttonVariants({ variant: "outline", size: "icon-sm" })}
          aria-label={dict.next}
        >
          <ChevronRight className="rtl:rotate-180" />
        </button>
      )}
    </nav>
  );
}