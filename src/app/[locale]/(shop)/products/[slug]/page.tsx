import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BuyBox } from "@/components/storefront/buy-box";
import { Price } from "@/components/storefront/price";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductGrid } from "@/components/storefront/product-grid";
import { SectionHeader } from "@/components/storefront/section-header";
import { Badge } from "@/components/ui/badge";
import { getRelatedProducts, getProductBySlug, primaryImage } from "@/lib/data/products";
import { getDictionary, getLocale } from "@/i18n/server";
import { formatDiscountPercent } from "@/lib/format";
import { getEffectivePrice } from "@/lib/pricing";
import { toNumber } from "@/lib/coerce";

export async function generateMetadata(
  props: PageProps<"/[locale]/products/[slug]">,
): Promise<Metadata> {
  const params = await props.params;
  const currentLocale = await getLocale();
  const product = await getProductBySlug(params.slug);

  if (!product) return { title: "Produit" };

  const name = currentLocale === "ar" ? product.name_ar : product.name_fr;
  const description =
    currentLocale === "ar" ? product.description_ar : product.description_fr;

  return {
    title: name,
    description: description.slice(0, 160),
    openGraph: {
      title: name,
      description: description.slice(0, 160),
      images: primaryImage(product.images ?? [])
        ? [{ url: primaryImage(product.images ?? [])! }]
        : undefined,
    },
  };
}

export default async function ProductPage(
  props: PageProps<"/[locale]/products/[slug]">,
) {
  const params = await props.params;
  const dict = await getDictionary();
  const currentLocale = await getLocale();

  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const name = currentLocale === "ar" ? product.name_ar : product.name_fr;
  const description =
    currentLocale === "ar" ? product.description_ar : product.description_fr;
  const categoryName = product.category
    ? currentLocale === "ar"
      ? product.category.name_ar
      : product.category.name_fr
    : null;

  const image = primaryImage(product.images ?? []);
  const price = toNumber(product.price);
  const salePrice = toNumber(product.sale_price);
  const basePrice = getEffectivePrice(product);
  const discount = salePrice > 0 ? formatDiscountPercent(price, salePrice) : null;
  const stock = toNumber(product.stock);

  const [related] = await Promise.all([getRelatedProducts(product, 4)]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description.slice(0, 160),
    image: image ?? undefined,
    offers: {
      "@type": "Offer",
      price: basePrice,
      priceCurrency: "DZD",
      availability: stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 lg:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-muted-foreground" aria-label="breadcrumb">
        <Link href={`/${currentLocale}`} className="hover:text-foreground">
          {dict.nav.home}
        </Link>
        <span aria-hidden="true"> / </span>
        <Link
          href={`/${currentLocale}/products`}
          className="hover:text-foreground"
        >
          {dict.nav.products}
        </Link>
        {product.category ? (
          <>
            <span aria-hidden="true"> / </span>
            <Link
              href={`/${currentLocale}/categories/${product.category.slug}`}
              className="hover:text-foreground"
            >
              {categoryName}
            </Link>
          </>
        ) : null}
        <span aria-hidden="true"> / </span>
        <span className="text-foreground">{name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.images ?? []}
          name={name}
        />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            {product.category ? (
              <Link
                href={`/${currentLocale}/categories/${product.category.slug}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {categoryName}
              </Link>
            ) : null}
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              {name}
            </h1>
            <div className="flex items-center gap-2">
              <Price
                value={basePrice}
                compareAt={discount ? price : null}
                locale={currentLocale}
                size="lg"
              />
              {discount ? (
                <Badge variant="destructive">-{discount}%</Badge>
              ) : null}
            </div>
          </div>

          <BuyBox
            product={{
              id: product.id,
              name,
              slug: product.slug,
              stock,
              imageUrl: image,
            }}
            variants={(product.variants ?? []).map((variant) => ({
                id: variant.id,
                name:
                  currentLocale === "ar" ? variant.name_ar : variant.name_fr,
                price_override: variant.price_override
                  ? toNumber(variant.price_override)
                  : null,
                stock: toNumber(variant.stock),
              }))}
            basePrice={basePrice}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-card p-4">
              <h2 className="text-sm font-semibold">
                {dict.product.deliveryInfo}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {dict.product.deliveryInfoText}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <h2 className="text-sm font-semibold">{dict.product.codInfo}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {dict.product.codInfoText}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-6">
          <h2 className="font-heading text-lg font-bold">
            {dict.product.description}
          </h2>
          <div className="mt-3 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>{description}</p>
          </div>
        </section>
        <section className="rounded-xl border bg-card p-6">
          <h2 className="font-heading text-lg font-bold">
            {dict.product.deliveryTo}
          </h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <li>• {dict.home.deliveryDescription}</li>
            <li>• {dict.product.codInfoText}</li>
          </ul>
        </section>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <SectionHeader title={dict.product.relatedProducts} />
          <ProductGrid products={related} locale={currentLocale} />
        </section>
      ) : null}
    </div>
  );
}