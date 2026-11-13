"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import {
  formatPrice,
  products,
  type Product,
  type ProductCategory,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { ProductCard } from "./best-sellers";
import { CustomSelect } from "./custom-select";

type Tag = NonNullable<Product["tag"]>;
type Sort = "featured" | "price-asc" | "price-desc";

const categories = [
  "Belts",
  "Rings",
  "Cases",
] as const satisfies readonly ProductCategory[];
const tags = ["New", "Sale", "Pre-order"] as const satisfies readonly Tag[];

// Extra words people may search for, per category ("wallet" finds the cases).
const searchWords: Record<ProductCategory, string> = {
  Belts: "belt belts",
  Cases: "case cases wallet wallets cigarette",
  Rings: "ring rings",
};

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const satisfies readonly { value: Sort; label: string }[];

const maxPrice = Math.max(...products.map((p) => p.price));
const minPrice = Math.min(...products.map((p) => p.price));

const chip =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-pill border px-1 text-[11px] font-semibold tracking-[0.04em] uppercase transition-colors";
const chipOff =
  "border-border text-foreground hover:border-foreground hover:bg-surface";
const chipOn = "border-foreground bg-foreground text-background";

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-xs leading-4 font-semibold tracking-[0.08em] text-faint uppercase">
        {title}
      </p>
      <div className="grid grid-cols-3 gap-2">{children}</div>
    </div>
  );
}

function ExplorerFromUrl() {
  const params = useSearchParams();
  const initial = categories.find((c) => c === params.get("category")) ?? "All";
  const query = (params.get("q") ?? "").trim().slice(0, 60);
  return <Explorer key={initial} initialCategory={initial} query={query} />;
}

export function ProductsExplorer() {
  return (
    <Suspense>
      <ExplorerFromUrl />
    </Suspense>
  );
}

function Explorer({ initialCategory, query }: { initialCategory: ProductCategory | "All"; query: string }) {
  const router = useRouter();
  const [category, setCategory] = useState<ProductCategory | "All">(initialCategory);
  const [tag, setTag] = useState<Tag | "All">("All");
  const [limit, setLimit] = useState(maxPrice);
  const [sort, setSort] = useState<Sort>("featured");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    const list = products.filter(
      (p) =>
        (!needle || `${p.name} ${p.variant} ${p.category} ${searchWords[p.category]} ${p.tag ?? ""}`.toLowerCase().includes(needle)) &&
        (category === "All" || p.category === category) &&
        (tag === "All" || p.tag === tag) &&
        p.price <= limit,
    );
    if (sort === "price-asc")
      return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc")
      return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [query, category, tag, limit, sort]);

  const isFiltered = category !== "All" || tag !== "All" || limit !== maxPrice || query !== "";
  const reset = () => {
    setCategory("All");
    setTag("All");
    setLimit(maxPrice);
    if (query) router.replace("/products", { scroll: false });
  };

  return (
    <div className="grid grid-cols-[300px_minmax(0,1fr)] items-start gap-10 tablet:grid-cols-1 tablet:gap-6">
      {/* Filters */}
      <aside aria-label="Filters" className="sticky top-4 tablet:static">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="filters-panel"
          className="hidden min-h-11 w-full cursor-pointer items-center justify-between rounded-pill border border-border bg-surface px-5 text-xs font-semibold tracking-[0.08em] uppercase tablet:flex"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="size-4" strokeWidth={1.5} />
            Filters
          </span>
          {isFiltered && <span className="size-2 rounded-pill bg-accent" />}
        </button>

        <div
          id="filters-panel"
          className={cn(
            "flex flex-col gap-7 rounded-card border border-border bg-surface p-4",
            "tablet:mt-3",
            !open && "tablet:hidden",
          )}
        >
          <FilterGroup title="Category">
            {(["All", ...categories] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={cn(chip, category === c ? chipOn : chipOff)}
              >
                {c}
              </button>
            ))}
          </FilterGroup>

          <FilterGroup title="Collection">
            {(["All", ...tags] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tag === t}
                onClick={() => setTag(t)}
                className={cn(chip, tag === t ? chipOn : chipOff)}
              >
                {t}
              </button>
            ))}
          </FilterGroup>

          <div className="flex flex-col gap-3">
            <label
              htmlFor="price-limit"
              className="flex items-baseline justify-between"
            >
              <span className="text-xs leading-4 font-semibold tracking-[0.08em] text-faint uppercase">
                Max price
              </span>
              <span className="font-display text-2xl leading-none">
                {formatPrice(limit)}
              </span>
            </label>
            <input
              id="price-limit"
              type="range"
              min={minPrice}
              max={maxPrice}
              step={1}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="h-11 w-full cursor-pointer accent-accent"
            />
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-pill border border-border text-xs font-semibold tracking-[0.08em] uppercase hover:border-accent hover:text-accent"
            >
              <X className="size-4" strokeWidth={1.5} />
              Clear filters
            </button>
          )}
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 text-sm text-muted-foreground" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            {query && (
              <>
                {" "}for <span className="text-foreground">“{query}”</span>
              </>
            )}
          </p>
          <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.08em] uppercase">
            <span className="text-faint">Sort</span>
            <CustomSelect
              variant="pill"
              align="right"
              value={sort}
              onChange={setSort}
              options={sortOptions}
              className="min-w-[200px]"
            />
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-3 gap-6 tablet:grid-cols-2 tablet:gap-4 phone:gap-2.5">
            {filtered.map((p) => (
              <ProductCard key={p.name} p={p} imageHover={false} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-border px-6 py-20 text-center">
            <p className="m-0 font-serif text-[32px] leading-[1.1]">
              Nothing matches.
            </p>
            <p className="m-0 max-w-[320px] text-sm text-muted-foreground">
              Try another category or a higher price.
            </p>
            <button
              type="button"
              onClick={reset}
              className={cn(chip, chipOn, "mt-2")}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
