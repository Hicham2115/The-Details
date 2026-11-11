"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, ShoppingBag, Truck, Wallet, Clock } from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { discountPercent, formatPrice, productOptions, type Product } from "@/lib/data";
import { useCart } from "@/stores/cart-store";
import { useFavorites } from "@/stores/favorites-store";
import { cn } from "@/lib/utils";


const tagStyle: Record<NonNullable<Product["tag"]>, string> = {
  New: "bg-tag-new text-foreground",
  Sale: "bg-tag-sale text-accent",
  "Pre-order": "bg-tag-preorder text-foreground",
};

const basePerks = [
  { icon: Wallet, title: "Cash on delivery", text: "Pay in dirhams when your order arrives." },
  { icon: Truck, title: "30 DH delivery", text: "Anywhere in Casablanca." },
  { icon: Clock, title: "Delivered within 1 day", text: "We message you as soon as it ships." },
];

export function ProductDetail({ p }: { p: Product }) {
  const [index, setIndex] = useState(0);
  const sizes = productOptions(p) ?? [];
  const hasOption = sizes.length > 0;
  const label = p.optionLabel ?? "Size";
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const liked = useFavorites((s) => s.slugs.includes(p.slug));
  const toggleFav = useFavorites((s) => s.toggle);
  const [size, setSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const count = p.images.length;
  const go = (i: number) => setIndex((i + count) % count);

  const addToCart = () => {
    if (hasOption && !size) {
      setSizeError(true);
      toast.error(`Pick a ${label.toLowerCase()} first`);
      return;
    }
    add(p.slug, size, qty);
    openCart();
  };

  return (
    <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start gap-12 tablet:grid-cols-1 tablet:gap-8">
      {/* Gallery */}
      <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-4 tablet:grid-cols-1 tablet:gap-3">
        <ul className="m-0 flex list-none flex-col gap-3 p-0 tablet:order-2 tablet:flex-row tablet:overflow-x-auto tablet:pb-1">
          {p.images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "relative block aspect-[4/5] w-[84px] cursor-pointer overflow-hidden rounded-tag border bg-deep transition-all tablet:w-16",
                  i === index ? "border-accent" : "border-border opacity-60 hover:border-foreground hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="84px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>

        <div className="group relative aspect-[4/5] overflow-hidden rounded-card border border-border bg-deep tablet:order-1">
          {p.images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={i === 0 ? p.alt : `${p.name}, photo ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(max-width: 900px) 100vw, 600px"
              className={cn(
                "object-cover transition-[opacity,scale] duration-700 ease-out group-hover:scale-105",
                i === index ? "opacity-100" : "opacity-0",
              )}
            />
          ))}

          {p.tag && (
            <span
              className={cn(
                "absolute top-4 left-4 inline-flex items-center rounded-tag px-2 py-1 text-xs leading-4 font-semibold tracking-[0.08em] uppercase",
                tagStyle[p.tag],
              )}
            >
              {p.tag}
            </span>
          )}

          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => go(index - 1)}
                className="absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-pill border border-border bg-surface/90 transition-colors hover:border-accent hover:text-accent"
              >
                <ChevronLeft className="size-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => go(index + 1)}
                className="absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-pill border border-border bg-surface/90 transition-colors hover:border-accent hover:text-accent"
              >
                <ChevronRight className="size-5" strokeWidth={1.5} />
              </button>
              <span className="absolute right-4 bottom-4 rounded-pill border border-border bg-surface/90 px-3 py-1 font-display text-sm leading-none tabular-nums">
                {index + 1} / {count}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-4">
        <div className="flex flex-col gap-3">
          <p className="m-0 text-xs leading-4 font-semibold tracking-[0.08em] text-faint uppercase">{p.category}</p>
          <h1 className="m-0 font-serif text-[clamp(34px,4.4vw,60px)] leading-[1.03] font-normal">{p.name}</h1>
          <p className="m-0 text-sm text-muted-foreground">{p.variant}</p>
          <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-2 font-display text-[44px] leading-none text-accent">
            <span>{formatPrice(p.price)}</span>
            <span className="font-sans text-lg font-normal text-faint line-through">{formatPrice(p.oldPrice)}</span>
            <span className="self-center rounded-tag bg-tag-sale px-2 py-1 font-sans text-xs leading-4 font-semibold tracking-[0.08em] uppercase">
              Promo −{discountPercent(p)}%
            </span>
          </p>
          <p className="m-0 text-xs text-muted-foreground">All prices are promo prices for a limited time.</p>
        </div>

        {hasOption && (
          <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
            <legend className="mb-3 flex w-full items-center justify-between p-0 text-xs font-semibold tracking-[0.08em] uppercase">
              <span className="text-faint">{label}</span>
              {sizeError && <span role="alert" className="text-accent normal-case tracking-normal">Pick a {label.toLowerCase()}</span>}
            </legend>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={size === s}
                  onClick={() => {
                    setSize(s);
                    setSizeError(false);
                  }}
                  className={cn(
                    "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-pill border px-6 text-xs font-semibold tracking-[0.04em] uppercase transition-colors",
                    size === s
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground hover:bg-surface",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex h-12 items-center rounded-pill border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-pill hover:text-accent"
            >
              <Minus className="size-4" strokeWidth={1.5} />
            </button>
            <span aria-live="polite" className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-pill hover:text-accent"
            >
              <Plus className="size-4" strokeWidth={1.5} />
            </button>
          </div>

          <button
            type="button"
            onClick={addToCart}
            className={cn(buttonVariants({ variant: "solid", size: "pill" }), "h-12 min-w-[180px] flex-1 cursor-pointer")}
          >
            <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
            <span>Add to cart · {formatPrice(p.price * qty)}</span>
          </button>

          <button
            type="button"
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={liked}
            onClick={() => toast(toggleFav(p.slug) ? "Saved to wishlist" : "Removed from wishlist")}
            className={cn(
              "inline-flex size-12 cursor-pointer items-center justify-center rounded-pill border transition-colors",
              liked ? "border-accent bg-tag-sale text-accent" : "border-border hover:border-accent hover:text-accent",
            )}
          >
            <Heart className={cn("size-5", liked && "fill-current")} strokeWidth={1.5} />
          </button>
        </div>

        <ul className="m-0 flex list-none flex-col divide-y divide-border rounded-card border border-border bg-surface p-0">
          {basePerks.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4 p-4">
              <Icon className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.5} />
              <div>
                <p className="m-0 text-sm leading-5 font-semibold">{title}</p>
                <p className="m-0 text-[13px] leading-[18px] text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
