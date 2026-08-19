"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useDictionary, useLocale } from "@/i18n/client";

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
  const router = useRouter();
  const locale = useLocale();
  const dict = useDictionary();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = value.trim();
    const query = term ? `?q=${encodeURIComponent(term)}` : "";
    router.push(`/${locale}/products${query}`);
  }

  return (
    <form onSubmit={handleSubmit} className={className} role="search">
      <div className="relative">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={dict.products.searchPlaceholder}
          aria-label={dict.nav.search}
          autoFocus={autoFocus}
          className="ps-9 pe-3"
        />
      </div>
    </form>
  );
}