import { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, CircleDollarSign, Package, Timer } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdmin } from "@/lib/admin/session";
import { getDashboardStats } from "@/lib/data/admin";
import { getDictionary, getLocale } from "@/i18n/server";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const dict = await getDictionary();
  const currentLocale = await getLocale();

  const stats = await getDashboardStats(supabase);

  const cards = [
    {
      label: dict.admin.totalOrders,
      value: String(stats.totalOrders),
      icon: Package,
    },
    {
      label: dict.admin.totalRevenue,
      value: formatPrice(stats.revenue, currentLocale),
      icon: CircleDollarSign,
    },
    {
      label: dict.admin.ordersPending,
      value: String(stats.pending),
      icon: Timer,
    },
    {
      label: dict.admin.ordersDelivered,
      value: String(stats.delivered),
      icon: CircleCheck,
    },
  ];

  return (
    <div>
      <PageHeader title={dict.admin.dashboard} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card
            key={card.label}
            className="border-transparent bg-gradient-to-br from-card to-muted shadow-card"
          >
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <card.icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">{dict.admin.recentOrders}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              render={<Link href={`/${currentLocale}/admin/orders`} />}
            >
              {dict.admin.viewAll}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dict.admin.orderNumber}</TableHead>
                  <TableHead>{dict.admin.customerName}</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    {dict.admin.wilaya}
                  </TableHead>
                  <TableHead>{dict.admin.totalAmount}</TableHead>
                  <TableHead>{dict.admin.status}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentOrders.map((order) => (
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
                    <TableCell className="hidden sm:table-cell">
                      {order.wilaya?.name_fr}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {formatPrice(order.total_amount, currentLocale)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} locale={currentLocale} />
                    </TableCell>
                  </TableRow>
                ))}
                {stats.recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-muted-foreground"
                    >
                      {dict.common.noResults}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{dict.admin.bestSellers}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {stats.bestSellers.map((item, index) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded bg-muted text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    × {item.qty}
                  </span>
                </li>
              ))}
              {stats.bestSellers.length === 0 ? (
                <li className="py-6 text-center text-sm text-muted-foreground">
                  {dict.common.noResults}
                </li>
              ) : null}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}