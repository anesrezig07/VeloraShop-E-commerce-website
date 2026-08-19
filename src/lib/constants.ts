export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const DELIVERY_TYPES = ["home", "stop_desk"] as const;

export type DeliveryType = (typeof DELIVERY_TYPES)[number];

export const ORDER_STATUS_LABELS: Record<
  OrderStatus,
  { fr: string; ar: string }
> = {
  pending: { fr: "En attente", ar: "قيد الانتظار" },
  confirmed: { fr: "Confirmée", ar: "مؤكدة" },
  preparing: { fr: "En préparation", ar: "قيد التحضير" },
  shipped: { fr: "Expédiée", ar: "تم الشحن" },
  delivered: { fr: "Livrée", ar: "تم التسليم" },
  cancelled: { fr: "Annulée", ar: "ملغاة" },
};

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export const DELIVERY_TYPE_LABELS: Record<DeliveryType, { fr: string; ar: string }> = {
  home: { fr: "Livraison à domicile", ar: "التوصيل إلى المنزل" },
  stop_desk: { fr: "Point de retrait", ar: "نقطة استلام" },
};

export const CART_COOKIE_NAME = "velora_cart";

export const SITE_NAME = "Velora Shop";

export const PHONE_NUMBER_PATTERN = /^0(5|6|7)\d{8}$/;

export const PRODUCTS_PER_PAGE = 12;
