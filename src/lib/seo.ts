import type { Metadata } from "next";

import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { SITE_URL } from "@/lib/constants";

export function localeAlternates(
  path: string,
  locale: Locale,
): Metadata["alternates"] {
  const languages: Record<string, string> = {
    "x-default": SITE_URL,
  };
  for (const l of locales) {
    languages[l] = `${SITE_URL}/${l}${path}`;
  }
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages,
  };
}