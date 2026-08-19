"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { adminSignOut } from "@/lib/actions/admin-auth";
import { useDictionary, useLocale } from "@/i18n/client";

export function LogoutButton() {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await adminSignOut();
      router.push(`/${locale}/admin/login`);
      router.refresh();
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={isPending}
    >
      <LogOut data-icon="inline-start" />
      {dict.admin.signOut}
    </Button>
  );
}