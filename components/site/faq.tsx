"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/lib/data";

const cols = "grid grid-cols-[56px_minmax(0,1fr)_44px] gap-4 phone:grid-cols-[34px_minmax(0,1fr)_44px] phone:gap-2.5";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="mt-20 tablet:mt-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 tablet:mb-7 phone:gap-3">
        <h2
          id="faq-title"
          className="m-0 font-display text-[clamp(64px,11vw,160px)] leading-[0.88] font-normal tracking-[-0.01em] phone:text-[52px] phone:leading-[0.9]"
        >
          GOOD TO KNOW
          <sup className="ml-2.5 align-top font-sans text-base leading-4 font-semibold tracking-[0.08em]">(06)</sup>
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pb-2">
          <p className="m-0 font-serif text-[22px] leading-[1.2] text-muted-foreground">Still curious?</p>
          <a
            href="#contact"
            className="inline-flex min-h-11 items-center gap-1.5 border-b border-foreground text-xs leading-4 font-semibold tracking-[0.08em] uppercase transition-colors hover:border-accent hover:text-accent"
          >
            <span>Message us</span>
            <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </a>
        </div>
      </div>

      <Accordion multiple defaultValue={["faq-0"]} className="border-b border-border">
        {faqs.map((f, i) => (
          <AccordionItem
            key={f.q}
            value={`faq-${i}`}
            className="group/faq border-t border-border transition-colors hover:bg-surface"
          >
            <AccordionTrigger className={`${cols} min-h-11 cursor-pointer items-center px-2 py-7 phone:px-0 phone:py-5`}>
              <span className="font-display text-[28px] leading-none text-muted-foreground group-data-open/faq:text-accent phone:text-xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-[clamp(22px,2.6vw,32px)] leading-[1.15] group-data-open/faq:text-accent phone:text-[17px] phone:leading-[1.2]">
                {f.q}
              </span>
              <span className="inline-flex size-11 items-center justify-center rounded-pill border border-foreground transition-all group-data-open/faq:rotate-45 group-data-open/faq:bg-foreground group-data-open/faq:text-background">
                <Plus className="size-5" strokeWidth={1.5} />
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className={`${cols} px-2 pb-7 phone:px-0 phone:pb-5`}>
                <p className="col-start-2 m-0 max-w-[620px] text-[15px] leading-[22px] text-muted-foreground">{f.a}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
