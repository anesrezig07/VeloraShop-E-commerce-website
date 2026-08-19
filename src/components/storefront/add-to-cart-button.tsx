"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useDictionary } from "@/i18n/client";
import { useCart, type AddItemInput } from "@/lib/cart/store";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    stock: number;
    imageUrl: string | null;
  };
  unitPrice: number;
  variantId?: string | null;
  variantName?: string | null;
  quantity?: number;
  size?: "default" | "lg" | "sm";
  className?: string;
}

export function AddToCartButton({
  product,
  unitPrice,
  variantId = null,
  variantName = null,
  quantity = 1,
  size = "default",
  className,
}: AddToCartButtonProps) {
  const dict = useDictionary();
  const { addItem } = useCart();

  const availableStock = product.stock;
  const disabled = availableStock <= 0;

  function handleAdd() {
    const input: AddItemInput = {
      productId: product.id,
      variantId,
      name: product.name,
      variantName,
      slug: product.slug,
      imageUrl: product.imageUrl,
      unitPrice,
      quantity,
      maxStock: availableStock,
    };
    addItem(input);
    toast.success(
      `${product.name}${variantName ? ` · ${variantName}` : ""}`,
      { description: dict.common.addToCart },
    );
  }

  return (
    <Button
      type="button"
      size={size}
      onClick={handleAdd}
      disabled={disabled}
      className={className}
      aria-label={dict.common.addToCart}
    >
      <Plus data-icon="inline-start" />
      {dict.common.addToCart}
    </Button>
  );
}