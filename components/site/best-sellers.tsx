"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatPrice, productOptions, products, type Product } from "@/lib/data";
import { useCart } from "@/stores/cart-store";
import { useFavorites } from "@/stores/favorites-store";
import { cn } from "@/lib/utils";
import { SectionHead, SectionTitle } from "./section-head";

const tagStyle: Record<NonNullable<Product["tag"]>, string> = {
  New: "bg-tag-new text-foreground",
  Sale: "bg-tag-sale text-accent",
  "Pre-order": "bg-tag-preorder text-foreground",
};

export function ProductCard({ p }: { p: Product }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const isFav = useFavorites((s) => s.slugs.includes(p.slug));
  const toggleFav = useFavorites((s) => s.toggle);

  const quickAdd = () => {
    const options = productOptions(p);
    // More than one choice (e.g. ring pack): send them to the page to pick.
    if (options && options.length > 1) {
      toast("Pick an option first");
      router.push(`/products/${p.slug}`);
      return;
    }
    add(p.slug, options?.[0] ?? null, 1);
    openCart();
  };

  return (
    <article className="relative flex flex-col gap-3 rounded-card border border-border bg-surface p-3 group transition-all duration-400 hover:border-accent hover:shadow-glow phone:gap-2 phone:p-2">
      <div className="relative aspect-[4/5] overflow-hidden rounded-tag bg-deep">
        <Image
          src={p.images[0]}
          alt={p.alt}
          fill
          sizes="(max-width: 900px) 50vw, 300px"
          className={cn(
            "object-cover transition-[scale,opacity] duration-700 ease-out will-change-transform group-hover:scale-105",
            p.images[1] && "group-hover:opacity-0",
          )}
        />
        {p.images[1] && (
          <Image
            src={p.images[1]}
            alt=""
            fill
            sizes="(max-width: 900px) 50vw, 300px"
            className="object-cover opacity-0 transition-[scale,opacity] duration-700 ease-out will-change-transform group-hover:scale-105 group-hover:opacity-100"
          />
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        />
        {p.tag && (
          <span
            className={cn(
              "absolute top-3 left-3 inline-flex items-center rounded-tag px-2 py-1 text-xs leading-4 font-semibold tracking-[0.08em] uppercase",
              tagStyle[p.tag],
            )}
          >
            {p.tag}
          </span>
        )}
        <button
          type="button"
          aria-label={isFav ? `Remove ${p.name.split(" — ")[0]} from wishlist` : `Add ${p.name.split(" — ")[0]} to wishlist`}
          aria-pressed={isFav}
          onClick={() => {
            const now = toggleFav(p.slug);
            toast(now ? "Saved to wishlist" : "Removed from wishlist");
          }}
          className={cn(
            "absolute top-2 right-2 z-10 inline-flex size-11 cursor-pointer items-center justify-center rounded-pill border border-border bg-surface text-foreground transition-all hover:scale-110 hover:border-accent hover:bg-tag-sale hover:text-accent",
            isFav && "border-accent bg-tag-sale text-accent",
          )}
        >
          <Heart className={cn("size-5", isFav && "fill-current")} strokeWidth={1.5} />
        </button>
      </div>
      <div className="flex items-end justify-between gap-3 px-1 pb-1">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="m-0 text-[15px] leading-[22px] font-semibold transition-colors group-hover:text-accent phone:text-sm phone:leading-5">
            <Link href={`/products/${p.slug}`} className="after:absolute after:inset-0 after:z-0 after:content-['']">
              {p.name}
            </Link>
          </h3>
          <p className="m-0 text-[13px] leading-[18px] text-muted-foreground phone:text-xs phone:leading-4">
            {p.variant}
          </p>
          <p
            className={cn(
              "mt-1 flex items-baseline gap-2 text-base leading-5 font-semibold phone:text-[15px]",
              p.oldPrice && "text-accent",
            )}
          >
            <span>{formatPrice(p.price)}</span>
            {p.oldPrice && (
              <span className="text-sm font-normal text-faint line-through">
                {formatPrice(p.oldPrice)}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          aria-label={`Add ${p.name.split(" — ")[0]} to cart`}
          onClick={quickAdd}
          className="relative z-10 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-pill bg-foreground text-background transition-all hover:scale-110 hover:bg-accent"
        >
          <Plus
            className="size-5 transition-transform group-hover:rotate-90"
            strokeWidth={1.5}
          />
        </button>
      </div>
    </article>
  );
}

export function BestSellers() {
  return (
    <section
      id="best-sellers"
      aria-labelledby="best-title"
      className="mt-20 tablet:mt-16"
    >
      <SectionHead>
        <SectionTitle id="best-title">BEST SELLERS</SectionTitle>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="m-0 font-serif text-[22px] leading-[1.2] text-muted-foreground phone:text-lg">
            Found, not mass-made.
          </p>
          <Link
            href="/products"
            className={buttonVariants({ variant: "line", size: "pill" })}
          >
            <span>View all</span>
            <ArrowUpRight className="size-[18px]" strokeWidth={1.5} />
          </Link>
        </div>
      </SectionHead>
      <div className="grid grid-cols-4 gap-6 tablet:grid-cols-2 tablet:gap-4 phone:gap-2.5">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.name} p={p} />
        ))}
      </div>
    </section>
  );
}
