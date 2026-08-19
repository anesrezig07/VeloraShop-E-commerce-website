import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STATUS_VARIANTS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  confirmed: "bg-sky-100 text-sky-800 hover:bg-sky-100",
  preparing: "bg-violet-100 text-violet-800 hover:bg-violet-100",
  shipped: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  delivered: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
};

export function StatusBadge({
  status,
  locale,
}: {
  status: string;
  locale: "fr" | "ar";
}) {
  const label =
    ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS]?.[locale] ??
    status;

  return (
    <Badge variant="outline" className={cn(STATUS_VARIANTS[status])}>
      {label}
    </Badge>
  );
}