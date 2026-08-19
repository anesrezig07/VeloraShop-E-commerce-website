import Link from "next/link";

import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { Price } from "@/components/storefront/price";
import { WishlistButton } from "@/components/storefront/wishlist-button";
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
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-premium",
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
            <Badge
              className="pointer-events-none bg-sale text-sale-foreground"
              variant="secondary"
            >
              -{discount}%
            </Badge>
          ) : null}
          {outOfStock ? (
            <Badge variant="secondary" className="pointer-events-none">
              {dict.soldOut}
            </Badge>
          ) : lowStock ? (
            <Badge variant="secondary" className="pointer-events-none opacity-90">
              {dict.lowStock}
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
        <div className="absolute end-2 bottom-2 z-20 opacity-0 transition-all duration-300 group-hover:opacity-100 focus-within:opacity-100">
          <WishlistButton
            productId={product.id}
            name={name}
            slug={product.slug}
            imageUrl={image}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {name}
        </h3>
        <div className="flex items-baseline justify-between gap-2">
          <Price
            value={effective}
            compareAt={discount ? price : null}
            locale={locale}
            size="sm"
          />
        </div>
        <p
          className={cn(
            "text-xs",
            outOfStock
              ? "text-destructive"
              : lowStock
                ? "text-amber-600 dark:text-amber-400"
                : "text-muted-foreground",
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