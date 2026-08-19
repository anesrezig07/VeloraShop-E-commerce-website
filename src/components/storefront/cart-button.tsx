"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { useCart } from "@/lib/cart/store";
import { useDictionary, useLocale } from "@/i18n/client";

export function CartButton() {
  const { itemCount } = useCart();
  const locale = useLocale();
  const dict = useDictionary();

  return (
    <Link
      href={`/${locale}/cart`}
      className={buttonVariants({ variant: "outline", size: "sm", className: "relative" })}
      aria-label={dict.nav.cart}
    >
      <span
        key={itemCount}
        data-icon="inline-start"
        className={itemCount > 0 ? "animate-pop" : undefined}
      >
        <ShoppingCart className="size-4" />
      </span>
      <span className="hidden sm:inline">{dict.nav.cart}</span>
      {itemCount > 0 ? (
        <span
          className="absolute -top-1.5 -end-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
          aria-label={`${itemCount} ${dict.cart.itemCountPlural.replace("{count}", String(itemCount))}`}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}