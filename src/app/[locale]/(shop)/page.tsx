import { Metadata } from "next";

import { CodBanner } from "@/components/storefront/cod-banner";
import { CategoryGrid } from "@/components/storefront/category-grid";
import { Hero } from "@/components/storefront/hero";
import { ProductGrid } from "@/components/storefront/product-grid";
import { SectionHeader } from "@/components/storefront/section-header";
import { WhyShopSection } from "@/components/storefront/why-shop-section";
import { getActiveCategoriesWithCounts } from "@/lib/data/categories";
import {
  getBestSellers,
  getFeaturedProducts,
  getNewArrivals,
} from "@/lib/data/products";
import { getDictionary, getLocale } from "@/i18n/server";
import { localeAlternates } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const HOME_DESCRIPTION_FR =
  "Velora Shop — Boutique en ligne en Algérie. Livraison dans les 58 wilayas, paiement à la livraison.";
const HOME_DESCRIPTION_AR =
  "فيلورا شوب — متجر إلكتروني في الجزائر. توصيل لجميع الولايات الـ58 مع الدفع عند الاستلام.";

export async function generateMetadata(): Promise<Metadata> {
  const currentLocale = await getLocale();
  const isArabic = currentLocale === "ar";
  return {
    title: {
      default: "Velora Shop — Boutique en ligne en Algérie",
      template: `%s — Velora Shop`,
    },
    description: isArabic ? HOME_DESCRIPTION_AR : HOME_DESCRIPTION_FR,
    alternates: localeAlternates("", currentLocale),
    openGraph: {
      title: isArabic ? "فيلورا شوب" : "Velora Shop",
      description: isArabic ? HOME_DESCRIPTION_AR : HOME_DESCRIPTION_FR,
      url: `${SITE_URL}/${currentLocale}`,
      siteName: "Velora Shop",
      locale: isArabic ? "ar_DZ" : "fr_DZ",
      type: "website",
    },
  };
}

export default async function HomePage() {
  const dict = await getDictionary();
  const currentLocale = await getLocale();

  const [featured, newArrivals, bestSellers, categories] = await Promise.all([
    getFeaturedProducts(8),
    getNewArrivals(8),
    getBestSellers(8),
    getActiveCategoriesWithCounts(),
  ]);

  return (
    <>
      <Hero
        locale={currentLocale}
        dict={dict.home}
        featuredProduct={featured[0] ?? null}
      />

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