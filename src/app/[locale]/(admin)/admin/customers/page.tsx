import { Metadata } from "next";

import { PageHeader } from "@/components/admin/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminCustomers } from "@/lib/data/admin";
import { getDictionary, getLocale } from "@/i18n/server";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Customers",
  robots: { index: false, follow: false },
};

export default async function AdminCustomersPage() {
  const { supabase } = await requireAdmin();
  const dict = await getDictionary();
  const currentLocale = await getLocale();
  const customers = await getAdminCustomers(supabase);

  return (
    <div>
      <PageHeader title={dict.admin.customers} subtitle={String(customers.length)} />

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dict.admin.customerName}</TableHead>
              <TableHead>{dict.checkout.phone}</TableHead>
              <TableHead className="hidden md:table-cell">
                {dict.admin.wilaya}
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                {dict.admin.totalOrders}
              </TableHead>
              <TableHead>{dict.admin.totalSpent}</TableHead>
              <TableHead className="hidden lg:table-cell">
                {dict.admin.lastOrder}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.full_name}</TableCell>
                <TableCell className="tabular-nums" dir="ltr">
                  {customer.phone}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {customer.wilaya?.name_fr}
                </TableCell>
                <TableCell className="hidden sm:table-cell tabular-nums">
                  {customer.total_orders}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatPrice(customer.total_spent, currentLocale)}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {formatDate(customer.last_order_at, currentLocale)}
                </TableCell>
              </TableRow>
            ))}
            {customers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  {dict.admin.noCustomers}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}