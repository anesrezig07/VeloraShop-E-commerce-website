"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/client";
import { locales, type Locale } from "@/i18n/config";

const LOCALE_SHORT: Record<Locale, string> = {
  fr: "FR",
  ar: "AR",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border bg-muted/50 p-0.5 text-xs"
      role="group"
      aria-label="Langue / اللغة"
    >
      {locales.map((l) => {
        const target =
          pathname.replace(`/${locale}`, `/${l}`) || `/${l}`;
        const active = l === locale;
        return (
          <Link
            key={l}
            href={target}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-2.5 py-1 font-semibold transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {LOCALE_SHORT[l]}
          </Link>
        );
      })}
    </div>
  );
}