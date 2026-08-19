"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { deleteProduct, toggleProductActive } from "@/lib/actions/admin";
import { useDictionary } from "@/i18n/client";

export function ProductRowActions({
  productId,
  isActive,
  name,
}: {
  productId: string;
  isActive: boolean;
  name: string;
}) {
  const dict = useDictionary();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState(false);

  function handleToggle(next: boolean) {
    startTransition(async () => {
      await toggleProductActive(productId, next);
      router.refresh();
    });
  }

  function handleDelete() {
    setDeleteError(false);
    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (result.ok) {
        router.refresh();
      } else {
        setDeleteError(true);
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Switch checked={isActive} onCheckedChange={handleToggle} disabled={isPending} aria-label={dict.admin.active} />
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label={dict.common.delete}>
              <Trash2 />
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dict.common.delete}</AlertDialogTitle>
            <AlertDialogDescription>
              {name} — {dict.common.delete}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError ? (
            <p className="text-sm text-destructive">{dict.admin.genericError}</p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel>{dict.common.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {dict.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}