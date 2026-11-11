"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = { className?: string; inputClassName?: string; onSearch?: () => void };

function SearchField({ className, inputClassName, onSearch }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const urlQuery = useSearchParams().get("q") ?? "";
  const [value, setValue] = useState(urlQuery);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Follow URL changes that did not come from typing here (e.g. "Clear filters" on the products page).
  const [seen, setSeen] = useState(urlQuery);
  const [pushed, setPushed] = useState(urlQuery);
  if (urlQuery !== seen) {
    setSeen(urlQuery);
    if (urlQuery !== pushed) {
      setValue(urlQuery);
      setPushed(urlQuery);
    }
  }
  useEffect(() => () => clearTimeout(timer.current), []);

  const go = (q: string, replace: boolean) => {
    setPushed(q.trim());
    const target = q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : "/products";
    if (replace) router.replace(target, { scroll: false });
    else router.push(target);
  };

  const onChange = (q: string) => {
    setValue(q);
    // On the products page results update as you type.
    if (pathname === "/products") {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => go(q, true), 250);
    }
  };

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        clearTimeout(timer.current);
        go(value, pathname === "/products");
        onSearch?.();
      }}
      className={cn("flex items-center gap-2 rounded-pill border border-border bg-surface px-4 transition-colors focus-within:border-foreground", className)}
    >
      <button type="submit" aria-label="Search" className="inline-flex size-11 -ml-3 shrink-0 cursor-pointer items-center justify-center">
        <Search className="size-5" strokeWidth={1.5} />
      </button>
      <Input
        type="search"
        name="q"
        aria-label="Search products"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={60}
        className={cn("h-auto flex-1 border-0 bg-transparent p-0 text-[13px] shadow-none focus-visible:ring-0 dark:bg-transparent [&::-webkit-search-cancel-button]:hidden", inputClassName)}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setValue("");
            if (pathname === "/products") go("", true);
          }}
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-pill text-faint hover:text-foreground"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>
      )}
    </form>
  );
}

export function SearchBox(props: Props) {
  return (
    <Suspense fallback={<div className={cn("h-11 rounded-pill border border-border bg-surface", props.className)} />}>
      <SearchField {...props} />
    </Suspense>
  );
}
