"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { updateOrderStatus } from "@/lib/actions/admin";
import { ORDER_STATUS_TRANSITIONS, ORDER_STATUS_LABELS } from "@/lib/constants";
import { useDictionary, useLocale } from "@/i18n/client";

export function OrderStatusActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  const transitions = ORDER_STATUS_TRANSITIONS[currentStatus as keyof typeof ORDER_STATUS_TRANSITIONS] ?? [];

  if (transitions.length === 0) {
    return <p className="text-sm text-muted-foreground">{dict.common.noResults}</p>;
  }

  function handleTransition(status: string) {
    setError(false);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status);
      if (result.ok) {
        router.refresh();
      } else {
        setError(true);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {transitions.map((status) => (
          <Button
            key={status}
            variant="outline"
            size="sm"
            onClick={() => handleTransition(status)}
            disabled={isPending}
          >
            {ORDER_STATUS_LABELS[status][locale]}
          </Button>
        ))}
      </div>
      {error ? (
        <p className="text-sm text-destructive">{dict.admin.genericError}</p>
      ) : null}
    </div>
  );
}