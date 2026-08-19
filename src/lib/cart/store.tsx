"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import type { Cart, CartLine } from "@/lib/types";

const STORAGE_KEY = "velora_cart";

let items: CartLine[] = [];
let initialized = false;
const listeners = new Set<() => void>();

function readStoredCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Cart;
    if (!Array.isArray(parsed.items)) return [];
    return parsed.items
      .filter((item) => item && typeof item.productId === "string")
      .map((item) => ({
        ...item,
        quantity: Math.max(1, Math.min(item.maxStock, item.quantity)),
      }));
  } catch {
    return [];
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
  } catch {
    // Storage full or unavailable — cart stays in memory.
  }
}

function getSnapshot(): CartLine[] {
  if (!initialized) {
    items = readStoredCart();
    initialized = true;
  }
  return items;
}

function getServerSnapshot(): CartLine[] {
  return [];
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function commit(next: CartLine[]) {
  items = next;
  persist();
  for (const listener of listeners) listener();
}

export interface AddItemInput {
  productId: string;
  variantId: string | null;
  name: string;
  variantName: string | null;
  slug: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity?: number;
  maxStock: number;
}

interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (input: AddItemInput) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((input: AddItemInput) => {
    commit(
      (() => {
        const existing = items.find(
          (item) =>
            item.productId === input.productId && item.variantId === input.variantId,
        );

        if (existing) {
          const nextQuantity = Math.min(
            input.maxStock,
            existing.quantity + (input.quantity ?? 1),
          );
          return items.map((item) =>
            item.productId === input.productId && item.variantId === input.variantId
              ? { ...item, quantity: nextQuantity, unitPrice: input.unitPrice }
              : item,
          );
        }

        return [
          ...items,
          {
            productId: input.productId,
            variantId: input.variantId,
            name: input.name,
            variantName: input.variantName,
            slug: input.slug,
            imageUrl: input.imageUrl,
            unitPrice: input.unitPrice,
            quantity: Math.max(1, Math.min(input.maxStock, input.quantity ?? 1)),
            maxStock: input.maxStock,
          },
        ];
      })(),
    );
  }, [items]);

  const updateQuantity = useCallback(
    (productId: string, variantId: string | null, quantity: number) => {
      commit(
        items
          .map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity: Math.max(1, Math.min(item.maxStock, quantity)) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
    },
    [items],
  );

  const removeItem = useCallback((productId: string, variantId: string | null) => {
    commit(
      items.filter(
        (item) => !(item.productId === productId && item.variantId === variantId),
      ),
    );
  }, [items]);

  const clear = useCallback(() => commit([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    }),
    [items, itemCount, subtotal, addItem, updateQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }
  return context;
}