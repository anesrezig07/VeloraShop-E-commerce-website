"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: { url: string; alt_text: string | null; display_order: number; is_primary: boolean }[];
  name: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border bg-muted text-muted-foreground">
        Velora
      </div>
    );
  }

  const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
  const active = sorted[activeIndex] ?? sorted[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
        <Image
          src={active.url}
          alt={active.alt_text ?? name}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      {sorted.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${name} — image ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-lg border bg-muted transition-colors",
                index === activeIndex
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-foreground/30",
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="80px"
                loading="lazy"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}