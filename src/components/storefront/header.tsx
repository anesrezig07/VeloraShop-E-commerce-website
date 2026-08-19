import Link from "next/link";

import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { CartButton } from "@/components/storefront/cart-button";
import { CategoriesMenu } from "@/components/storefront/categories-menu";
import { HeaderShell } from "@/components/storefront/header-shell";
import { LanguageSwitcher } from "@/components/storefront/language-switcher";
import { MobileNav } from "@/components/storefront/mobile-nav";
import { SearchBar } from "@/components/storefront/search-bar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/i18n/server";
import type { Category } from "@/lib/types";

export async function Header({
  locale,
  categories,
}: {
  locale: "fr" | "ar";
  categories: Category[];
}) {
  const dict = await getDictionary();

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/products`, label: dict.nav.products },
  ];

  return (
    <HeaderShell>
      <AnnouncementBar />

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:px-6">
        <div className="lg:hidden">
          <MobileNav
            categories={categories.map((category) => ({
              slug: category.slug,
              name: locale === "ar" ? category.name_ar : category.name_fr,
            }))}
          />
        </div>

        <Link
          href={`/${locale}`}
          className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight"
          aria-label="Velora Shop"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground shadow-card">
            V
          </span>
          <span>
            Velora<span className="text-primary">.</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label={dict.nav.menu}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              {link.label}
            </Link>
          ))}
          <CategoriesMenu
            categories={categories.map((category) => ({
              slug: category.slug,
              name: locale === "ar" ? category.name_ar : category.name_fr,
            }))}
          />
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <SearchBar className="hidden w-48 md:block lg:w-64" />
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          <CartButton />
        </div>
      </div>
    </HeaderShell>
  );
}