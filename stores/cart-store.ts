import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct } from "@/lib/data";

export type CartLine = { slug: string; option: string | null; qty: number };

export const lineKey = (l: Pick<CartLine, "slug" | "option">) =>
  `${l.slug}|${l.option ?? ""}`;

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  add: (slug: string, option: string | null, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  setOpen: (isOpen: boolean) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      add: (slug, option, qty = 1) =>
        set((s) => {
          const key = lineKey({ slug, option });
          const exists = s.lines.some((l) => lineKey(l) === key);
          const lines = exists
            ? s.lines.map((l) =>
                lineKey(l) === key
                  ? { ...l, qty: Math.min(10, l.qty + qty) }
                  : l,
              )
            : [...s.lines, { slug, option, qty: Math.min(10, qty) }];
          return { lines };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          lines: s.lines.map((l) =>
            lineKey(l) === key
              ? { ...l, qty: Math.min(10, Math.max(1, qty)) }
              : l,
          ),
        })),
      remove: (key) =>
        set((s) => ({ lines: s.lines.filter((l) => lineKey(l) !== key) })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "the-details-cart",
      partialize: (s) => ({ lines: s.lines }),
      skipHydration: true, // rehydrated on the client in <Providers> to avoid SSR mismatches
    },
  ),
);

export const cartCount = (lines: CartLine[]) =>
  lines.reduce((n, l) => n + l.qty, 0);

export const cartSubtotal = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + (getProduct(l.slug)?.price ?? 0) * l.qty, 0);
