"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Sticky header wrapper that shrinks and adds shadow after scrolling.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-background/85 backdrop-blur-md transition-all duration-300",
        scrolled
          ? "shadow-card supports-[backdrop-filter]:bg-background/90"
          : "border-b",
      )}
    >
      {children}
    </header>
  );
}