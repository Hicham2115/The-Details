import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { Sparkle } from "@/components/site/sparkle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Page not found | The Details",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      <Link
        href="/"
        className="absolute top-6 left-1/2 -translate-x-1/2 font-logo text-[32px] leading-none font-bold"
      >
        The Details
      </Link>

      <svg
        aria-hidden="true"
        viewBox="0 0 980 360"
        fill="none"
        className="pointer-events-none absolute top-1/2 left-1/2 w-[min(1100px,140vw)] max-w-none -translate-x-1/2 -translate-y-1/2 text-chrome opacity-40"
      >
        <ellipse
          cx="490"
          cy="180"
          rx="478"
          ry="128"
          transform="rotate(-7 490 180)"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
      <Sparkle
        size={28}
        className="absolute top-[22%] right-[12%] text-foreground"
      />
      <Sparkle
        size={18}
        className="absolute bottom-[24%] left-[10%] text-accent"
      />

      <p className="relative m-0 bg-linear-to-b from-chrome to-chrome/10 bg-clip-text font-display text-[clamp(140px,34vw,380px)] leading-[0.85] text-transparent">
        404
      </p>
      <h1 className="relative m-0 mt-2 font-serif text-[clamp(32px,5vw,56px)] leading-[1.05] font-normal">
        This detail is missing.
      </h1>
      <p className="relative m-0 mt-19 max-w-[420px] text-[15px] leading-[22px] text-muted-foreground">
        The page you are looking for does not exist or has moved. Let&apos;s get
        you back to the good stuff.
      </p>

      <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className={buttonVariants({ variant: "solid", size: "pill" })}
        >
          <span>Back home</span>
          <ArrowUpRight className="size-[18px]" strokeWidth={1.5} />
        </Link>
        <Link
          href="/#best-sellers"
          className={cn(buttonVariants({ variant: "line", size: "pill" }))}
        >
          Shop best sellers
        </Link>
        <Link
          href="/#contact"
          className={buttonVariants({ variant: "line", size: "pill" })}
        >
          <Mail className="size-[18px]" strokeWidth={1.5} />
          <span>Contact us</span>
        </Link>
      </div>
    </main>
  );
}
