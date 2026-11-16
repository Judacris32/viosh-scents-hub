'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { productBySlug, type Product, type Size } from '@/content/products';
import { store as storeConfig } from '@/content/store';
import { formatPrice } from './format';

export type CartItem = { slug: string; ml: number; qty: number };

type ShopState = {
  items: CartItem[];
  wishlist: string[];
  add: (slug: string, ml: number, qty?: number) => void;
  setQty: (slug: string, ml: number, qty: number) => void;
  remove: (slug: string, ml: number) => void;
  clear: () => void;
  toggleWish: (slug: string) => void;
};

const MAX_QTY = 10;

export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      items: [],
      wishlist: [],
      add: (slug, ml, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.slug === slug && i.ml === ml);
          if (existing) {
            return {
              items: s.items.map((i) => (i === existing ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i)),
            };
          }
          return { items: [...s.items, { slug, ml, qty: Math.min(MAX_QTY, qty) }] };
        }),
      setQty: (slug, ml, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => !(i.slug === slug && i.ml === ml))
              : s.items.map((i) => (i.slug === slug && i.ml === ml ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)),
        })),
      remove: (slug, ml) => set((s) => ({ items: s.items.filter((i) => !(i.slug === slug && i.ml === ml)) })),
      clear: () => set({ items: [] }),
      toggleWish: (slug) =>
        set((s) => ({
          wishlist: s.wishlist.includes(slug) ? s.wishlist.filter((w) => w !== slug) : [...s.wishlist, slug],
        })),
    }),
    {
      name: 'viosh-shop',
      version: 1,
      storage: createJSONStorage(() => {
        try {
          return window.localStorage;
        } catch {
          // Private mode or blocked storage: keep state in memory only
          const mem = new Map<string, string>();
          return {
            getItem: (k: string) => mem.get(k) ?? null,
            setItem: (k: string, v: string) => void mem.set(k, v),
            removeItem: (k: string) => void mem.delete(k),
          };
        }
      }),
    },
  ),
);

type UIState = {
  cartOpen: boolean;
  searchOpen: boolean;
  quickView: string | null;
  toast: { id: number; text: string } | null;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setQuickView: (slug: string | null) => void;
  showToast: (text: string) => void;
};

export const useUI = create<UIState>()((set) => ({
  cartOpen: false,
  searchOpen: false,
  quickView: null,
  toast: null,
  setCartOpen: (cartOpen) => set(cartOpen ? { cartOpen, toast: null, quickView: null } : { cartOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setQuickView: (quickView) => set({ quickView }),
  showToast: (text) => set({ toast: { id: Date.now(), text } }),
}));

/** True after the first client render, so persisted values never cause a hydration mismatch. */
export function useHydrated() {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  return ok;
}

export type CartLine = CartItem & { product: Product; size: Size; lineTotal: number };

export function resolveLines(items: CartItem[]): CartLine[] {
  return items.flatMap((i) => {
    const product = productBySlug(i.slug);
    const size = product?.sizes.find((s) => s.ml === i.ml);
    if (!product || !size) return [];
    return [{ ...i, product, size, lineTotal: size.price * i.qty }];
  });
}

export function useCart() {
  const items = useShop((s) => s.items);
  const hydrated = useHydrated();
  const lines = hydrated ? resolveLines(items) : [];
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  return { lines, subtotal, count, hydrated };
}

export function whatsappOrderLink(lines: CartLine[], subtotal: number) {
  const rows = lines.map(
    (l) => `• ${l.product.name} (${l.product.concentration === 'Set' ? 'Gift set' : `${l.ml}ml`}) × ${l.qty} — ${formatPrice(l.lineTotal)}`,
  );
  const text = [
    `Hello ${storeConfig.name}, I'd like to order:`,
    '',
    ...rows,
    '',
    `Subtotal: ${formatPrice(subtotal)}`,
    '',
    'My name:',
    'Delivery address:',
  ].join('\n');
  return `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(text)}`;
}
