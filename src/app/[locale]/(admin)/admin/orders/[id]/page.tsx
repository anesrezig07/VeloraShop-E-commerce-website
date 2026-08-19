import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusActions } from "@/components/admin/order-status-actions";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
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
import { getAdminOrder } from "@/lib/data/admin";
import { getDictionary, getLocale } from "@/i18n/server";
import { formatDateTime, formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Order",
  robots: { index: false, follow: false },
};

export default async function AdminOrderDetailPage(
  props: PageProps<"/[locale]/admin/orders/[id]">,
) {
  const params = await props.params;
  const { supabase } = await requireAdmin();
  const dict = await getDictionary();
  const currentLocale = await getLocale();

  const order = await getAdminOrder(supabase, params.id);
  if (!order) notFound();

  const items = order.items ?? [];

  return (
    <div>
      <div className="mb-4">
        <Link
          href={`/${currentLocale}/admin/orders`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {dict.admin.orders}
        </Link>
      </div>

      <PageHeader
        title={order.order_number}
        subtitle={formatDateTime(order.created_at, currentLocale)}
        actions={<StatusBadge status={order.status} locale={currentLocale} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{dict.admin.orderItems}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{dict.admin.productName}</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      {dict.admin.variantName}
                    </TableHead>
                    <TableHead>{dict.admin.quantity}</TableHead>
                    <TableHead>{dict.admin.unitPrice}</TableHead>
                    <TableHead>{dict.admin.lineTotal}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.product_name}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {item.variant_name ?? "—"}
                      </TableCell>
                      <TableCell className="tabular-nums">{item.quantity}</TableCell>
                      <TableCell className="tabular-nums">
                        {formatPrice(item.unit_price, currentLocale)}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {formatPrice(item.total_price, currentLocale)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{dict.checkout.contactInformation}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <p>
                <span className="text-muted-foreground">{dict.admin.customerName}: </span>
                <span className="font-medium">{order.customer_name}</span>
              </p>
              <p>
                <span className="text-muted-foreground">{dict.checkout.phone}: </span>
                <span className="font-medium" dir="ltr">
                  {order.customer_phone}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{dict.checkout.deliveryAddress}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <p>
                <span className="text-muted-foreground">{dict.admin.wilaya}: </span>
                <span className="font-medium">
                  {order.wilaya?.name_fr} ({order.wilaya?.code})
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">{dict.checkout.commune}: </span>
                <span className="font-medium">{order.commune}</span>
              </p>
              <p>
                <span className="text-muted-foreground">{dict.checkout.address}: </span>
                <span className="font-medium">{order.shipping_address}</span>
              </p>
              <p>
                <span className="text-muted-foreground">{dict.checkout.deliveryMethod}: </span>
                <span className="font-medium">
                  {order.delivery_type === "home"
                    ? dict.checkout.homeDelivery
                    : dict.checkout.stopDesk}
                </span>
              </p>
              {order.notes ? (
                <p>
                  <span className="text-muted-foreground">{dict.checkout.notes}: </span>
                  <span className="font-medium">{order.notes}</span>
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{dict.cart.orderSummary}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{dict.admin.subtotal}</span>
                <span className="tabular-nums">{formatPrice(order.subtotal, currentLocale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{dict.admin.deliveryFee}</span>
                <span className="tabular-nums">{formatPrice(order.delivery_fee, currentLocale)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>{dict.admin.total}</span>
                <span className="tabular-nums">{formatPrice(order.total_amount, currentLocale)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{dict.admin.updateStatus}</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusActions
                orderId={order.id}
                currentStatus={order.status}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}