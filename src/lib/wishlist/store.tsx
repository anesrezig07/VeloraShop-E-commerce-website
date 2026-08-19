"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "velora_wishlist";

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

let items: WishlistItem[] = [];
let initialized = false;
const listeners = new Set<() => void>();

function readStoredWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WishlistItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.productId === "string");
  } catch {
    return [];
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — wishlist stays in memory.
  }
}

function getSnapshot(): WishlistItem[] {
  if (!initialized) {
    items = readStoredWishlist();
    initialized = true;
  }
  return items;
}

function getServerSnapshot(): WishlistItem[] {
  return [];
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function commit(next: WishlistItem[]) {
  items = next;
  persist();
  for (const listener of listeners) listener();
}

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  isWishlisted: (productId: string) => boolean;
  toggle: (item: WishlistItem) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isWishlisted = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items],
  );

  const toggle = useCallback((item: WishlistItem) => {
    const exists = items.some(
      (entry) => entry.productId === item.productId,
    );
    if (exists) {
      commit(items.filter((entry) => entry.productId !== item.productId));
    } else {
      commit([...items, item]);
    }
    return exists;
  }, [items]);

  const count = useMemo(() => items.length, [items]);

  const value = useMemo(
    () => ({ items, count, isWishlisted, toggle }),
    [items, count, isWishlisted, toggle],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider.");
  }
  return context;
}