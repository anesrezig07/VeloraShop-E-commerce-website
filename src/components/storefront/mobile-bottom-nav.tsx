"use client";

import { Home, LayoutGrid, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileNav } from "@/components/storefront/mobile-nav";
import { useDictionary, useLocale } from "@/i18n/client";
import { useCart } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

export function MobileBottomNav({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const dict = useDictionary();
  const locale = useLocale();
  const pathname = usePathname();
  const { itemCount } = useCart();

  const items = [
    {
      href: `/${locale}`,
      label: dict.nav.home,
      icon: Home,
      active: pathname === `/${locale}`,
    },
    {
      href: `/${locale}/categories`,
      label: dict.nav.categories,
      icon: LayoutGrid,
      active: pathname.startsWith(`/${locale}/categories`),
    },
    {
      href: `/${locale}/products`,
      label: dict.nav.search,
      icon: Search,
      active:
        pathname === `/${locale}/products` ||
        pathname.startsWith(`/${locale}/products/`),
    },
    {
      href: `/${locale}/cart`,
      label: dict.nav.cart,
      icon: ShoppingCart,
      badge: itemCount,
      active: pathname === `/${locale}/cart`,
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label={dict.nav.menu}
    >
      <div className="grid h-16 grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === `/${locale}`
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="relative">
                <Icon className="size-5" />
                {item.badge ? (
                  <span className="absolute -top-1.5 -end-2 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                ) : null}
              </span>
              {item.label}
            </Link>
          );
        })}
        <MobileNav categories={categories} variant="bottom" />
      </div>
    </nav>
  );
}