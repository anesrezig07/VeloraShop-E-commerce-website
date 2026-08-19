"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDictionary } from "@/i18n/client";

export function MaxPriceFilter({
  defaultValue,
}: {
  defaultValue?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dict = useDictionary();
  const [value, setValue] = useState(defaultValue ?? "");

  function apply(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    const price = Number(next);
    if (price > 0) {
      params.set("maxPrice", String(price));
    } else {
      params.delete("maxPrice");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    apply(value);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Label htmlFor="max-price">{dict.products.maxPrice}</Label>
      <div className="flex gap-2">
        <Input
          id="max-price"
          type="number"
          min={0}
          step={100}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={dict.products.priceRangeHint.replace("{value}", "50000")}
          className="w-full"
        />
        <Button type="submit" variant="secondary" size="sm">
          {dict.common.apply}
        </Button>
      </div>
    </form>
  );
}