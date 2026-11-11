"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { products } from "@/lib/data";
import { useFavorites } from "@/stores/favorites-store";
import { ProductCard } from "./best-sellers";

export function WishlistGrid() {
  const slugs = useFavorites((s) => s.slugs);
  const saved = products.filter((p) => slugs.includes(p.slug));

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-border px-6 py-20 text-center">
        <Heart className="size-12 text-faint" strokeWidth={1.25} />
        <p className="m-0 font-serif text-[32px] leading-[1.1]">Nothing saved yet.</p>
        <p className="m-0 max-w-[320px] text-sm text-muted-foreground">Tap the heart on any product to keep it here.</p>
        <Link href="/products" className={buttonVariants({ variant: "solid", size: "pill" })}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6 tablet:grid-cols-2 tablet:gap-4 phone:gap-2.5">
      {saved.map((p) => (
        <ProductCard key={p.slug} p={p} />
      ))}
    </div>
  );
}
