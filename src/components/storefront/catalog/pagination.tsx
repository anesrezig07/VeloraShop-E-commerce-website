import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <Button
        variant="outline"
        size="icon-sm"
        disabled={page <= 1}
        render={page > 1 ? <Link href={hrefFor(page - 1)} /> : undefined}
        aria-label={dict.previous}
      >
        <ChevronLeft className="rtl:rotate-180" />
      </Button>
      {pages.map((p, index) =>
        p === "ellipsis" ? (
          <span key={`e-${index}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? "default" : "ghost"}
            size="icon-sm"
            render={p !== page ? <Link href={hrefFor(p)} /> : undefined}
            aria-current={p === page ? "page" : undefined}
            className={cn(p !== page && "text-muted-foreground")}
          >
            {p}
          </Button>
        ),
      )}
      <Button
        variant="outline"
        size="icon-sm"
        disabled={page >= pageCount}
        render={page < pageCount ? <Link href={hrefFor(page + 1)} /> : undefined}
        aria-label={dict.next}
      >
        <ChevronRight className="rtl:rotate-180" />
      </Button>
    </nav>
  );
}