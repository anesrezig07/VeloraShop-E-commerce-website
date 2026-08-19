"use client";

import { ArrowLeft, HandCoins, Truck, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createOrder } from "@/lib/actions/orders";
import { checkoutSchema, type CheckoutValues } from "@/lib/validators";
import { useCart } from "@/lib/cart/store";
import { useDictionary, useLocale } from "@/i18n/client";
import { formatEstimatedDelivery, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DeliveryRateWithWilaya } from "@/lib/types";

interface CheckoutFormProps {
  deliveryOptions: DeliveryRateWithWilaya[];
}

export function CheckoutForm({ deliveryOptions }: CheckoutFormProps) {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [isPending, startTransition] = useTransition();

  const [values, setValues] = useState<CheckoutValues>({
    customerName: "",
    customerPhone: "",
    wilayaId: 0,
    commune: "",
    shippingAddress: "",
    deliveryType: "home",
    notes: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);

  const selectedRate = deliveryOptions.find(
    (rate) => rate.wilaya_id === values.wilayaId,
  );
  const deliveryFee = selectedRate
    ? values.deliveryType === "home"
      ? selectedRate.home_fee
      : selectedRate.stop_desk_fee
    : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
        <p className="font-medium">{dict.checkout.emptyCart}</p>
        <Button variant="outline" render={<Link href={`/${locale}/products`} />}>
          {dict.cart.startShopping}
        </Button>
      </div>
    );
  }

  function update<K extends keyof CheckoutValues>(key: K, value: CheckoutValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    if (fieldErrors[String(key)]) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[String(key)];
        return next;
      });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setNotConfigured(false);

    const parsed = checkoutSchema.safeParse(values);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!errors[path]) errors[path] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    const cartItems = items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
    }));

    startTransition(async () => {
      const result = await createOrder(parsed.data, cartItems, locale);
      if (result.ok) {
        clear();
        const params = new URLSearchParams({
          order: result.orderNumber,
          total: String(result.total),
          etaMin: String(selectedRate?.estimated_days_min ?? 1),
          etaMax: String(selectedRate?.estimated_days_max ?? 5),
        });
        router.push(`/${locale}/checkout/success?${params.toString()}`);
      } else if (result.notConfigured) {
        setNotConfigured(true);
        setFormError(dict.checkout.unavailable);
      } else if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      } else {
        setFormError(
          result.formError === "emptyCart"
            ? dict.checkout.emptyCart
            : dict.checkout.orderError,
        );
      }
    });
  }

  const inputClassName = (hasError: boolean) =>
    cn(hasError && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20");

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 lg:grid-cols-[1fr_360px]"
      noValidate
    >
      <div>
        <div className="mb-6">
          <Link
            href={`/${locale}/cart`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {dict.checkout.backToCart}
          </Link>
          <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {dict.checkout.title}
          </h1>
        </div>

        {notConfigured ? (
          <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
            {dict.admin.notConfigured}
          </div>
        ) : null}

        <div className="flex flex-col gap-6">
          <fieldset className="rounded-xl border bg-card p-5">
            <legend className="px-1 text-sm font-semibold">
              {dict.checkout.contactInformation}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="customerName">{dict.checkout.fullName}</Label>
                <Input
                  id="customerName"
                  autoComplete="name"
                  value={values.customerName}
                  onChange={(event) => update("customerName", event.target.value)}
                  placeholder={dict.checkout.fullNamePlaceholder}
                  className={inputClassName(Boolean(fieldErrors.customerName))}
                  aria-invalid={Boolean(fieldErrors.customerName)}
                />
                {fieldErrors.customerName ? (
                  <p className="text-xs text-destructive">
                    {dict.checkout[
                      fieldErrors.customerName as keyof typeof dict.checkout
                    ] ?? dict.checkout.customerNameRequired}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="customerPhone">{dict.checkout.phone}</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  autoComplete="tel"
                  dir="ltr"
                  inputMode="numeric"
                  value={values.customerPhone}
                  onChange={(event) => update("customerPhone", event.target.value)}
                  placeholder={dict.checkout.phonePlaceholder}
                  className={inputClassName(Boolean(fieldErrors.customerPhone))}
                  aria-invalid={Boolean(fieldErrors.customerPhone)}
                />
                <p className="text-xs text-muted-foreground">{dict.checkout.phoneHint}</p>
                {fieldErrors.customerPhone ? (
                  <p className="text-xs text-destructive">
                    {dict.checkout[
                      fieldErrors.customerPhone as keyof typeof dict.checkout
                    ] ?? dict.checkout.phoneInvalid}
                  </p>
                ) : null}
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-xl border bg-card p-5">
            <legend className="px-1 text-sm font-semibold">
              {dict.checkout.deliveryAddress}
            </legend>
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="wilayaId">{dict.checkout.wilaya}</Label>
                  <select
                    id="wilayaId"
                    value={values.wilayaId}
                    onChange={(event) => update("wilayaId", Number(event.target.value))}
                    className={cn(
                      "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-placeholder:text-muted-foreground",
                      values.wilayaId === 0 && "text-muted-foreground",
                      inputClassName(Boolean(fieldErrors.wilayaId)),
                    )}
                    aria-invalid={Boolean(fieldErrors.wilayaId)}
                  >
                    <option value={0}>{dict.checkout.wilayaPlaceholder}</option>
                    {deliveryOptions.map((rate) => (
                      <option key={rate.wilaya_id} value={rate.wilaya_id}>
                        {locale === "ar"
                          ? rate.wilaya.name_ar
                          : `${rate.wilaya.code} — ${rate.wilaya.name_fr}`}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.wilayaId ? (
                    <p className="text-xs text-destructive">
                      {dict.checkout[
                        fieldErrors.wilayaId as keyof typeof dict.checkout
                      ] ?? dict.checkout.wilayaRequired}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="commune">{dict.checkout.commune}</Label>
                  <Input
                    id="commune"
                    value={values.commune}
                    onChange={(event) => update("commune", event.target.value)}
                    placeholder={dict.checkout.communePlaceholder}
                    className={inputClassName(Boolean(fieldErrors.commune))}
                    aria-invalid={Boolean(fieldErrors.commune)}
                  />
                  {fieldErrors.commune ? (
                    <p className="text-xs text-destructive">
                      {dict.checkout[
                        fieldErrors.commune as keyof typeof dict.checkout
                      ] ?? dict.checkout.communeRequired}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="shippingAddress">{dict.checkout.address}</Label>
                <Textarea
                  id="shippingAddress"
                  rows={3}
                  value={values.shippingAddress}
                  onChange={(event) => update("shippingAddress", event.target.value)}
                  placeholder={dict.checkout.addressPlaceholder}
                  className={inputClassName(Boolean(fieldErrors.shippingAddress))}
                  aria-invalid={Boolean(fieldErrors.shippingAddress)}
                />
                {fieldErrors.shippingAddress ? (
                  <p className="text-xs text-destructive">
                    {dict.checkout[
                      fieldErrors.shippingAddress as keyof typeof dict.checkout
                    ] ?? dict.checkout.addressRequired}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">{dict.checkout.notes}</Label>
                <Textarea
                  id="notes"
                  rows={2}
                  value={values.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  placeholder={dict.checkout.notesPlaceholder}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-xl border bg-card p-5">
            <legend className="px-1 text-sm font-semibold">
              {dict.checkout.deliveryMethod}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={dict.checkout.deliveryMethod}>
              {(
                [
                  { type: "home", icon: Truck },
                  { type: "stop_desk", icon: Store },
                ] as const
              ).map((option) => {
                const active = values.deliveryType === option.type;
                const fee = selectedRate
                  ? option.type === "home"
                    ? selectedRate.home_fee
                    : selectedRate.stop_desk_fee
                  : null;
                return (
                  <label
                    key={option.type}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                      active
                        ? "border-primary bg-primary/5"
                        : "hover:border-foreground/30",
                    )}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      value={option.type}
                      checked={active}
                      onChange={() => update("deliveryType", option.type)}
                      className="mt-0.5 accent-[var(--primary)]"
                    />
                    <div className="flex-1">
                      <p className="flex items-center gap-1.5 text-sm font-semibold">
                        <option.icon className="size-4 text-primary" />
                        {option.type === "home"
                          ? dict.checkout.homeDelivery
                          : dict.checkout.stopDesk}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {option.type === "home"
                          ? dict.checkout.homeDeliveryDesc
                          : dict.checkout.stopDeskDesc}
                      </p>
                      {fee !== null ? (
                        <p className="mt-1 text-sm font-medium tabular-nums">
                          +{formatPrice(fee, locale)}
                        </p>
                      ) : null}
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-heading text-lg font-bold">{dict.checkout.orderSummary}</h2>

          <ul className="mt-4 flex max-h-72 flex-col gap-3 overflow-y-auto">
            {items.map((item) => (
              <li key={`${item.productId}-${item.variantId ?? ""}`} className="flex gap-3">
                {item.imageUrl ? (
                  <div className="relative size-12 shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="rounded-lg border object-cover"
                    />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  {item.variantName ? (
                    <p className="text-xs text-muted-foreground">{item.variantName}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium tabular-nums">
                  {formatPrice(item.unitPrice * item.quantity, locale)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 flex flex-col gap-3 border-t pt-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">{dict.cart.subtotal}</dt>
              <dd className="font-medium tabular-nums">
                {formatPrice(subtotal, locale)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">{dict.cart.deliveryFee}</dt>
              <dd className="font-medium tabular-nums">
                {selectedRate ? formatPrice(deliveryFee, locale) : "—"}
              </dd>
            </div>
            {selectedRate ? (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <dt>
                  {dict.confirmation.deliveryEstimate} :{" "}
                  {formatEstimatedDelivery(
                    selectedRate.estimated_days_min,
                    selectedRate.estimated_days_max,
                    locale,
                  )}
                </dt>
              </div>
            ) : null}
            <div className="flex items-center justify-between border-t pt-3">
              <dt className="font-semibold">{dict.cart.total}</dt>
              <dd className="text-lg font-bold tabular-nums">
                {formatPrice(total, locale)}
              </dd>
            </div>
          </dl>

          <Button type="submit" size="lg" className="mt-5 w-full" disabled={isPending}>
            {isPending ? dict.checkout.submitting : dict.checkout.placeOrder}
          </Button>

          {formError ? (
            <p className="mt-3 text-center text-sm text-destructive">{formError}</p>
          ) : null}

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <HandCoins className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>{dict.checkout.paymentInfoDescription}</p>
          </div>
        </div>
      </aside>
    </form>
  );
}