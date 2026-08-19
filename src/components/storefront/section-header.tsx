import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SectionHeader({
  title,
  subtitle,
  seeAllHref,
  seeAllLabel,
}: {
  title: string;
  subtitle?: string;
  seeAllHref?: string;
  seeAllLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {seeAllHref && seeAllLabel ? (
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0"
          render={<Link href={seeAllHref} />}
        >
          {seeAllLabel}
        </Button>
      ) : null}
    </div>
  );
}