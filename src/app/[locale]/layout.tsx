import type { Metadata } from "next";
import { Cairo, Geist_Mono, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { locale } from "next/root-params";

import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart/store";
import { LocaleProvider } from "@/i18n/client";
import { isLocale } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/server";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_DESCRIPTION_FR =
  "Velora Shop — Boutique en ligne premium en Algérie. Livraison dans les 58 wilayas, paiement à la livraison.";
const SITE_DESCRIPTION_AR =
  "فيلورا شوب — متجر إلكتروني متميز في الجزائر. توصيل لجميع الولايات الـ58 مع الدفع عند الاستلام.";

export async function generateMetadata(): Promise<Metadata> {
  const currentLocale = await getLocale();
  const isArabic = currentLocale === "ar";

  return {
    title: {
      default: SITE_NAME,
      template: `%s — ${SITE_NAME}`,
    },
    description: isArabic ? SITE_DESCRIPTION_AR : SITE_DESCRIPTION_FR,
    applicationName: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: SITE_NAME,
      description: isArabic ? SITE_DESCRIPTION_AR : SITE_DESCRIPTION_FR,
      url: `${SITE_URL}/${currentLocale}`,
      siteName: SITE_NAME,
      locale: isArabic ? "ar_DZ" : "fr_DZ",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: isArabic ? SITE_DESCRIPTION_AR : SITE_DESCRIPTION_FR,
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "ar" }];
}

export default async function LocaleLayout(props: LayoutProps<"/[locale]">) {
  const currentLocale = await locale();

  if (!isLocale(currentLocale)) {
    notFound();
  }

  const dictionary = await getDictionary();
  const dir = currentLocale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={currentLocale}
      dir={dir}
      className={`${inter.variable} ${cairo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LocaleProvider locale={currentLocale} dictionary={dictionary}>
          <CartProvider>{props.children}</CartProvider>
        </LocaleProvider>
        <Toaster position={dir === "rtl" ? "top-left" : "top-right"} />
      </body>
    </html>
  );
}