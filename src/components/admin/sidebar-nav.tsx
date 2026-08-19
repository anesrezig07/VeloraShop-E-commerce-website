"use client";

import {
  Boxes,
  HandCoins,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useDictionary, useLocale } from "@/i18n/client";
import { cn } from "@/lib/utils";

export function AdminSidebarNav() {
  const dict = useDictionary();
  const locale = useLocale();
  const pathname = usePathname();

  const links = [
    { href: `/${locale}/admin`, label: dict.admin.dashboard, icon: LayoutDashboard },
    { href: `/${locale}/admin/products`, label: dict.admin.products, icon: Package },
    { href: `/${locale}/admin/categories`, label: dict.admin.categories, icon: Boxes },
    { href: `/${locale}/admin/orders`, label: dict.admin.orders, icon: ShoppingCart },
    { href: `/${locale}/admin/customers`, label: dict.admin.customers, icon: Users },
    { href: `/${locale}/admin/delivery`, label: dict.admin.delivery, icon: Truck },
  ];

  return (
    <nav aria-label={dict.admin.title}>
      <ul className="flex flex-col gap-1">
        {links.map((link) => {
          const active =
            link.href === `/${locale}/admin`
              ? pathname === link.href
              : pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
        <HandCoins className="size-4 shrink-0 text-primary" />
        {dict.home.codTitle}
      </div>
    </nav>
  );
}