"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useDictionary } from "@/i18n/client";

export function AvailabilityFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dict = useDictionary();

  const inStock = searchParams.get("inStock") === "1";
  const onSale = searchParams.get("onSale") === "1";

  function toggle(param: "inStock" | "onSale") {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(param) === "1";
    if (current) {
      params.delete(param);
    } else {
      params.set(param, "1");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold">{dict.products.availability}</p>
      <div className="flex items-center gap-2">
        <Checkbox
          id="filter-in-stock"
          checked={inStock}
          onCheckedChange={() => toggle("inStock")}
        />
        <Label htmlFor="filter-in-stock" className="text-sm font-normal">
          {dict.products.inStockOnly}
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="filter-on-sale"
          checked={onSale}
          onCheckedChange={() => toggle("onSale")}
        />
        <Label htmlFor="filter-on-sale" className="text-sm font-normal">
          {dict.products.onSaleOnly}
        </Label>
      </div>
    </div>
  );
}