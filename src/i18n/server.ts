import "server-only";

import { locale } from "next/root-params";

import { isLocale, type Locale } from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

export async function getLocale(): Promise<Locale> {
  const current = await locale();
  return isLocale(current) ? current : "fr";
}

export async function getDictionary(): Promise<Dictionary> {
  const current = await getLocale();
  return dictionaries[current];
}

export async function getDirection(): Promise<"ltr" | "rtl"> {
  const current = await getLocale();
  return current === "ar" ? "rtl" : "ltr";
}
