import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkle } from "./sparkle";

const slot =
  "relative min-w-0 overflow-hidden rounded-card border border-border bg-deep tablet:h-[min(54vw,380px)] tablet:max-w-none tablet:rounded-tag";

export function Hero() {
  return (
    <section
      id="new"
      aria-labelledby="hero-title"
      className="relative flex flex-col overflow-hidden rounded-card border border-border bg-background"
    >
      <svg
        aria-hidden="true"
        width="980"
        height="360"
        viewBox="0 0 980 360"
        fill="none"
        className="pointer-events-none absolute top-[56%] left-1/2 z-0 max-w-none -translate-x-1/2 -translate-y-1/2 text-chrome tablet:hidden"
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
        <path
          transform="translate(46 188) scale(0.9)"
          fill="currentColor"
          d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z"
        />
        <path
          transform="translate(918 142) scale(0.55)"
          fill="currentColor"
          d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z"
        />
      </svg>
      <Sparkle
        size={26}
        className="absolute top-3.5 right-4 z-3 text-foreground tablet:hidden"
      />

      <h1
        id="hero-title"
        className="relative z-1 m-0 px-4 pt-6 text-center font-display text-[clamp(52px,15vw,216px)] leading-[0.9] font-normal tracking-[-0.01em] whitespace-nowrap tablet:px-3 tablet:text-[15vw]"
      >
        NEW COLLECTION
      </h1>

      <div className="relative -mt-[90px] grid grid-cols-[minmax(220px,1fr)_minmax(0,62%)_minmax(220px,1fr)] tablet:mt-0 tablet:grid-cols-1">
        {/* Left copy */}
        <div className="relative z-3 flex flex-col items-start gap-5 self-start pt-[140px] pl-8 tablet:order-3 tablet:w-full tablet:gap-4 tablet:px-[clamp(20px,4vw,40px)] tablet:pt-4 tablet:pb-2">
          <p className="m-0 max-w-[190px] text-[15px] leading-[22px] font-medium tablet:max-w-none tablet:whitespace-nowrap">
            Get 30% discount on your first order
          </p>
          <a
            href="#collections"
            className={cn(
              buttonVariants({ variant: "solid", size: "pill" }),
              "tablet:h-12 tablet:w-full",
            )}
          >
            <span>Shop now</span>
            <ArrowUpRight className="size-[18px]" strokeWidth={1.5} />
          </a>
        </div>

        {/* Photos */}
        <div className="relative z-2 flex min-h-[clamp(532px,29vw,720px)] items-end justify-center gap-4 px-4 pb-14 tablet:order-1 tablet:min-h-0 tablet:gap-[clamp(6px,1.6vw,14px)] tablet:px-[clamp(12px,3vw,32px)] tablet:pb-5">
          <div className={cn(slot, "h-[clamp(440px,24vw,600px)] flex-[1_1_0]")}>
            <Image
              src="/images/hero-left.webp"
              alt="Model with long dark hair in a graphic white tank top, snake pendant and silver jewelry, sitting on a couch"
              fill
              priority
              sizes="(max-width: 900px) 33vw, 250px"
              className="object-cover group-hover:scale-105 object-[100%_50%]"
            />
          </div>
          <div
            className={cn(
              slot,
              "h-[clamp(510px,28vw,690px)] flex-[1.25_1_0] tablet:h-[min(69vw,490px)] tablet:flex-[1.6_1_0]",
            )}
          >
            <Image
              src="/images/hero-center.webp"
              alt="Model with curly hair and sunglasses in an oversized white tee with a star pendant and chain necklace"
              fill
              priority
              sizes="(max-width: 900px) 40vw, 310px"
              className="object-cover group-hover:scale-105 object-[33.0741%_50%]"
            />
          </div>
          <div className={cn(slot, "h-[clamp(440px,24vw,600px)] flex-[1_1_0]")}>
            <Image
              src="/images/hero-right.webp"
              alt="Model with curly hair in a red and black star-print top with a snake necklace"
              fill
              priority
              sizes="(max-width: 900px) 33vw, 250px"
              className="object-cover group-hover:scale-105 object-[0%_50%]"
            />
          </div>
        </div>

        {/* Right copy */}
        <div className="relative z-3 flex flex-col items-end gap-3 self-start pt-[140px] pr-8 text-right tablet:order-2 tablet:items-start tablet:gap-2 tablet:px-[clamp(20px,4vw,40px)] tablet:pt-1 tablet:text-left">
          <p className="m-0 font-serif text-[40px] leading-[1.05] font-normal tablet:text-[clamp(36px,5vw,56px)]">
            Wear the
            <br />
            details.
          </p>
          <p className="m-0 max-w-[200px] text-[13px] leading-[18px] text-muted-foreground tablet:max-w-none tablet:whitespace-nowrap">
            Vintage &amp; Y2K belts, buckles, rings and cases.
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-1 z-3 flex items-center justify-center tablet:hidden"
      >
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="flex h-11 w-8 items-center justify-center">
            <span
              className={cn(
                "block h-1.5 rounded-pill",
                i === 0 ? "w-[18px] bg-foreground" : "w-1.5 bg-faint",
              )}
            />
          </span>
        ))}
      </div>
    </section>
  );
}
