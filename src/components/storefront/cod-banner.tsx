import { HandCoins, Truck } from "lucide-react";

export function CodBanner({
  dict,
}: {
  dict: {
    codTitle: string;
    codDescription: string;
    deliveryTitle: string;
    deliveryDescription: string;
  };
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-xl bg-primary p-6 text-primary-foreground">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary-foreground/15">
            <HandCoins className="size-5" />
          </span>
          <h3 className="font-heading text-lg font-bold">{dict.codTitle}</h3>
          <p className="text-sm text-primary-foreground/85">{dict.codDescription}</p>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-6">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Truck className="size-5" />
          </span>
          <h3 className="font-heading text-lg font-bold">{dict.deliveryTitle}</h3>
          <p className="text-sm text-muted-foreground">{dict.deliveryDescription}</p>
        </div>
      </div>
    </section>
  );
}