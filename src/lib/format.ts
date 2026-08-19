import type { Locale } from "@/i18n/config";

export function formatPrice(amount: number, locale: Locale = "fr"): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(Math.round(safeAmount));

  return locale === "ar" ? `${formatted} دج` : `${formatted} DA`;
}

export function formatDiscountPercent(
  price: number,
  salePrice: number,
): number | null {
  if (!Number.isFinite(price) || !Number.isFinite(salePrice)) return null;
  if (price <= 0 || salePrice >= price || salePrice <= 0) return null;
  return Math.round(((price - salePrice) / price) * 100);
}

export function formatDate(date: string | Date, locale: Locale = "fr"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date, locale: Locale = "fr"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatEstimatedDelivery(
  min: number,
  max: number,
  locale: Locale = "fr",
): string {
  if (min === max) {
    return locale === "ar" ? `${min} يوم` : `${min} jour${min > 1 ? "s" : ""}`;
  }
  return locale === "ar"
    ? `${min} إلى ${max} أيام`
    : `${min} à ${max} jours`;
}
