"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SearchBox } from "./search-box";
import { cartCount, useCart } from "@/stores/cart-store";
import { useFavorites } from "@/stores/favorites-store";

// "#section" links need the home path in front on other pages; real paths like "/products" must not get it.
const linkTo = (base: string, href: string) => (href.startsWith("#") ? `${base}${href}` : href);

const iconBtn =
  "inline-flex size-11 items-center justify-center rounded-pill border border-border text-foreground transition-colors hover:border-foreground hover:bg-surface";
const label = "text-xs leading-4 font-semibold tracking-[0.08em] uppercase";

export function Navbar({ base = "" }: { base?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const count = useCart((s) => cartCount(s.lines));
  const openCart = useCart((s) => s.open);
  const favCount = useFavorites((s) => s.slugs.length);
  return (
    <header className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-5 phone:gap-2 phone:py-3">
      <Link
        href={`${base}#top`}
        aria-label="The Details — home"
        className="col-start-2 row-start-1 inline-flex items-center justify-self-center"
      >
        <span className="font-logo text-[32px] leading-none font-bold tracking-[0.01em] phone:text-[28px]">
          The Details
        </span>
      </Link>

      {/* Phone / tablet: hamburger + left drawer */}
      <div className="col-start-1 row-start-1 hidden justify-self-start tablet:block">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className={cn(iconBtn, "cursor-pointer")}
          >
            <Menu className="size-5" strokeWidth={1.5} />
          </SheetTrigger>
          <SheetContent
            data-lenis-prevent
            side="left"
            showCloseButton={false}
            className="w-[min(86vw,340px)] gap-2 overflow-y-auto rounded-r-2xl border-r border-border bg-background px-5 pt-4 pb-6 shadow-[12px_0_40px_rgb(0_0_0/0.28)] data-[side=left]:w-[min(86vw,340px)] data-[side=left]:data-ending-style:-translate-x-full data-[side=left]:data-starting-style:-translate-x-full data-[side=left]:sm:max-w-none"
          >
            <div className="mb-2 flex min-h-11 items-center justify-between">
              <SheetTitle className="font-logo text-[28px] leading-none font-bold">
                The Details
              </SheetTitle>
              <SheetClose
                aria-label="Close menu"
                className={cn(iconBtn, "cursor-pointer bg-transparent")}
              >
                <X className="size-5" strokeWidth={1.5} />
              </SheetClose>
            </div>
            <SheetDescription className="sr-only">
              Site navigation
            </SheetDescription>

            <div className="mb-2">
              <SearchBox className="h-11" inputClassName="text-sm" onSearch={() => setMenuOpen(false)} />
            </div>

            <nav
              aria-label="Mobile"
              className="flex flex-col border-t border-border"
            >
              {navLinks.map((l) => (
                <SheetClose
                  key={l.href}
                  nativeButton={false}
                  render={<a href={linkTo(base, l.href)} />}
                  className="flex min-h-14 items-center justify-between border-b border-border px-1 font-display text-[34px] leading-none tracking-[0.01em] uppercase transition-colors hover:text-accent"
                >
                  <span>{l.label}</span>
                  <ArrowUpRight className="size-5" strokeWidth={1.5} />
                </SheetClose>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-6">
              <SheetClose
                nativeButton={false}
                render={<a href={`${base}#collections`} />}
                className="inline-flex h-12 items-center justify-center rounded-pill bg-foreground px-6 text-xs leading-4 font-semibold tracking-[0.08em] text-background uppercase transition-colors hover:bg-accent"
              >
                Shop now
              </SheetClose>
              <div className="flex items-center justify-between text-[13px] text-muted-foreground">
                {["Instagram", "TikTok", "WhatsApp"].map((s) => (
                  <a
                    key={s}
                    href={`${base}#${s.toLowerCase()}`}
                    className="inline-flex min-h-11 items-center hover:text-accent"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop pill nav */}
      <nav
        aria-label="Primary"
        className="col-start-1 row-start-1 flex items-center gap-1 justify-self-start rounded-pill border border-border bg-surface p-1 tablet:hidden"
      >
        {navLinks.map((l, i) => (
          <a
            key={l.href}
            href={linkTo(base, l.href)}
            aria-current={i === 0 ? "page" : undefined}
            className={cn(
              label,
              "inline-flex h-11 items-center rounded-pill border px-3.5 transition-colors hover:border-foreground hover:bg-background",
              i === 0 ? "border-foreground" : "border-transparent",
            )}
          >
            <span className="flip">
              <span>{l.label}</span>
              <span aria-hidden="true">{l.label}</span>
            </span>
          </a>
        ))}
      </nav>

      <div className="col-start-3 row-start-1 flex items-center justify-end gap-2 justify-self-end">
        <SearchBox className="h-11 w-[200px] tablet:hidden" />
        <Link
          href="/wishlist"
          aria-label={`Wishlist, ${favCount} items`}
          className={cn(iconBtn, "relative")}
        >
          <Heart className="size-5" strokeWidth={1.5} />
          {favCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-accent px-1 text-[11px] font-semibold text-background">
              {favCount}
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={openCart}
          aria-label={`Cart, ${count} items`}
          className={cn(
            iconBtn,
            label,
            "w-auto cursor-pointer gap-2 px-4 phone:gap-1.5 phone:px-3",
          )}
        >
          <ShoppingBag className="size-5" strokeWidth={1.5} />
          <span className="phone:hidden">Cart</span>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-foreground px-1.5 text-[11px] tracking-normal text-background">
            {count}
          </span>
        </button>
      </div>
    </header>
  );
}
