import { ArrowRight, PackageCheck, Truck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero({
  locale,
  dict,
}: {
  locale: "fr" | "ar";
  dict: {
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    heroSecondaryCta: string;
    heroDeliveryEta: string;
    heroVerifyAtReception: string;
  };
}) {
  return (
    <section className="relative overflow-hidden border-b">
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background"
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center lg:px-6 lg:py-24">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <PackageCheck className="size-3.5 text-primary" />
            COD · 58 Wilayas
          </p>
          <h1 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {dict.heroTitle}
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
            {dict.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              render={<Link href={`/${locale}/products`} />}
            >
              {dict.heroCta}
              <ArrowRight data-icon="inline-end" className="rtl:rotate-180" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href={`/${locale}/categories`} />}
            >
              {dict.heroSecondaryCta}
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="size-4 text-primary" />
              {dict.heroDeliveryEta}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <PackageCheck className="size-4 text-primary" />
              {dict.heroVerifyAtReception}
            </span>
          </div>
        </div>

        <div
          className="relative hidden aspect-square overflow-hidden rounded-2xl border bg-muted lg:block"
          aria-hidden="true"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl font-black text-primary/15">V</span>
          </div>
        </div>
      </div>
    </section>
  );
}