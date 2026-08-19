"use server";

import { checkoutSchema, type CheckoutValues } from "@/lib/validators";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface CartItemInput {
  productId: string;
  variantId: string | null;
  quantity: number;
}

export type CreateOrderResult =
  | {
      ok: true;
      orderNumber: string;
      subtotal: number;
      deliveryFee: number;
      total: number;
    }
  | {
      ok: false;
      fieldErrors?: Record<string, string>;
      formError?: string;
      notConfigured?: boolean;
    };

export async function createOrder(
  values: CheckoutValues,
  items: CartItemInput[],
  locale: "fr" | "ar",
): Promise<CreateOrderResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, notConfigured: true };
  }

  const parsed = checkoutSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) {
        fieldErrors[path] = issue.message;
      }
    }
    return { ok: false, fieldErrors };
  }

  const validItems = items
    .filter(
      (item) =>
        item.productId &&
        typeof item.productId === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= 99,
    )
    .map((item) => ({
      product_id: item.productId,
      variant_id: item.variantId ?? "",
      quantity: item.quantity,
    }));

  if (validItems.length === 0) {
    return { ok: false, formError: "emptyCart" };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("place_order", {
    p_customer_name: parsed.data.customerName,
    p_customer_phone: parsed.data.customerPhone,
    p_wilaya_id: parsed.data.wilayaId,
    p_commune: parsed.data.commune,
    p_shipping_address: parsed.data.shippingAddress,
    p_delivery_type: parsed.data.deliveryType,
    p_notes: parsed.data.notes ?? "",
    p_locale: locale,
    p_items: validItems,
  });

  if (error) {
    console.error("createOrder:", error.message, error.details);
    return { ok: false, formError: "orderError" };
  }

  const result = data as {
    order_number: string;
    subtotal: number;
    delivery_fee: number;
    total_amount: number;
  };

  return {
    ok: true,
    orderNumber: result.order_number,
    subtotal: Number(result.subtotal),
    deliveryFee: Number(result.delivery_fee),
    total: Number(result.total_amount),
  };
}