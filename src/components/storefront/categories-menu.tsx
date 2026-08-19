"use client";

import { ChevronDown, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDictionary, useLocale } from "@/i18n/client";
import { cn } from "@/lib/utils";

interface CategoryNavItem {
  slug: string;
  name: string;
}

export function CategoriesMenu({
  categories,
}: {
  categories: CategoryNavItem[];
}) {
  const dict = useDictionary();
  const locale = useLocale();
  const pathname = usePathname();

  if (categories.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-sm font-medium whitespace-nowrap text-foreground transition-colors outline-none hover:bg-muted focus-visible:bg-muted",
          pathname.startsWith(`/${locale}/categories`) && "bg-muted",
        )}
        aria-label={dict.nav.categories}
      >
        <LayoutGrid data-icon="inline-start" className="size-4" />
        {dict.nav.categories}
        <ChevronDown data-icon="inline-end" className="size-3.5 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start" sideOffset={8}>
        <DropdownMenuLabel>{dict.nav.categories}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {categories.map((category) => (
          <DropdownMenuItem
            key={category.slug}
            render={<Link href={`/${locale}/categories/${category.slug}`} />}
          >
            {category.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}