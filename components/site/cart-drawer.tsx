"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useOrder } from "@/hooks/use-order";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_AREAS,
  formatPrice,
  getProduct,
} from "@/lib/data";
import { AREAS, orderSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { cartCount, cartSubtotal, lineKey, useCart } from "@/stores/cart-store";
import { CustomSelect } from "./custom-select";

type Step = "cart" | "checkout" | "done";
type Area = (typeof AREAS)[number];

const iconBtn =
  "inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-pill border border-border transition-colors hover:border-foreground hover:bg-surface";
const field =
  "h-11 w-full rounded-none border-0 border-b border-foreground bg-transparent px-0 text-[15px] shadow-none focus-visible:ring-0 dark:bg-transparent";
const labelCls = "text-[13px] leading-[18px] text-muted-foreground";
const primaryBtn =
  "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-pill bg-foreground text-xs font-semibold tracking-[0.08em] text-background uppercase transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60";

export function CartDrawer() {
  const { lines, isOpen, setOpen, setQty, remove, clear } = useCart();
  const order = useOrder();
  const [step, setStep] = useState<Step>("cart");
  const [values, setValues] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [area, setArea] = useState<Area>("Hay Hassani");
  const [errors, setErrors] = useState<
    Partial<Record<"fullName" | "phone" | "address", string>>
  >({});
  const [doneTotal, setDoneTotal] = useState(0);

  const subtotal = cartSubtotal(lines);
  const delivery = (FREE_DELIVERY_AREAS as readonly string[]).includes(area)
    ? 0
    : DELIVERY_FEE;
  const total = subtotal + delivery;

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open)
      setTimeout(() => setStep((s) => (s === "done" ? "cart" : s)), 250);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = orderSchema.safeParse({
      ...values,
      area,
      items: lines.map(({ slug, option, qty }) => ({ slug, option, qty })),
    });
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (
          (key === "fullName" || key === "phone" || key === "address") &&
          !next[key]
        )
          next[key] = issue.message;
        if (key === "items") toast.error(issue.message);
      }
      setErrors(next);
      return;
    }
    setErrors({});
    try {
      const result = await order.mutateAsync(parsed.data);
      setDoneTotal(result.total);
      clear();
      setStep("done");
    } catch {
      // The mutation already showed the error toast.
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        data-lenis-prevent
        side="right"
        showCloseButton={false}
        className="w-[min(100vw,420px)] gap-0 overflow-hidden border-l border-border bg-background p-0 data-[side=right]:w-[min(100vw,420px)] data-[side=right]:sm:max-w-none"
      >
        <div className="flex min-h-16 items-center justify-between gap-3 border-b border-border px-5">
          <div className="flex items-center gap-2">
            {step === "checkout" && (
              <button
                type="button"
                aria-label="Back to cart"
                onClick={() => setStep("cart")}
                className={cn(iconBtn, "size-9")}
              >
                <ArrowLeft className="size-4" strokeWidth={1.5} />
              </button>
            )}
            <SheetTitle className="font-display text-[28px] leading-none font-normal">
              {step === "checkout"
                ? "CHECKOUT"
                : step === "done"
                  ? "THANK YOU"
                  : `YOUR CART (${cartCount(lines)})`}
            </SheetTitle>
          </div>
          <SheetClose aria-label="Close cart" className={iconBtn}>
            <X className="size-5" strokeWidth={1.5} />
          </SheetClose>
        </div>
        <SheetDescription className="sr-only">
          Review your items and order with cash on delivery.
        </SheetDescription>

        {step === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <CheckCircle2 className="size-14 text-accent" strokeWidth={1.25} />
            <p className="m-0 font-serif text-[30px] leading-[1.1]">
              Order received.
            </p>
            <p className="m-0 text-sm text-muted-foreground">
              Pay {formatPrice(doneTotal)} in cash when it arrives. We will
              message you on WhatsApp to confirm.
            </p>
            <Link
              href="/products"
              onClick={() => onOpenChange(false)}
              className={cn(primaryBtn, "mt-2 w-auto px-8")}
            >
              Keep shopping
            </Link>
          </div>
        )}

        {step === "cart" && lines.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBag className="size-12 text-faint" strokeWidth={1.25} />
            <p className="m-0 font-serif text-[28px] leading-[1.1]">
              Your cart is empty.
            </p>
            <Link
              href="/products"
              onClick={() => onOpenChange(false)}
              className={cn(primaryBtn, "w-auto px-8")}
            >
              Shop products
            </Link>
          </div>
        )}

        {step === "cart" && lines.length > 0 && (
          <>
            <ul className="m-0 flex flex-1 list-none flex-col gap-4 overflow-y-auto p-5">
              {lines.map((l) => {
                const p = getProduct(l.slug);
                if (!p) return null;
                const key = lineKey(l);
                return (
                  <li key={key} className="flex gap-4">
                    <Link
                      href={`/products/${p.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="relative block aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-tag border border-border bg-deep"
                    >
                      <Image
                        src={p.images[0]}
                        alt={p.alt}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="m-0 text-[15px] leading-5 font-semibold">
                          {p.name}
                        </p>
                        <button
                          type="button"
                          aria-label={`Remove ${p.name}`}
                          onClick={() => remove(key)}
                          className="inline-flex size-9 shrink-0 -translate-y-1.5 translate-x-1.5 cursor-pointer items-center justify-center rounded-pill text-faint hover:text-accent"
                        >
                          <Trash2 className="size-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      {l.option && (
                        <p className="m-0 text-[13px] text-muted-foreground">
                          {l.option}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between gap-2">
                        <div className="inline-flex h-11 items-center rounded-pill border border-border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setQty(key, l.qty - 1)}
                            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-pill hover:text-accent"
                          >
                            <Minus className="size-4" strokeWidth={1.5} />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold tabular-nums">
                            {l.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQty(key, l.qty + 1)}
                            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-pill hover:text-accent"
                          >
                            <Plus className="size-4" strokeWidth={1.5} />
                          </button>
                        </div>
                        <p className="m-0 font-display text-2xl leading-none">
                          {formatPrice(p.price * l.qty)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-col gap-3 border-t border-border p-5">
              <p className="m-0 flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-3xl leading-none">
                  {formatPrice(subtotal)}
                </span>
              </p>
              <p className="m-0 text-xs text-muted-foreground">
                Delivery is free in Hay Hassani, Maarif and Médina, and{" "}
                {DELIVERY_FEE} DH elsewhere. Pay cash on delivery.
              </p>
              <button
                type="button"
                onClick={() => setStep("checkout")}
                className={primaryBtn}
              >
                Checkout
              </button>
            </div>
          </>
        )}

        {step === "checkout" && (
          <form
            onSubmit={submit}
            noValidate
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
              <div className="flex flex-col">
                <label htmlFor="o-name" className={labelCls}>
                  Full name
                </label>
                <Input
                  id="o-name"
                  autoComplete="name"
                  value={values.fullName}
                  aria-invalid={!!errors.fullName}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, fullName: e.target.value }))
                  }
                  className={field}
                />
                {errors.fullName && (
                  <p role="alert" className="m-0 pt-1 text-xs text-accent">
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="o-phone" className={labelCls}>
                  Phone (WhatsApp)
                </label>
                <Input
                  id="o-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="06 12 34 56 78"
                  value={values.phone}
                  aria-invalid={!!errors.phone}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, phone: e.target.value }))
                  }
                  className={field}
                />
                {errors.phone && (
                  <p role="alert" className="m-0 pt-1 text-xs text-accent">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="o-area" className={labelCls}>
                  Area
                </label>
                <CustomSelect
                  id="o-area"
                  value={area}
                  onChange={setArea}
                  options={AREAS.map((a) => ({ value: a, label: a }))}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="o-address" className={labelCls}>
                  Address
                </label>
                <Input
                  id="o-address"
                  autoComplete="street-address"
                  value={values.address}
                  aria-invalid={!!errors.address}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, address: e.target.value }))
                  }
                  className={field}
                />
                {errors.address && (
                  <p role="alert" className="m-0 pt-1 text-xs text-accent">
                    {errors.address}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 border-t border-border p-5 text-sm">
              <p className="m-0 flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </p>
              <p className="m-0 flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>{delivery === 0 ? "Free" : formatPrice(delivery)}</span>
              </p>
              <p className="m-0 flex items-baseline justify-between">
                <span className="font-semibold">Total (cash on delivery)</span>
                <span className="font-display text-3xl leading-none">
                  {formatPrice(total)}
                </span>
              </p>
              <button
                type="submit"
                disabled={order.isPending}
                className={cn(primaryBtn, "mt-2")}
              >
                {order.isPending && <Loader2 className="size-4 animate-spin" />}
                {order.isPending ? "Sending" : "Place order"}
              </button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
