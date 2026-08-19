import Link from "next/link";

import { getDictionary } from "@/i18n/server";
import type { Category } from "@/lib/types";

export async function Footer({
  locale,
  categories,
}: {
  locale: "fr" | "ar";
  categories: Category[];
}) {
  const dict = await getDictionary();

  const shopLinks = [
    { href: `/${locale}/products`, label: dict.nav.allProducts },
    { href: `/${locale}/categories`, label: dict.nav.categories },
  ];

  return (
    <footer className="border-t bg-card/60">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 text-xl font-extrabold tracking-tight"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground shadow-card">
                V
              </span>
              Velora<span className="text-primary">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {dict.footer.aboutText}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{dict.footer.shop}</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{dict.footer.categories}</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/${locale}/categories/${category.slug}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {locale === "ar" ? category.name_ar : category.name_fr}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{dict.footer.contact}</h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                {dict.footer.paymentMethods}
              </li>
              <li className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                {dict.footer.securePayment}
              </li>
              <li className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                {dict.footer.deliveryInfo}
              </li>
              <li className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                {dict.footer.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} Velora Shop · {dict.footer.rights}
          </p>
          <p className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success" />
            {dict.footer.securePayment}
          </p>
        </div>
      </div>
    </footer>
  );
}