import { ArrowRight, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { primaryImage, type CatalogProduct } from "@/lib/data/products";

export function Hero({
  locale,
  dict,
  featuredProduct,
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
  featuredProduct?: CatalogProduct | null;
}) {
  const image = featuredProduct ? primaryImage(featuredProduct.images ?? []) : null;
  const productName = featuredProduct
    ? locale === "ar"
      ? featuredProduct.name_ar
      : featuredProduct.name_fr
    : null;

  return (
    <section className="relative overflow-hidden border-b">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center lg:px-6 lg:py-20">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <PackageCheck className="size-3.5" />
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
              <ShieldCheck className="size-4 text-primary" />
              {dict.heroVerifyAtReception}
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border bg-muted shadow-premium">
            {image ? (
              <div className="relative aspect-[4/3]">
                <Image
                  src={image}
                  alt={productName ?? ""}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center">
                <span className="text-7xl font-black text-primary/15">V</span>
              </div>
            )}
            {featuredProduct ? (
              <Link
                href={`/${locale}/products/${featuredProduct.slug}`}
                className="absolute bottom-4 start-4 flex max-w-[80%] items-center gap-3 rounded-xl border bg-background/95 p-3 shadow-card backdrop-blur transition-transform hover:scale-[1.02]"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {productName}
                  </span>
                  <span className="block text-xs text-primary">
                    {locale === "ar" ? "اكتشف الآن" : "Découvrir"}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 rtl:rotate-180" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}