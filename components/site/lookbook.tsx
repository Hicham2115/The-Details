import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { hotspots } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SectionHead, SectionTitle } from "./section-head";

const layout = {
  left: "flex-row-reverse -translate-x-[calc(100%-22px)]",
  mid: "-translate-x-[22px] tablet:flex-col tablet:items-start tablet:gap-0.5",
  end: "flex-row-reverse -translate-x-[calc(100%-22px)] tablet:flex-col-reverse tablet:items-end tablet:gap-0.5",
} as const;

export function Lookbook() {
  return (
    <section id="lookbook" aria-labelledby="look-title" className="mt-20 tablet:mt-16">
      <SectionHead>
        <SectionTitle id="look-title">LOOKBOOK</SectionTitle>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="m-0 font-serif text-[22px] leading-[1.2] text-muted-foreground phone:text-lg">Wear the details.</p>
          <a href="#best-sellers" className={buttonVariants({ variant: "solid", size: "pill" })}>
            <span>Shop the look</span>
            <ArrowUpRight className="size-[18px]" strokeWidth={1.5} />
          </a>
        </div>
      </SectionHead>

      <div className="group relative aspect-[2.2/1] overflow-hidden rounded-card border border-border bg-deep">
        <Image
          src="/images/lookbook.webp"
          alt="Three models on a couch wearing silver chains, bracelets and rings, two of them holding metal cigarette cases"
          fill
          sizes="(max-width: 1280px) 100vw, 1216px"
          className="object-cover group-hover:scale-[1.03]"
        />
        {hotspots.map((h) => (
          <a
            key={h.label}
            href="#best-sellers"
            aria-label={h.label}
            style={{ left: h.left, top: h.top }}
            className={cn("group absolute flex -translate-y-[22px] items-center gap-1", layout[h.kind])}
          >
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill bg-foreground/35">
              <span className="inline-flex size-[26px] items-center justify-center rounded-pill bg-surface text-foreground">
                <Plus className="size-3.5" strokeWidth={2} />
              </span>
            </span>
            <span className="rounded-pill border border-border bg-surface px-3 py-1.5 text-xs leading-4 font-semibold tracking-[0.08em] whitespace-nowrap text-foreground uppercase transition-colors group-hover:bg-foreground group-hover:text-background group-focus-visible:bg-foreground group-focus-visible:text-background tablet:px-2 tablet:py-[3px] tablet:text-[10px] tablet:leading-[14px] tablet:tracking-[0.04em]">
              {h.label === "Silver Chain Necklace" ? "Chain Necklace" : h.label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
