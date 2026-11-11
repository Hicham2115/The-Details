import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { ProductsExplorer } from "@/components/site/products-explorer";
import { Sparkle } from "@/components/site/sparkle";

export const metadata: Metadata = {
  title: "All products | The Details",
  description:
    "Browse vintage and Y2K belts, buckles, rings and cases from The Details. Cash on delivery across Morocco.",
};

export default function ProductsPage() {
  return (
    <>
      <div className="w-full px-8 pb-8 phone:px-4 phone:pb-6">
        <Navbar base="/" />
        <main>
          {/* <section
            aria-labelledby="products-title"
            className="relative overflow-hidden rounded-card border border-border bg-surface px-8 py-12 phone:px-5 phone:py-8"
          >
            <Link
              href="/"
              className="mb-6 inline-flex min-h-11 items-center gap-2 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase hover:text-foreground"
            >
              <ArrowLeft className="size-4" strokeWidth={1.5} />
              <span className="link-underline">Home</span>
            </Link>
            <h1
              id="products-title"
              className="m-0 bg-linear-to-b from-foreground to-chrome/40 bg-clip-text font-display text-[clamp(64px,12vw,170px)] leading-[0.9] text-transparent"
            >
              ALL PRODUCTS
            </h1>
            <p className="m-0 mt-4 max-w-[420px] font-serif text-[22px] leading-[1.2] text-muted-foreground phone:text-lg">
              Found, not mass-made. Pick your details.
            </p>
          </section> */}

          <div className="mt-10">
            <ProductsExplorer />
          </div>
        </main>
      </div>
      <Footer base="/" />
    </>
  );
}
