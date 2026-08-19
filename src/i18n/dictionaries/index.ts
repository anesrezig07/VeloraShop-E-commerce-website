import type { Locale } from "../config";
import { ar } from "./ar";
import { fr } from "./fr";

export type { Dictionary } from "./fr";

export const dictionaries: Record<Locale, typeof fr> = {
  fr,
  ar,
};
