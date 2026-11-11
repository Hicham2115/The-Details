"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { CartDrawer } from "@/components/site/cart-drawer";
import { useCart } from "@/stores/cart-store";
import { useFavorites } from "@/stores/favorites-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Load the saved cart and favorites from localStorage (after hydration, so SSR matches).
  useEffect(() => {
    void useCart.persist.rehydrate();
    void useFavorites.persist.rehydrate();
  }, []);

  useEffect(() => {
    history.scrollRestoration = "manual";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({ duration: 1.15, anchors: true });
    lenis.current = instance;
    let frame = requestAnimationFrame(function raf(time) {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  // Every new page starts at the top, unless the link points to a section (#faq).
  useEffect(() => {
    if (window.location.hash) return;
    if (lenis.current) lenis.current.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <QueryClientProvider client={client}>
      {children}
      <CartDrawer />
    </QueryClientProvider>
  );
}
