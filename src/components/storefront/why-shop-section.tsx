import { BadgeCheck, HandCoins, Headset, Truck } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";

export function WhyShopSection({
  dict,
}: {
  dict: {
    whyShopTitle: string;
    whyShopSubtitle: string;
    whyTrusted: string;
    whyTrustedDesc: string;
    whyCod: string;
    whyCodDesc: string;
    whyDelivery: string;
    whyDeliveryDesc: string;
    whySupport: string;
    whySupportDesc: string;
  };
}) {
  const items = [
    { icon: BadgeCheck, title: dict.whyTrusted, desc: dict.whyTrustedDesc },
    { icon: HandCoins, title: dict.whyCod, desc: dict.whyCodDesc },
    { icon: Truck, title: dict.whyDelivery, desc: dict.whyDeliveryDesc },
    { icon: Headset, title: dict.whySupport, desc: dict.whySupportDesc },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold tracking-tight">
          {dict.whyShopTitle}
        </h2>
        <p className="mt-2 text-muted-foreground">{dict.whyShopSubtitle}</p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Reveal key={item.title} delay={index * 70}>
            <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-card transition-shadow hover:shadow-premium">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </span>
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}