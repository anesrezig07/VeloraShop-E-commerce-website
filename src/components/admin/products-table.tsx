"use client";

import { Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/admin/page-header";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDictionary, useLocale } from "@/i18n/client";
import type { AdminProduct } from "@/lib/data/admin";

export function ProductsTable({ products }: { products: AdminProduct[] }) {
  const dict = useDictionary();
  const locale = useLocale();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => {
      const name = locale === "ar" ? product.name_ar : product.name_fr;
      const category = product.category
        ? locale === "ar"
          ? product.category.name_ar
          : product.category.name_fr
        : "";
      return (
        name.toLowerCase().includes(term) ||
        product.slug.includes(term) ||
        category.toLowerCase().includes(term)
      );
    });
  }, [products, query, locale]);

  return (
    <div>
      <PageHeader
        title={dict.admin.products}
        subtitle={dict.admin.productsCount.replace(
          "{count}",
          String(products.length),
        )}
        actions={
          <Button
            render={<Link href={`/${locale}/admin/products/new`} />}
          >
            <Plus data-icon="inline-start" />
            {dict.admin.newProduct}
          </Button>
        }
      />

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={dict.admin.searchProducts}
          className="ps-9"
          aria-label={dict.admin.searchProducts}
        />
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dict.admin.productName}</TableHead>
              <TableHead className="hidden md:table-cell">
                {dict.admin.category}
              </TableHead>
              <TableHead>{dict.admin.price}</TableHead>
              <TableHead className="hidden sm:table-cell">{dict.admin.stock}</TableHead>
              <TableHead className="text-end">{dict.admin.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => {
              const name = locale === "ar" ? product.name_ar : product.name_fr;
              const category = product.category
                ? locale === "ar"
                  ? product.category.name_ar
                  : product.category.name_fr
                : "—";
              const primary = product.images
                .filter((image) => image.is_primary)
                .sort((a, b) => a.display_order - b.display_order)[0];
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="relative size-10 shrink-0 overflow-hidden rounded-lg border bg-muted">
                        {primary ? (
                          <Image
                            src={primary.url}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : null}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/${locale}/admin/products/${product.id}/edit`}
                          className="block truncate font-medium hover:underline"
                        >
                          {name}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {category}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {product.sale_price
                      ? `${Number(product.sale_price).toLocaleString("fr-FR")} DA`
                      : `${Number(product.price).toLocaleString("fr-FR")} DA`}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell tabular-nums">
                    {product.stock}
                  </TableCell>
                  <TableCell className="text-end">
                    <ProductRowActions
                      productId={product.id}
                      isActive={product.is_active}
                      name={name}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  {dict.admin.noProducts}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}