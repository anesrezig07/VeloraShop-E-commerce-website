import { Footer } from "@/components/storefront/footer";
import { Header } from "@/components/storefront/header";
import { getActiveCategories } from "@/lib/data/categories";
import { getLocale } from "@/i18n/server";

export default async function ShopLayout(props: LayoutProps<"/[locale]">) {
  const { children } = props;

  const currentLocale = await getLocale();
  const categories = await getActiveCategories();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header locale={currentLocale} categories={categories} />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer locale={currentLocale} categories={categories} />
    </div>
  );
}