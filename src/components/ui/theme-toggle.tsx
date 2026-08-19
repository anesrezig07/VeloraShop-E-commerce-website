"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { useDictionary } from "@/i18n/client";

function emptySubscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const dict = useDictionary();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      aria-label={dict.common.themeToggle}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (
        isDark ? (
          <Sun className="animate-scale-in" />
        ) : (
          <Moon className="animate-scale-in" />
        )
      ) : (
        <span className="size-4" />
      )}
    </Button>
  );
}