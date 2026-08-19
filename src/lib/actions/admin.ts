"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

import { getAdminSession } from "@/lib/admin/session";
import {
  categorySchema,
  deliveryRateSchema,
  orderStatusSchema,
  productSchema,
  variantSchema,
  type CategoryFormValues,
  type DeliveryRateFormValues,
  type ProductFormValues,
  type VariantFormValues,
} from "@/lib/validators";
import { type OrderStatus } from "@/lib/constants";

export type ActionResult =
  | { ok: true }
  | { ok: false; error?: string; fieldErrors?: Record<string, string> };

type AsyncActionResult = Promise<ActionResult>;

function zodErrors(result: {
  success: boolean;
  error?: { issues: { path: PropertyKey[]; message: string }[] };
}): Record<string, string> | undefined {
  if (result.success) return undefined;
  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error?.issues ?? []) {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) fieldErrors[path] = issue.message;
  }
  return fieldErrors;
}

function revalidateAdmin() {
  revalidatePath("/admin", "layout");
}

export async function createProduct(
  values: ProductFormValues,
  variants: VariantFormValues[],
  images: { url: string; alt_text: string; display_order: number; is_primary: boolean }[],
): AsyncActionResult {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "notAdmin" };

  const parsed = productSchema.safeParse(values);
  if (!parsed.success) return { ok: false, fieldErrors: zodErrors(parsed) };

  const validVariants = variants
    .map((variant) => variantSchema.safeParse(variant))
    .filter((result) => result.success)
    .map((result) => result.data);

  const { data: product, error } = await session.supabase
    .from("products")
    .insert({
      category_id: parsed.data.categoryId ?? null,
      name_fr: parsed.data.nameFr,
      name_ar: parsed.data.nameAr,
      slug: parsed.data.slug,
      description_fr: parsed.data.descriptionFr,
      description_ar: parsed.data.descriptionAr,
      price: parsed.data.price,
      sale_price: parsed.data.salePrice ?? null,
      stock: parsed.data.stock,
      is_featured: parsed.data.isFeatured,
      is_best_seller: parsed.data.isBestSeller,
      is_active: parsed.data.isActive,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { ok: false, error: "slugTaken" };
    console.error("createProduct:", error.message);
    return { ok: false, error: "generic" };
  }

  const productId = product.id;

  if (validVariants.length > 0) {
    await session.supabase.from("product_variants").insert(
      validVariants.map((variant) => ({
        product_id: productId,
        name_fr: variant.nameFr,
        name_ar: variant.nameAr,
        sku: variant.sku || null,
        price_override: variant.priceOverride ?? null,
        stock: variant.stock,
      })),
    );
  }

  if (images.length > 0) {
    await session.supabase.from("product_images").insert(
      images.map((image, index) => ({
        product_id: productId,
        url: image.url,
        alt_text: image.alt_text || null,
        display_order: image.display_order ?? index,
        is_primary: image.is_primary ?? index === 0,
      })),
    );
  }

  revalidateAdmin();
  return { ok: true };
}

export async function updateProduct(
  id: string,
  values: ProductFormValues,
  variants: VariantFormValues[],
  images: { url: string; alt_text: string; display_order: number; is_primary: boolean }[],
  removedImageIds: string[],
  removedVariantIds: string[],
): AsyncActionResult {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "notAdmin" };

  const parsed = productSchema.safeParse(values);
  if (!parsed.success) return { ok: false, fieldErrors: zodErrors(parsed) };

  const validVariants = variants
    .map((variant) => variantSchema.safeParse(variant))
    .filter((result) => result.success)
    .map((result) => result.data);

  const { error } = await session.supabase
    .from("products")
    .update({
      category_id: parsed.data.categoryId ?? null,
      name_fr: parsed.data.nameFr,
      name_ar: parsed.data.nameAr,
      slug: parsed.data.slug,
      description_fr: parsed.data.descriptionFr,
      description_ar: parsed.data.descriptionAr,
      price: parsed.data.price,
      sale_price: parsed.data.salePrice ?? null,
      stock: parsed.data.stock,
      is_featured: parsed.data.isFeatured,
      is_best_seller: parsed.data.isBestSeller,
      is_active: parsed.data.isActive,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { ok: false, error: "slugTaken" };
    console.error("updateProduct:", error.message);
    return { ok: false, error: "generic" };
  }

  if (removedVariantIds.length > 0) {
    await session.supabase
      .from("product_variants")
      .delete()
      .in("id", removedVariantIds);
  }

  if (validVariants.length > 0) {
    await session.supabase.from("product_variants").insert(
      validVariants.map((variant) => ({
        product_id: id,
        name_fr: variant.nameFr,
        name_ar: variant.nameAr,
        sku: variant.sku || null,
        price_override: variant.priceOverride ?? null,
        stock: variant.stock,
      })),
    );
  }

  if (removedImageIds.length > 0) {
    await session.supabase
      .from("product_images")
      .delete()
      .in("id", removedImageIds);
  }

  if (images.length > 0) {
    await session.supabase.from("product_images").insert(
      images.map((image, index) => ({
        product_id: id,
        url: image.url,
        alt_text: image.alt_text || null,
        display_order: image.display_order ?? index,
        is_primary: image.is_primary ?? index === 0,
      })),
    );
  }

  revalidateAdmin();
  return { ok: true };
}

