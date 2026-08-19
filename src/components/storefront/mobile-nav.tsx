"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/storefront/language-switcher";
import { SearchBar } from "@/components/storefront/search-bar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDictionary, useLocale } from "@/i18n/client";
import { cn } from "@/lib/utils";

export function MobileNav({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const dict = useDictionary();
  const locale = useLocale();
  const pathname = usePathname();

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/products`, label: dict.nav.products },
    { href: `/${locale}/categories`, label: dict.nav.categories },
    { href: `/${locale}/cart`, label: dict.nav.cart },
  ];

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" size="icon" aria-label={dict.nav.menu} />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>{dict.nav.menu}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-6">
          <SearchBar />
          <nav aria-label={dict.nav.menu}>
            <ul className="flex flex-col gap-1">
              {links.map((link) => {
                const active =
                  link.href === `/${locale}`
                    ? pathname === link.href
                    : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          {categories.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {dict.nav.categories}
              </p>
              <ul className="flex flex-col gap-1">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/${locale}/categories/${category.slug}`}
                      className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="mt-auto pt-2">
            <LanguageSwitcher />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}