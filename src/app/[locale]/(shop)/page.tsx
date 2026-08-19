import { Metadata } from "next";

import { CodBanner } from "@/components/storefront/cod-banner";
import { CategoryGrid } from "@/components/storefront/category-grid";
import { Hero } from "@/components/storefront/hero";
import { ProductGrid } from "@/components/storefront/product-grid";
import { SectionHeader } from "@/components/storefront/section-header";
import { WhyShopSection } from "@/components/storefront/why-shop-section";
import { getActiveCategories } from "@/lib/data/categories";
import {
  getBestSellers,
  getFeaturedProducts,
  getNewArrivals,
} from "@/lib/data/products";
import { getDictionary, getLocale } from "@/i18n/server";

export const metadata: Metadata = {
  description:
    "Velora Shop — Boutique en ligne en Algérie. Livraison dans les 58 wilayas, paiement à la livraison.",
};

export default async function HomePage() {
  const dict = await getDictionary();
  const currentLocale = await getLocale();

  const [featured, newArrivals, bestSellers, categories] = await Promise.all([
    getFeaturedProducts(8),
    getNewArrivals(8),
    getBestSellers(8),
    getActiveCategories(),
  ]);

  return (
    <>
      <Hero locale={currentLocale} dict={dict.home} />

      {categories.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <SectionHeader
            title={dict.home.categories}
            seeAllHref={`/${currentLocale}/categories`}
            seeAllLabel={dict.home.viewAllCategories}
          />
          <CategoryGrid locale={currentLocale} categories={categories.slice(0, 8)} />
        </section>
      ) : null}

      {featured.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <SectionHeader
            title={dict.home.featured}
            seeAllHref={`/${currentLocale}/products`}
            seeAllLabel={dict.home.viewAllProducts}
          />
          <ProductGrid products={featured} locale={currentLocale} />
        </section>
      ) : null}

      {newArrivals.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <SectionHeader
            title={dict.home.newArrivals}
            seeAllHref={`/${currentLocale}/products`}
            seeAllLabel={dict.home.viewAllProducts}
          />
          <ProductGrid products={newArrivals} locale={currentLocale} />
        </section>
      ) : null}

      {bestSellers.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <SectionHeader
            title={dict.home.bestSellers}
            seeAllHref={`/${currentLocale}/products`}
            seeAllLabel={dict.home.viewAllProducts}
          />
          <ProductGrid products={bestSellers} locale={currentLocale} />
        </section>
      ) : null}

      <CodBanner dict={dict.home} />
      <WhyShopSection dict={dict.home} />
    </>
  );
}