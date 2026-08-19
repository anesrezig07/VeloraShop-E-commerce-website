import { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminOrders } from "@/lib/data/admin";
import { getDictionary, getLocale } from "@/i18n/server";
import { formatPrice, formatDateTime } from "@/lib/format";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

export default async function AdminOrdersPage(
  props: PageProps<"/[locale]/admin/orders">,
) {
  const searchParams = await props.searchParams;
  const { supabase } = await requireAdmin();
  const dict = await getDictionary();
  const currentLocale = await getLocale();

  const status =
    typeof searchParams.status === "string" ? searchParams.status : "all";

  const orders = await getAdminOrders(supabase, status);

  const tabs = [
  { value: "all", label: dict.common.all },
  ...ORDER_STATUSES.map((value) => ({
    value,
    label: ORDER_STATUS_LABELS[value][currentLocale],
  })),
];

return (
  <div>
    <PageHeader
      title={dict.admin.orders}
      subtitle={`${orders.length}`}
    />

    <div className="mb-4 flex flex-wrap gap-1.5">
      {tabs.map((tab) => (
        <Link
          key={tab.value}
          href={`/${currentLocale}/admin/orders${tab.value !== "all" ? `?status=${tab.value}` : ""}`}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            status === tab.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dict.admin.orderNumber}</TableHead>
              <TableHead>{dict.admin.customerName}</TableHead>
              <TableHead className="hidden md:table-cell">
                {dict.admin.wilaya}
              </TableHead>
              <TableHead>{dict.admin.totalAmount}</TableHead>
              <TableHead className="hidden lg:table-cell">
                {dict.admin.createdAt}
              </TableHead>
              <TableHead>{dict.admin.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium tabular-nums">
                  <Link
                    href={`/${currentLocale}/admin/orders/${order.id}`}
                    className="hover:underline"
                  >
                    {order.order_number}
                  </Link>
                </TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {order.wilaya?.name_fr}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatPrice(order.total_amount, currentLocale)}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {formatDateTime(order.created_at, currentLocale)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} locale={currentLocale} />
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  {dict.admin.noOrders}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}