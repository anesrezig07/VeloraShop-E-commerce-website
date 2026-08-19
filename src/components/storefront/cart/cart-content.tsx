"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Price } from "@/components/storefront/price";
import { useCart } from "@/lib/cart/store";
import { useDictionary, useLocale } from "@/i18n/client";
import { formatPrice } from "@/lib/format";

export function CartContent() {
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart();
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <ShoppingBag className="size-7" />
        </span>
        <div>
          <h1 className="font-heading text-xl font-bold">{dict.cart.emptyTitle}</h1>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {dict.cart.emptyDescription}
          </p>
        </div>
        <Button size="lg" render={<Link href={`/${locale}/products`} />}>
          {dict.cart.startShopping}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          {dict.cart.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {itemCount > 1
            ? dict.cart.itemCountPlural.replace("{count}", String(itemCount))
            : dict.cart.itemCount.replace("{count}", String(itemCount))}
        </p>

        <ul className="mt-6 flex flex-col gap-4">
          {items.map((item) => {
            const href = `/${locale}/products/${item.slug}`;
            return (
              <li
                key={`${item.productId}-${item.variantId ?? ""}`}
                className="flex gap-4 rounded-xl border bg-card p-3 sm:p-4"
              >
                <Link href={href} className="shrink-0">
                  {item.imageUrl ? (
                    <div className="relative size-20 sm:size-24">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="rounded-lg border object-cover"
                      />
                    </div>
                  ) : (
                    <span className="flex size-20 items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground sm:size-24">
                      Velora
                    </span>
                  )}
                </Link>

                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={href}
                        className="font-medium leading-snug hover:underline"
                      >
                        {item.name}
                      </Link>
                      {item.variantName ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.variantName}
                        </p>
                      ) : null}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeItem(item.productId, item.variantId)}
                      aria-label={`${dict.cart.remove} ${item.name}`}
                    >
                      <Trash2 />
                    </Button>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        onClick={() =>
                          updateQuantity(item.productId, item.variantId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        aria-label={dict.common.previous}
                      >
                        <Minus />
                      </Button>
                      <span
                        className="w-8 text-center text-sm tabular-nums"
                        aria-live="polite"
                      >
                        {item.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        onClick={() =>
                          updateQuantity(item.productId, item.variantId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.maxStock}
                        aria-label={dict.common.next}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <Price
                      value={item.unitPrice * item.quantity}
                      locale={locale}
                      size="sm"
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6">
          <Button variant="outline" render={<Link href={`/${locale}/products`} />}>
            {dict.cart.continueShopping}
          </Button>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-heading text-lg font-bold">{dict.cart.orderSummary}</h2>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">{dict.cart.subtotal}</dt>
              <dd className="font-medium tabular-nums">
                {formatPrice(subtotal, locale)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">{dict.cart.deliveryFee}</dt>
              <dd className="text-muted-foreground">
                {dict.cart.deliveryCalculatedAtCheckout}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <dt className="font-semibold">{dict.cart.total}</dt>
              <dd className="text-lg font-bold tabular-nums">
                {formatPrice(subtotal, locale)}
              </dd>
            </div>
          </dl>
          <Button
            size="lg"
            className="mt-5 w-full"
            onClick={() => router.push(`/${locale}/checkout`)}
          >
            {dict.cart.proceedToCheckout}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {dict.cart.freeDeliveryMessage}
          </p>
        </div>
      </aside>
    </div>
  );
}