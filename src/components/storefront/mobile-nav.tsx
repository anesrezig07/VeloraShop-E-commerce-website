"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/storefront/language-switcher";
import { SearchBar } from "@/components/storefront/search-bar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
  variant = "button",
}: {
  categories: { slug: string; name: string }[];
  variant?: "button" | "bottom";
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
          variant === "bottom" ? (
            <span
              className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              aria-label={dict.nav.menu}
            />
          ) : (
            <Button variant="outline" size="icon" aria-label={dict.nav.menu} />
          )
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(20rem,85vw)]">
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
          <div className="mt-auto flex items-center justify-between border-t pt-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}