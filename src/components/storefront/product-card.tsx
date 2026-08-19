import Link from "next/link";

import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { Price } from "@/components/storefront/price";
import { primaryImage, type CatalogProduct } from "@/lib/data/products";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDiscountPercent } from "@/lib/format";
import { getEffectivePrice } from "@/lib/pricing";
import { toNumber } from "@/lib/coerce";
import { ProductImage } from "@/components/storefront/product-image";

export function ProductCard({
  product,
  locale,
  dict,
}: {
  product: CatalogProduct;
  locale: "fr" | "ar";
  dict: {
    inStock: string;
    outOfStock: string;
    lowStock: string;
    soldOut: string;
    new: string;
    promotion: string;
    bestSeller: string;
  };
}) {
  const image = primaryImage(product.images ?? []);
  const name = locale === "ar" ? product.name_ar : product.name_fr;
  const price = toNumber(product.price);
  const salePrice = toNumber(product.sale_price);
  const effective = getEffectivePrice(product);
  const discount = salePrice > 0 ? formatDiscountPercent(price, salePrice) : null;
  const stock = toNumber(product.stock);
  const outOfStock = stock <= 0;
  const lowStock = stock > 0 && stock <= 5;
  const href = `/${locale}/products/${product.slug}`;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md",
        outOfStock && "opacity-90",
      )}
    >
      <Link
        href={href}
        className="absolute inset-0 z-10"
        aria-label={name}
        tabIndex={-1}
      />
      <div className="relative">
        <ProductImage src={image} alt={name} />
        <div className="absolute start-2 top-2 z-20 flex flex-col gap-1.5">
          {discount ? (
            <Badge variant="destructive" className="pointer-events-none">
              -{discount}%
            </Badge>
          ) : null}
          {outOfStock ? (
            <Badge variant="secondary" className="pointer-events-none">
              {dict.soldOut}
            </Badge>
          ) : null}
        </div>
        <div className="absolute end-2 top-2 z-20 flex flex-col items-end gap-1.5">
          {product.is_best_seller ? (
            <Badge variant="secondary" className="pointer-events-none">
              {dict.bestSeller}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {name}
        </h3>
        <div className="flex items-baseline justify-between gap-2">
          <Price value={effective} compareAt={discount ? price : null} locale={locale} size="sm" />
        </div>
        <p
          className={cn(
            "text-xs",
            outOfStock ? "text-destructive" : lowStock ? "text-amber-600" : "text-muted-foreground",
          )}
        >
          {outOfStock
            ? dict.outOfStock
            : lowStock
              ? dict.lowStock
              : dict.inStock}
        </p>
        <div className="relative z-20 mt-auto pt-2">
          <AddToCartButton
            product={{
              id: product.id,
              name,
              slug: product.slug,
              stock,
              imageUrl: image,
            }}
            unitPrice={effective}
            size="sm"
            className="w-full"
          />
        </div>
      </div>
    </article>
  );
}