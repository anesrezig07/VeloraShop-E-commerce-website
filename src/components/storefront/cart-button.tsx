"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/store";
import { useDictionary, useLocale } from "@/i18n/client";

export function CartButton() {
  const { itemCount } = useCart();
  const locale = useLocale();
  const dict = useDictionary();

  return (
    <Button
      variant="outline"
      size="sm"
      className="relative"
      render={<Link href={`/${locale}/cart`} />}
      aria-label={dict.nav.cart}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
        aria-hidden="true"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      <span>{dict.nav.cart}</span>
      {itemCount > 0 ? (
        <span
          className="absolute -top-1.5 -end-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
          aria-label={`${itemCount} ${dict.cart.itemCountPlural.replace("{count}", String(itemCount))}`}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Button>
  );
}