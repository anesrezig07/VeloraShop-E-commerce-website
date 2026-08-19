"use client";

import { createContext, useContext, useMemo } from "react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { fr } from "@/i18n/dictionaries/fr";

interface LocaleContextValue {
  locale: Locale;
  dictionary: Dictionary;
  dir: "ltr" | "rtl";
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "fr",
  dictionary: fr,
  dir: "ltr",
});

export function LocaleProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dictionary, dir: locale === "ar" ? "rtl" : "ltr" }),
    [locale, dictionary],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale;
}

export function useDictionary(): Dictionary {
  return useContext(LocaleContext).dictionary;
}

export function useDirection(): "ltr" | "rtl" {
  return useContext(LocaleContext).dir;
}
