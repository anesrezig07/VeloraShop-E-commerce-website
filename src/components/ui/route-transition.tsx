"use client";

import { usePathname } from "next/navigation";

/**
 * Applies a short fade-in transition when the route changes.
 * Changing the key remounts the subtree so the CSS animation replays.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className="animate-fade-up"
      style={{ animationDuration: "0.28s" }}
    >
      {children}
    </div>
  );
}