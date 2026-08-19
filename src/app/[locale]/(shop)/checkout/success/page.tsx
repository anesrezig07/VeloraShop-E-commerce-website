import { CheckCircle2, PhoneCall } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getDictionary, getLocale } from "@/i18n/server";
import { formatEstimatedDelivery, formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage(
  props: PageProps<"/[locale]/checkout/success">,
) {
  const searchParams = await props.searchParams;
  const dict = await getDictionary();
  const currentLocale = await getLocale();

  const orderNumber =
    typeof searchParams.order === "string" ? searchParams.order : null;
  const total = Number(searchParams.total ?? 0);
  const etaMin = Number(searchParams.etaMin ?? 1);
  const etaMax = Number(searchParams.etaMax ?? 5);

  if (!orderNumber) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-8" />
      </span>
      <h1 className="mt-6 font-heading text-3xl font-extrabold tracking-tight">
        {dict.confirmation.title}
      </h1>
      <p className="mt-3 max-w-lg text-sm text-muted-foreground">
        {dict.confirmation.subtitle}
      </p>

      <div className="mt-8 grid w-full max-w-md gap-4 rounded-xl border bg-card p-6 text-start sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {dict.confirmation.orderNumber}
          </p>
          <p className="mt-1 text-lg font-bold tabular-nums">{orderNumber}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {dict.confirmation.totalAmount}
          </p>
          <p className="mt-1 text-lg font-bold tabular-nums">
            {formatPrice(total, currentLocale)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {dict.confirmation.deliveryEstimate}
          </p>
          <p className="mt-1 text-sm font-medium">
            {formatEstimatedDelivery(etaMin, etaMax, currentLocale)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {dict.confirmation.payment}
          </p>
          <p className="mt-1 text-sm font-medium">{dict.home.codTitle}</p>
        </div>
      </div>

      <div className="mt-8 w-full max-w-md rounded-xl border bg-card p-6 text-start">
        <h2 className="text-sm font-semibold">{dict.confirmation.nextSteps}</h2>
        <ol className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
          <li>1. {dict.confirmation.nextStep1}</li>
          <li>2. {dict.confirmation.nextStep2}</li>
          <li>3. {dict.confirmation.nextStep3}</li>
        </ol>
      </div>

      <div className="mt-8 w-full max-w-md rounded-xl border bg-muted/50 p-5 text-start">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <PhoneCall className="size-4 text-primary" />
          {dict.confirmation.contactOption}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {dict.confirmation.contactOptionDesc}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" render={<Link href={`/${currentLocale}`} />}>
          {dict.confirmation.backHome}
        </Button>
        <Button
          variant="outline"
          size="lg"
          render={<Link href={`/${currentLocale}/products`} />}
        >
          {dict.confirmation.backToShop}
        </Button>
      </div>
    </div>
  );
}