export async function deleteProduct(id: string): AsyncActionResult {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "notAdmin" };

  const { error } = await session.supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("deleteProduct:", error.message);
    return { ok: false, error: "generic" };
  }
  revalidateAdmin();
  return { ok: true };
}

export async function toggleProductActive(
  id: string,
  isActive: boolean,
): AsyncActionResult {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "notAdmin" };

  const { error } = await session.supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) {
    console.error("toggleProductActive:", error.message);
    return { ok: false, error: "generic" };
  }
  revalidateAdmin();
  return { ok: true };
}

export async function createCategory(values: CategoryFormValues): AsyncActionResult {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "notAdmin" };

  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) return { ok: false, fieldErrors: zodErrors(parsed) };

  const { error } = await session.supabase.from("categories").insert({
    name_fr: parsed.data.nameFr,
    name_ar: parsed.data.nameAr,
    slug: parsed.data.slug,
    description_fr: parsed.data.descriptionFr || null,
    description_ar: parsed.data.descriptionAr || null,
    display_order: parsed.data.displayOrder,
    is_active: parsed.data.isActive,
    image_url: parsed.data.imageUrl || null,
  });

  if (error) {
    if (error.code === "23505") return { ok: false, error: "slugTaken" };
    console.error("createCategory:", error.message);
    return { ok: false, error: "generic" };
  }
  revalidateAdmin();
  return { ok: true };
}

export async function updateCategory(
  id: string,
  values: CategoryFormValues,
): AsyncActionResult {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "notAdmin" };

  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) return { ok: false, fieldErrors: zodErrors(parsed) };

  const { error } = await session.supabase
    .from("categories")
    .update({
      name_fr: parsed.data.nameFr,
      name_ar: parsed.data.nameAr,
      slug: parsed.data.slug,
      description_fr: parsed.data.descriptionFr || null,
      description_ar: parsed.data.descriptionAr || null,
      display_order: parsed.data.displayOrder,
      is_active: parsed.data.isActive,
      image_url: parsed.data.imageUrl || null,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { ok: false, error: "slugTaken" };
    console.error("updateCategory:", error.message);
    return { ok: false, error: "generic" };
  }
  revalidateAdmin();
  return { ok: true };
}

export async function deleteCategory(id: string): AsyncActionResult {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "notAdmin" };

  const { error } = await session.supabase
    .from("categories")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("deleteCategory:", error.message);
    return { ok: false, error: "generic" };
  }
  revalidateAdmin();
  return { ok: true };
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
): AsyncActionResult {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "notAdmin" };

  const parsed = orderStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, error: "generic" };

  const { error } = await session.supabase
    .from("orders")
    .update({ status: parsed.data as OrderStatus })
    .eq("id", orderId);
  if (error) {
    console.error("updateOrderStatus:", error.message);
    return { ok: false, error: "generic" };
  }
  revalidateAdmin();
  return { ok: true };
}

export async function updateDeliveryRate(
  id: string,
  values: DeliveryRateFormValues,
): AsyncActionResult {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "notAdmin" };

  const parsed = deliveryRateSchema.safeParse(values);
  if (!parsed.success) return { ok: false, fieldErrors: zodErrors(parsed) };

  const { error } = await session.supabase
    .from("delivery_rates")
    .update({
      home_fee: parsed.data.homeFee,
      stop_desk_fee: parsed.data.stopDeskFee,
      estimated_days_min: parsed.data.estimatedDaysMin,
      estimated_days_max: parsed.data.estimatedDaysMax,
      is_active: parsed.data.isActive,
    })
    .eq("id", id);

  if (error) {
    console.error("updateDeliveryRate:", error.message);
    return { ok: false, error: "generic" };
  }
  revalidateAdmin();
  return { ok: true };
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function uploadProductImage(file: File): Promise<
  { ok: true; url: string } | { ok: false; error?: string }
> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "notAdmin" };

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { ok: false, error: "invalidImageType" };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "imageTooLarge" };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${randomUUID()}.${extension}`;

  const { error } = await session.supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error("uploadProductImage:", error.message);
    return { ok: false, error: "generic" };
  }

  const {
    data: { publicUrl },
  } = session.supabase.storage.from("product-images").getPublicUrl(path);

  return { ok: true, url: publicUrl };
}