"use client";

import { Clock, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Input } from "@/components/ui/input";
import { useDictionary, useLocale } from "@/i18n/client";
import { createClient } from "@/lib/supabase/client";
import { toNumber } from "@/lib/coerce";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const RECENT_KEY = "velora_recent_searches";

interface Suggestion {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  sale_price: string | number | null;
  image_url: string | null;
}

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  } catch {
    return [];
  }
}

function persistRecent(term: string) {
  try {
    const next = [term, ...readRecent().filter((item) => item !== term)].slice(
      0,
      5,
    );
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors.
  }
}

export function SearchBar({
  defaultValue = "",
  autoFocus = false,
  className,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [recentVersion, setRecentVersion] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const dict = useDictionary();
  const isArabic = locale === "ar";
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recent = readRecent();

  const fetchSuggestions = useCallback(async (term: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name_fr, name_ar, slug, price, sale_price, images:product_images(url, is_primary, display_order)",
      )
      .eq("is_active", true)
      .or(`name_fr.ilike.%${term.trim()}%,name_ar.ilike.%${term.trim()}%`)
      .order("name_fr", { ascending: true })
      .limit(6);

    if (error) return;

    setSuggestions(
      (data ?? []).map((row) => {
        const images = row.images ?? [];
        const primary = images.find((image) => image.is_primary) ?? images[0];
        return {
          id: row.id,
          name: isArabic ? row.name_ar : row.name_fr,
          slug: row.slug,
          price: row.price,
          sale_price: row.sale_price,
          image_url: primary?.url ?? null,
        } as Suggestion;
      }),
    );
  }, [isArabic]);

  useEffect(() => {
    if (!focused || value.trim().length < 2) return;
    const timer = setTimeout(() => {
      setLoading(true);
      void fetchSuggestions(value).finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [value, focused, fetchSuggestions]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = value.trim();
    if (!term) return;
    persistRecent(term);
    setRecentVersion((v) => v + 1);
    const query = `?q=${encodeURIComponent(term)}`;
    router.push(`/${locale}/products${query}`);
    setFocused(false);
  }

  function handleBlur() {
    blurTimer.current = setTimeout(() => setFocused(false), 120);
  }

  useEffect(() => {
    return () => {
      if (blurTimer.current) clearTimeout(blurTimer.current);
    };
  }, []);

  const open = focused && (value.trim().length >= 2 || recent.length > 0);

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            placeholder={dict.products.searchPlaceholder}
            aria-label={dict.nav.search}
            aria-expanded={open}
            autoFocus={autoFocus}
            className="rounded-full ps-9 pe-8"
          />
          {value ? (
            <button
              type="button"
              aria-label={dict.common.clear}
              className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setValue("")}
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      </form>

      {open ? (
        <div
          key={recentVersion}
          className="absolute inset-x-0 top-full z-50 mt-2 origin-top animate-scale-in overflow-hidden rounded-xl border bg-popover p-1.5 shadow-premium"
        >
          {value.trim().length < 2 ? (
            recent.length > 0 ? (
              <div className="p-1.5">
                <div className="flex items-center justify-between px-2 pb-1.5">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {dict.search.recentSearches}
                  </p>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      window.localStorage.removeItem(RECENT_KEY);
                      setRecentVersion((v) => v + 1);
                    }}
                  >
                    {dict.search.clearRecent}
                  </button>
                </div>
                <ul className="flex flex-col gap-0.5">
                  {recent.map((term) => (
                    <li key={term}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        onClick={() => {
                          persistRecent(term);
                          setRecentVersion((v) => v + 1);
                          router.push(`/${locale}/products?q=${encodeURIComponent(term)}`);
                          setFocused(false);
                        }}
                      >
                        <Clock className="size-3.5" />
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          ) : suggestions.length > 0 ? (
            <ul className="flex flex-col gap-0.5">
              {suggestions.map((suggestion) => {
                const price = toNumber(suggestion.price);
                const sale = toNumber(suggestion.sale_price);
                const effective = sale > 0 ? sale : price;
                return (
                  <li key={suggestion.id}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-start transition-colors hover:bg-muted"
                      onClick={() => {
                        persistRecent(value);
                        setRecentVersion((v) => v + 1);
                        router.push(`/${locale}/products/${suggestion.slug}`);
                        setFocused(false);
                      }}
                    >
                      <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-muted">
                        {suggestion.image_url ? (
                          <Image
                            src={suggestion.image_url}
                            alt=""
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 text-sm font-medium">
                          {suggestion.name}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-primary">
                        {formatPrice(effective, locale)}
                      </span>
                    </button>
                  </li>
                );
              })}
              <li className="border-t pt-1">
                <button
                  type="button"
                  className="w-full rounded-lg px-2 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-muted"
                  onClick={() => {
                    persistRecent(value);
                    setRecentVersion((v) => v + 1);
                    router.push(
                      `/${locale}/products?q=${encodeURIComponent(value)}`,
                    );
                    setFocused(false);
                  }}
                >
                  {dict.search.viewAll}
                </button>
              </li>
            </ul>
          ) : loading ? (
            <div className="space-y-2 p-2">
              {[0, 1, 2].map((index) => (
                <div key={index} className="premium-skeleton h-10" />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {dict.search.noResults}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}