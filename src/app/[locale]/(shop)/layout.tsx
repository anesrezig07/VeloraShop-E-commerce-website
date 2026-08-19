import { Footer } from "@/components/storefront/footer";
import { Header } from "@/components/storefront/header";
import { MobileBottomNav } from "@/components/storefront/mobile-bottom-nav";
import { RouteTransition } from "@/components/ui/route-transition";
import { getActiveCategories } from "@/lib/data/categories";
import { getLocale } from "@/i18n/server";

export default async function ShopLayout(props: LayoutProps<"/[locale]">) {
  const { children } = props;

  const currentLocale = await getLocale();
  const categories = await getActiveCategories();

  const categoryItems = categories.map((category) => ({
    slug: category.slug,
    name: currentLocale === "ar" ? category.name_ar : category.name_fr,
  }));

  return (
    <div className="flex min-h-full flex-1 flex-col pb-16 lg:pb-0">
      <Header locale={currentLocale} categories={categories} />
      <RouteTransition>
        <div className="flex flex-1 flex-col">{children}</div>
      </RouteTransition>
      <Footer locale={currentLocale} categories={categories} />
      <MobileBottomNav categories={categoryItems} />
    </div>
  );
}