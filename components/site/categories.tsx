import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SectionHead, SectionTitle } from "./section-head";

const span = {
  big: "col-span-2 row-span-2 tablet:row-span-1",
  small: "",
  wide: "col-span-2",
} as const;

export function Categories() {
  return (
    <section
      id="collections"
      aria-labelledby="cat-title"
      className="mt-20 tablet:mt-16"
    >
      <SectionHead>
        <SectionTitle id="cat-title">SHOP BY CATEGORY</SectionTitle>
        <p className="m-0 max-w-[320px] text-[15px] leading-[22px] text-muted-foreground phone:text-lg">
          Vintage-inspired pieces, picked one by one.
        </p>
      </SectionHead>
      <div className="grid auto-rows-[288px] grid-cols-4 gap-6 tablet:auto-rows-[220px] tablet:grid-cols-2 tablet:gap-4 phone:auto-rows-[168px] phone:gap-2.5">
        {categories.map((c) => (
          <a
            key={c.name}
            href={c.href}
            aria-label={`Shop ${c.name.replace("&", "and")}`}
            className={cn(
              "group relative block overflow-hidden rounded-card border border-border bg-deep",
              span[c.size],
              c.size === "wide" && "tablet:col-span-2",
            )}
          >
            <Image
              src={c.image}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className={cn("object-cover", c.position)}
            />
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-pill border border-border bg-surface py-2 pr-2 pl-5 phone:inset-x-2 phone:bottom-2 phone:gap-1.5 phone:py-[5px] phone:pr-[5px] phone:pl-3.5">
              <span className="font-display text-[28px] leading-none tracking-[0.01em] uppercase phone:text-[21px]">
                {c.name}
              </span>
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-pill bg-foreground text-background  phone:size-8">
                <ArrowUpRight className="size-[18px]" strokeWidth={1.5} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
