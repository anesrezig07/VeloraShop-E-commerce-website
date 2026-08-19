"use client";

import { useRef, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before the reveal transition starts once in view. */
  delay?: number;
  /** Direction the element slides in from. */
  from?: "up" | "down" | "left" | "right" | "none";
  /** Only reveal once. Defaults to true. */
  once?: boolean;
  /** Threshold (0-1) of element visibility needed to trigger. */
  threshold?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
  once = true,
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, threshold]);

  const transformByDirection: Record<
    NonNullable<RevealProps["from"]>,
    string
  > = {
    up: "translate3d(0, 16px, 0)",
    down: "translate3d(0, -16px, 0)",
    left: "translate3d(16px, 0, 0)",
    right: "translate3d(-16px, 0, 0)",
    none: "none",
  };

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0,0,0)" : transformByDirection[from],
        transition: `opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}