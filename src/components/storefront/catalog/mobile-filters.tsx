"use client";

import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileFilters({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm" className="lg:hidden">
            <SlidersHorizontal data-icon="inline-start" />
            {label}
          </Button>
        }
      />
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>{label}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 px-4 pb-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}