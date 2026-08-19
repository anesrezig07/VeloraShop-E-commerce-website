import { Metadata } from "next";

import { CartContent } from "@/components/storefront/cart/cart-content";
import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.cart.title };
}

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 lg:px-6">
      <CartContent />
    </div>
  );
}