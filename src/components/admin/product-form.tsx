"use client";

import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
} from "@/lib/actions/admin";
import { useDictionary, useLocale } from "@/i18n/client";
import type { Category, ProductVariant, ProductImage } from "@/lib/types";

interface ImageDraft {
  url: string;
  alt_text: string;
  is_primary: boolean;
}

interface VariantDraft {
  key: string;
  id?: string;
  name_fr: string;
  name_ar: string;
  sku: string;
  price_override: string;
  stock: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductForm({
  mode,
  categories,
  product,
}: {
  mode: "create" | "edit";
  categories: Category[];
  product?: {
    id: string;
    category_id: string | null;
    name_fr: string;
    name_ar: string;
    slug: string;
    description_fr: string;
    description_ar: string;
    price: number;
    sale_price: number | null;
    stock: number;
    is_featured: boolean;
    is_best_seller: boolean;
    is_active: boolean;
    variants: ProductVariant[];
    images: ProductImage[];
  };
}) {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const slugTouched = useRef(mode === "edit");

  const [form, setForm] = useState({
    categoryId: product?.category_id ?? "",
    nameFr: product?.name_fr ?? "",
    nameAr: product?.name_ar ?? "",
    slug: product?.slug ?? "",
    descriptionFr: product?.description_fr ?? "",
    descriptionAr: product?.description_ar ?? "",
    price: product ? String(product.price) : "",
    salePrice: product?.sale_price ? String(product.sale_price) : "",
    stock: product ? String(product.stock) : "",
    isFeatured: product?.is_featured ?? false,
    isBestSeller: product?.is_best_seller ?? false,
    isActive: product?.is_active ?? true,
  });

  const [variants, setVariants] = useState<VariantDraft[]>(
    (product?.variants ?? []).map((variant, index) => ({
      key: `existing-${index}-${variant.id}`,
      id: variant.id,
      name_fr: variant.name_fr,
      name_ar: variant.name_ar,
      sku: variant.sku ?? "",
      price_override: variant.price_override ? String(variant.price_override) : "",
      stock: String(variant.stock),
    })),
  );
  const [removedVariantIds, setRemovedVariantIds] = useState<string[]>([]);

  const [images, setImages] = useState<ImageDraft[]>(
    (product?.images ?? [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((image) => ({
        url: image.url,
        alt_text: image.alt_text ?? "",
        is_primary: image.is_primary,
      })),
  );
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "nameFr" && !slugTouched.current) {
        next.slug = slugify(value as string);
      }
      return next;
    });
    if (fieldErrors[key]) {
      setFieldErrors((current) => {
        const copy = { ...current };
        delete copy[key];
        return copy;
      });
    }
  }

  function addVariant() {
    setVariants((current) => [
      ...current,
      {
        key: `new-${Date.now()}`,
        name_fr: "",
        name_ar: "",
        sku: "",
        price_override: "",
        stock: "0",
      },
    ]);
  }

  function updateVariant(key: string, field: keyof VariantDraft, value: string) {
    setVariants((current) =>
      current.map((variant) =>
        variant.key === key ? { ...variant, [field]: value } : variant,
      ),
    );
  }

  function removeVariant(key: string, id?: string) {
    setVariants((current) => current.filter((variant) => variant.key !== key));
    if (id) setRemovedVariantIds((current) => [...current, id]);
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setFormError(null);
    try {
      const drafts: ImageDraft[] = [];
      for (const file of Array.from(files)) {
        const result = await uploadProductImage(file);
        if (result.ok) {
          drafts.push({
            url: result.url,
            alt_text: file.name,
            is_primary: false,
          });
        } else {
          setFormError(
            result.error === "imageInvalid"
              ? dict.admin.imageInvalid
              : result.error === "imageTooLarge"
                ? dict.admin.imageTooLarge
                : dict.admin.genericError,
          );
        }
      }
      if (drafts.length > 0) {
        setImages((current) => [
          ...current,
          ...drafts.map((draft) => ({
            ...draft,
            is_primary: current.length === 0 && images.length === 0 ? true : draft.is_primary,
          })),
        ]);
      }
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number, url: string) {
    setImages((current) => {
      const next = current.filter((_, i) => i !== index);
      if (current[index]?.is_primary && next.length > 0) {
        next[0] = { ...next[0], is_primary: true };
      }
      return next;
    });
    const existing = product?.images.find((image) => image.url === url);
    if (existing) setRemovedImageIds((current) => [...current, existing.id]);
  }

  function setPrimaryImage(index: number) {
    setImages((current) =>
      current.map((image, i) => ({ ...image, is_primary: i === index })),
    );
  }

  function fieldError(path: string): string | null {
    const code = fieldErrors[path];
    if (!code) return null;
    if (code === "slugInvalid") return dict.admin.slugTaken;
    return dict.admin.genericError;
  }

  function handleSubmit() {
    setFormError(null);
    setFieldErrors({});

    const values = {
      categoryId: form.categoryId ? form.categoryId : null,
      nameFr: form.nameFr,
      nameAr: form.nameAr,
      slug: form.slug,
      descriptionFr: form.descriptionFr,
      descriptionAr: form.descriptionAr,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      stock: Number(form.stock),
      isFeatured: form.isFeatured,
      isBestSeller: form.isBestSeller,
      isActive: form.isActive,
    };

    const variantInputs = variants.map((variant) => ({
      nameFr: variant.name_fr,
      nameAr: variant.name_ar,
      sku: variant.sku,
      priceOverride: variant.price_override ? Number(variant.price_override) : null,
      stock: Number(variant.stock),
    }));

    const imageInputs = images.map((image, index) => ({
      url: image.url,
      alt_text: image.alt_text,
      display_order: index,
      is_primary: image.is_primary,
    }));

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createProduct(values, variantInputs, imageInputs)
          : await updateProduct(
              product!.id,
              values,
              variantInputs,
              imageInputs,
              removedImageIds,
              removedVariantIds,
            );

      if (result.ok) {
        router.push(`/${locale}/admin/products`);
        router.refresh();
      } else if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      } else if (result.error === "slugTaken") {
        setFormError(dict.admin.slugTaken);
      } else {
        setFormError(dict.admin.genericError);
      }
    });
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/${locale}/admin/products`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" />
          {dict.admin.products}
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight">
          {mode === "create" ? dict.admin.newProduct : dict.admin.editProduct}
        </h1>
      </div>

      {formError ? (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {formError}
        </div>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-6"
      >
        <section className="rounded-xl border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">{dict.admin.productName}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nameFr">{dict.admin.productName} (FR)</Label>
              <Input
                id="nameFr"
                value={form.nameFr}
                onChange={(event) => update("nameFr", event.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="nameAr">{dict.admin.productName} (AR)</Label>
              <Input
                id="nameAr"
                dir="rtl"
                value={form.nameAr}
                onChange={(event) => update("nameAr", event.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="slug">{dict.admin.slug}</Label>
              <Input
                id="slug"
                dir="ltr"
                value={form.slug}
                onChange={(event) => {
                  slugTouched.current = true;
                  update("slug", slugify(event.target.value));
                }}
                className={fieldError("slug") ? "border-destructive" : ""}
                required
              />
              {fieldError("slug") ? (
                <p className="text-xs text-destructive">{fieldError("slug")}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="descriptionFr">{dict.admin.description} (FR)</Label>
              <Textarea
                id="descriptionFr"
                rows={4}
                value={form.descriptionFr}
                onChange={(event) => update("descriptionFr", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="descriptionAr">{dict.admin.description} (AR)</Label>
              <Textarea
                id="descriptionAr"
                dir="rtl"
                rows={4}
                value={form.descriptionAr}
                onChange={(event) => update("descriptionAr", event.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold">{dict.admin.category}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="categoryId">{dict.admin.category}</Label>
              <select
                id="categoryId"
                value={form.categoryId}
                onChange={(event) => update("categoryId", event.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">—</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {locale === "ar" ? category.name_ar : category.name_fr}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">{dict.admin.price} (DA)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                dir="ltr"
                value={form.price}
                onChange={(event) => update("price", event.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="salePrice">{dict.admin.salePrice} (DA)</Label>
              <Input
                id="salePrice"
                type="number"
                min={0}
                dir="ltr"
                value={form.salePrice}
                onChange={(event) => update("salePrice", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="stock">{dict.admin.stock}</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                dir="ltr"
                value={form.stock}
                onChange={(event) => update("stock", event.target.value)}
                required
              />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {(
              [
                { key: "isFeatured", label: dict.admin.featured },
                { key: "isBestSeller", label: dict.admin.bestSeller },
                { key: "isActive", label: dict.admin.active },
              ] as const
            ).map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <Label htmlFor={item.key}>{item.label}</Label>
                <Switch
                  id={item.key}
                  checked={form[item.key]}
                  onCheckedChange={(checked) => update(item.key, checked)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{dict.admin.variants}</h2>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus data-icon="inline-start" />
              {dict.admin.addVariant}
            </Button>
          </div>
          {variants.length === 0 ? (
            <p className="text-sm text-muted-foreground">{dict.admin.noProducts}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {variants.map((variant) => (
                <div
                  key={variant.key}
                  className="grid gap-3 rounded-lg border p-3 sm:grid-cols-2 lg:grid-cols-5"
                >
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">{dict.admin.variantName} (FR)</Label>
                    <Input
                      value={variant.name_fr}
                      onChange={(event) =>
                        updateVariant(variant.key, "name_fr", event.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">{dict.admin.variantName} (AR)</Label>
                    <Input
                      dir="rtl"
                      value={variant.name_ar}
                      onChange={(event) =>
                        updateVariant(variant.key, "name_ar", event.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">{dict.admin.sku}</Label>
                    <Input
                      dir="ltr"
                      value={variant.sku}
                      onChange={(event) =>
                        updateVariant(variant.key, "sku", event.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">{dict.admin.priceOverride}</Label>
                    <Input
                      type="number"
                      min={0}
                      dir="ltr"
                      value={variant.price_override}
                      onChange={(event) =>
                        updateVariant(variant.key, "price_override", event.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex flex-1 flex-col gap-1.5">
                      <Label className="text-xs">{dict.admin.stock}</Label>
                      <Input
                        type="number"
                        min={0}
                        dir="ltr"
                        value={variant.stock}
                        onChange={(event) =>
                          updateVariant(variant.key, "stock", event.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariant(variant.key, variant.id)}
                      aria-label={dict.common.delete}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{dict.admin.images}</h2>
            <div className="flex items-center gap-2">
              {uploading ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <Plus data-icon="inline-start" />
                {dict.admin.uploadImage}
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(event) => handleImageUpload(event.target.files)}
              />
            </div>
          </div>
          {images.length === 0 ? (
            <p className="text-sm text-muted-foreground">{dict.admin.noProducts}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((image, index) => (
                <div
                  key={image.url}
                  className="relative overflow-hidden rounded-lg border bg-muted"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={image.alt_text || ""}
                      fill
                      sizes="(min-width: 640px) 25vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-2">
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(index)}
                      className={
                        image.is_primary
                          ? "rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground"
                          : "rounded bg-white/20 px-2 py-0.5 text-xs text-white hover:bg-white/30"
                      }
                    >
                      {dict.admin.primaryImage}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index, image.url)}
                      className="rounded bg-white/20 p-1 text-white hover:bg-red-500/80"
                      aria-label={dict.admin.removeImage}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex gap-3">
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? dict.common.loading : dict.common.saveChanges}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            render={<Link href={`/${locale}/admin/products`} />}
          >
            {dict.common.cancel}
          </Button>
        </div>
      </form>
    </div>
  );
}