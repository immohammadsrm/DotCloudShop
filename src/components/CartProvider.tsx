"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProductById, unitPrice, type Product } from "@/lib/products";

interface CartLine {
  id: string;
  /** Selected variant name, for products with options */
  variant?: string;
  qty: number;
}

export interface CartItem {
  /** Unique per product + variant */
  key: string;
  product: Product;
  variant?: string;
  qty: number;
  unit: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (id: string, qty?: number, variant?: string) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "dotcloudshop-cart";

const lineKey = (l: { id: string; variant?: string }) => (l.variant ? `${l.id}::${l.variant}` : l.id);

function isValid(l: CartLine): boolean {
  const p = getProductById(l.id);
  if (!p || !(l.qty > 0)) return false;
  if (!l.variant) return true;
  return Boolean(p.variants?.some((x) => x.name === l.variant && x.inStock));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines((JSON.parse(raw) as CartLine[]).filter(isValid));
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback((id: string, qty = 1, variant?: string) => {
    const key = lineKey({ id, variant });
    setLines((prev) =>
      prev.some((l) => lineKey(l) === key)
        ? prev.map((l) => (lineKey(l) === key ? { ...l, qty: l.qty + qty } : l))
        : [...prev, { id, variant, qty }]
    );
  }, []);
  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => lineKey(l) !== key) : prev.map((l) => (lineKey(l) === key ? { ...l, qty } : l))
    );
  }, []);
  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => lineKey(l) !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const items: CartItem[] = [];
    for (const l of lines) {
      const product = getProductById(l.id);
      if (!product) continue;
      items.push({ key: lineKey(l), product, variant: l.variant, qty: l.qty, unit: unitPrice(product, l.variant) });
    }
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.unit, 0),
      ready,
      add,
      setQty,
      remove,
      clear,
    };
  }, [lines, ready, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
