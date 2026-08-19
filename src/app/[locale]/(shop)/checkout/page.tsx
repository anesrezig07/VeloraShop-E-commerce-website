import { Metadata } from "next";
import Link from "next/link";

import { CheckoutForm } from "@/components/storefront/checkout/checkout-form";
import { Button } from "@/components/ui/button";
import { getDeliveryOptions } from "@/lib/data/delivery";
import { getDictionary, getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.checkout.title };
}

export default async function CheckoutPage() {
  const dict = await getDictionary();
  const currentLocale = await getLocale();
  const deliveryOptions = await getDeliveryOptions();

  if (deliveryOptions.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold">
          {dict.checkout.unavailable}
        </h1>
        <p className="text-sm text-muted-foreground">{dict.admin.notConfigured}</p>
        <Button variant="outline" render={<Link href={`/${currentLocale}/products`} />}>
          {dict.cart.startShopping}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 lg:px-6">
      <CheckoutForm deliveryOptions={deliveryOptions} />
    </div>
  );
}