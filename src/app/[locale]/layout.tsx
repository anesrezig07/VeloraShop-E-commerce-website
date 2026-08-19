import type { Metadata } from "next";
import { Cairo, Geist_Mono, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { locale } from "next/root-params";

import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart/store";
import { LocaleProvider } from "@/i18n/client";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/server";
import { SITE_NAME } from "@/lib/constants";

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

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Velora Shop — Boutique en ligne premium en Algérie. Livraison dans les 58 wilayas, paiement à la livraison.",
  applicationName: SITE_NAME,
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
};

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