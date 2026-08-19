export const locales = ["fr", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export function isLocale(value: string | undefined): value is Locale {
  return value === "fr" || value === "ar";
}

export function isRtlLocale(locale: Locale): boolean {
  return locale === "ar";
}
