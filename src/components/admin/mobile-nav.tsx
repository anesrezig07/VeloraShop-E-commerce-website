"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDictionary, useLocale } from "@/i18n/client";
import { cn } from "@/lib/utils";

export function AdminMobileNav() {
  const dict = useDictionary();
  const locale = useLocale();
  const pathname = usePathname();

  const links = [
    { href: `/${locale}/admin`, label: dict.admin.dashboard },
    { href: `/${locale}/admin/products`, label: dict.admin.products },
    { href: `/${locale}/admin/categories`, label: dict.admin.categories },
    { href: `/${locale}/admin/orders`, label: dict.admin.orders },
    { href: `/${locale}/admin/customers`, label: dict.admin.customers },
    { href: `/${locale}/admin/delivery`, label: dict.admin.delivery },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none lg:hidden"
        aria-label={dict.nav.menu}
      >
        <Menu className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {links.map((link) => {
          const active =
            link.href === `/${locale}/admin`
              ? pathname === link.href
              : pathname.startsWith(link.href);
          return (
            <DropdownMenuItem
              key={link.href}
              render={<Link href={link.href} />}
              className={cn(active && "bg-primary/10 text-primary")}
            >
              {link.label}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={`/${locale}`} />}>
          {dict.nav.home}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}