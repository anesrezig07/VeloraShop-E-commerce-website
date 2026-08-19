import type { Tables } from "@/lib/supabase/database.types";

export type Category = Tables<"categories">;

export type Product = Tables<"products">;

export type ProductImage = Tables<"product_images">;

export type ProductVariant = Tables<"product_variants">;

export type Wilaya = Tables<"wilayas">;

export type DeliveryRate = Tables<"delivery_rates">;

export type Order = Tables<"orders">;

export type OrderItem = Tables<"order_items">;

export type Customer = Tables<"customers">;

export interface ProductWithDetails extends Product {
  category: Category | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface OrderWithDetails extends Order {
  wilaya: Wilaya | null;
  items: OrderItem[];
}

export interface CustomerWithOrders extends Customer {
  wilaya: Wilaya | null;
}

export interface DeliveryRateWithWilaya extends DeliveryRate {
  wilaya: Wilaya;
}

export interface CartLine {
  productId: string;
  variantId: string | null;
  name: string;
  variantName: string | null;
  slug: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  maxStock: number;
}

export interface Cart {
  items: CartLine[];
}

export interface CheckoutSummary {
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryType: "home" | "stop_desk";
  wilayaId: number | null;
}

export interface AdminUserProfile {
  id: string;
  email: string | null;
  role: string;
}
