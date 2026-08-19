"use client";

import { HandCoins, Sparkles, Truck } from "lucide-react";

import { useDictionary } from "@/i18n/client";

const ICONS = {
  delivery: Truck,
  cod: HandCoins,
  offers: Sparkles,
} as const;

export function AnnouncementBar() {
  const dict = useDictionary();
  const items = [
    { icon: "delivery", text: dict.announcement.delivery },
    { icon: "cod", text: dict.announcement.cod },
    { icon: "offers", text: dict.announcement.offers },
  ] as const;

  const content = (
    <div className="flex shrink-0 items-center gap-10 pe-10">
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        return (
          <span
            key={item.text}
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium"
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {item.text}
          </span>
        );
      })}
    </div>
  );

  return (
    <div className="overflow-hidden border-b bg-primary text-primary-foreground">
      <div className="flex w-max animate-marquee py-2">
        {content}
        {content}
      </div>
    </div>
  );
}