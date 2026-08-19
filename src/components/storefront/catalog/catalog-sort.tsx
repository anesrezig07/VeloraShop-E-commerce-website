"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDictionary } from "@/i18n/client";

const SORT_OPTIONS = [
  { value: "newest", key: "sortNewest" },
  { value: "price-asc", key: "sortPriceAsc" },
  { value: "price-desc", key: "sortPriceDesc" },
  { value: "name-asc", key: "sortNameAsc" },
  { value: "name-desc", key: "sortNameDesc" },
] as const;

export function CatalogSort({ value = "newest" }: { value?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dict = useDictionary();

  function handleChange(next: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (next && next !== "newest") {
      params.set("sort", next);
    } else {
      params.delete("sort");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger aria-label={dict.common.sort}>
        <SelectValue>
          {SORT_OPTIONS.find((option) => option.value === value)?.key
            ? dict.products[
                SORT_OPTIONS.find((option) => option.value === value)!
                  .key as keyof typeof dict.products
              ]
            : dict.products.sortNewest}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {dict.products[option.key as keyof typeof dict.products]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}