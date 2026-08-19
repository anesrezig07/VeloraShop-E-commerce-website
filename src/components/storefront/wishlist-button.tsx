"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useDictionary } from "@/i18n/client";
import { useWishlist } from "@/lib/wishlist/store";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  name,
  slug,
  imageUrl,
  className,
  iconClassName,
}: {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  className?: string;
  iconClassName?: string;
}) {
  const dict = useDictionary();
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(productId);

  function handleToggle() {
    const wasRemoved = toggle({ productId, name, slug, imageUrl });
    toast[wasRemoved ? "info" : "success"](
      wasRemoved ? dict.common.wishlistRemoved : dict.common.wishlistAdded,
      { description: name },
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        "border-background/60 bg-background/90 shadow-card backdrop-blur hover:bg-background",
        active && "border-rose-300 text-rose-600 hover:text-rose-600 dark:border-rose-800",
        className,
      )}
      onClick={handleToggle}
      aria-label={active ? dict.common.removeFromWishlist : dict.common.wishlistAdd}
      aria-pressed={active}
    >
      <Heart
        data-icon="inline"
        className={cn(
          "transition-transform",
          active && "animate-pop fill-rose-500 stroke-rose-500",
          iconClassName,
        )}
      />
    </Button>
  );
}