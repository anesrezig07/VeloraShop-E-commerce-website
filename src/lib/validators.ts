import { z } from "zod";

import { DELIVERY_TYPES, PHONE_NUMBER_PATTERN } from "@/lib/constants";

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, "customerNameMin")
    .max(80, "customerNameMin")
    .trim(),
  customerPhone: z
    .string()
    .regex(PHONE_NUMBER_PATTERN, "phoneInvalid")
    .trim(),
  wilayaId: z.coerce.number().int().min(1).max(58),
  commune: z.string().min(2, "communeRequired").max(80).trim(),
  shippingAddress: z
    .string()
    .min(5, "addressRequired")
    .max(300, "addressRequired")
    .trim(),
  deliveryType: z.enum(DELIVERY_TYPES),
  notes: z.string().max(500).trim().optional().or(z.literal("")),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;

export const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6),
});

export type LoginValues = z.infer<typeof loginSchema>;

const numericNonNegative = z.coerce.number().finite().nonnegative();

export const productSchema = z.object({
  categoryId: z.string().uuid().nullable().optional(),
  nameFr: z.string().min(2).max(150).trim(),
  nameAr: z.string().min(2).max(150).trim(),
  slug: z
    .string()
    .min(2)
    .max(160)
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slugInvalid"),
  descriptionFr: z.string().max(5000).trim().default(""),
  descriptionAr: z.string().max(5000).trim().default(""),
  price: numericNonNegative,
  salePrice: numericNonNegative.nullable().optional(),
  stock: z.coerce.number().int().nonnegative(),
  isFeatured: z.coerce.boolean().default(false),
  isBestSeller: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  nameFr: z.string().min(2).max(100).trim(),
  nameAr: z.string().min(2).max(100).trim(),
  slug: z
    .string()
    .min(2)
    .max(120)
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slugInvalid"),
  descriptionFr: z.string().max(1000).trim().optional().or(z.literal("")),
  descriptionAr: z.string().max(1000).trim().optional().or(z.literal("")),
  displayOrder: z.coerce.number().int().nonnegative(),
  isActive: z.coerce.boolean().default(true),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const variantSchema = z.object({
  nameFr: z.string().min(1).max(100).trim(),
  nameAr: z.string().min(1).max(100).trim(),
  sku: z.string().max(60).trim().optional().or(z.literal("")),
  priceOverride: numericNonNegative.nullable().optional(),
  stock: z.coerce.number().int().nonnegative(),
});

export type VariantFormValues = z.infer<typeof variantSchema>;

export const deliveryRateSchema = z.object({
  homeFee: numericNonNegative,
  stopDeskFee: numericNonNegative,
  estimatedDaysMin: z.coerce.number().int().min(1).max(30),
  estimatedDaysMax: z.coerce.number().int().min(1).max(30),
  isActive: z.coerce.boolean().default(true),
}).refine((data) => data.estimatedDaysMax >= data.estimatedDaysMin, {
  message: "estimatedDaysRange",
  path: ["estimatedDaysMax"],
});

export type DeliveryRateFormValues = z.infer<typeof deliveryRateSchema>;

export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
]);