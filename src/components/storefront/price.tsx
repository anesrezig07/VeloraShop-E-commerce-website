import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

export function Price({
  value,
  compareAt,
  locale,
  size = "md",
  className,
}: {
  value: number;
  compareAt?: number | null;
  locale: "fr" | "ar";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const showCompareAt = compareAt !== null && compareAt !== undefined && compareAt > value;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-semibold tabular-nums text-foreground",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-2xl",
        )}
      >
        {formatPrice(value, locale)}
      </span>
      {showCompareAt ? (
        <span
          className={cn(
            "text-muted-foreground line-through tabular-nums",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base",
          )}
          aria-hidden="true"
        >
          {formatPrice(compareAt, locale)}
        </span>
      ) : null}
    </div>
  );
}