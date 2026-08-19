"use client";

import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/store";
import { useDictionary, useLocale } from "@/i18n/client";
import { cn } from "@/lib/utils";

export interface BuyBoxVariant {
  id: string;
  name: string;
  price_override: number | null;
  stock: number;
}

export function BuyBox({
  product,
  variants,
  basePrice,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    stock: number;
    imageUrl: string | null;
  };
  variants: BuyBoxVariant[];
  basePrice: number;
}) {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const { addItem } = useCart();

  const activeVariants = useMemo(
    () => variants.filter((variant) => variant.stock > 0),
    [variants],
  );

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    activeVariants[0]?.id ?? null,
  );
  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ?? null;

  const availableStock = selectedVariant ? selectedVariant.stock : product.stock;
  const unitPrice = selectedVariant?.price_override ?? basePrice;
  const [quantity, setQuantity] = useState(1);

  const clampedQuantity = Math.min(quantity, Math.max(1, availableStock));
  const outOfStock = availableStock <= 0;
  const lowStock = availableStock > 0 && availableStock <= 5;

  function setQuantitySafe(next: number) {
    setQuantity(Math.max(1, Math.min(next, Math.max(1, availableStock))));
  }

  function handleBuyNow() {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      variantName: selectedVariant?.name ?? null,
      slug: product.slug,
      imageUrl: product.imageUrl,
      unitPrice,
      quantity: clampedQuantity,
      maxStock: Math.max(1, availableStock),
    });
    router.push(`/${locale}/cart`);
  }

  return (
    <div className="flex flex-col gap-5">
      {variants.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            {dict.product.variants}
            {selectedVariant ? (
              <span className="ms-1 text-muted-foreground">
                {selectedVariant.name}
              </span>
            ) : null}
          </p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={dict.product.variants}>
            {variants.map((variant) => {
              const disabled = variant.stock <= 0;
              const selected = variant.id === selectedVariantId;
              return (
                <button
                  key={variant.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={disabled}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                    disabled &&
                      "cursor-not-allowed opacity-40 line-through hover:border-border hover:text-muted-foreground",
                  )}
                >
                  {variant.name}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">{dict.product.quantity}</p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setQuantitySafe(quantity - 1)}
            disabled={quantity <= 1 || outOfStock}
            aria-label={dict.common.previous}
          >
            <Minus />
          </Button>
          <input
            type="number"
            min={1}
            max={Math.max(1, availableStock)}
            value={clampedQuantity}
            onChange={(event) =>
              setQuantitySafe(Number(event.target.value))
            }
            className="h-8 w-16 rounded-lg border bg-background text-center text-sm tabular-nums outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label={dict.product.quantity}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setQuantitySafe(quantity + 1)}
            disabled={quantity >= availableStock || outOfStock}
            aria-label={dict.common.next}
          >
            <Plus />
          </Button>
        </div>
        <p
          className={cn(
            "text-xs",
            outOfStock
              ? "text-destructive"
              : lowStock
                ? "text-amber-600"
                : "text-muted-foreground",
          )}
        >
          {outOfStock
            ? dict.common.outOfStock
            : lowStock
              ? dict.product.stockLimited.replace("{count}", String(availableStock))
              : `${availableStock} ${dict.product.stockAvailable}`}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <AddToCartButton
          product={product}
          unitPrice={unitPrice}
          variantId={selectedVariant?.id ?? null}
          variantName={selectedVariant?.name ?? null}
          quantity={clampedQuantity}
          size="lg"
          className="flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={handleBuyNow}
          disabled={outOfStock}
        >
          {dict.product.buyNow}
        </Button>
      </div>
    </div>
  );
}