import { toNumber } from "@/lib/coerce";

export interface Priceable {
  price: number;
  sale_price: number | null;
}

export function getEffectivePrice(
  product: Priceable,
  variantPriceOverride: number | null = null,
): number {
  const override = toNumber(variantPriceOverride);
  if (override > 0) return override;
  const sale = toNumber(product.sale_price);
  if (sale > 0) return sale;
  return toNumber(product.price);
}

export function getDiscountPercent(
  price: number,
  salePrice: number,
): number | null {
  const list = toNumber(price);
  const sale = toNumber(salePrice);
  if (list <= 0 || sale <= 0 || sale >= list) return null;
  return Math.round(((list - sale) / list) * 100);
}