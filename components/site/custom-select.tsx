"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sparkle } from "./sparkle";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  id?: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly Option<T>[];
  /** "line" = underline field (forms), "pill" = rounded pill (toolbars) */
  variant?: "line" | "pill";
  align?: "left" | "right";
  className?: string;
};

export function CustomSelect<T extends string>({
  id,
  value,
  onChange,
  options,
  variant = "line",
  align = "left",
  className,
}: Props<T>) {
  const autoId = useId();
  const listId = `${id ?? autoId}-list`;
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const openList = () => {
    setActive(selectedIndex);
    setOpen(true);
  };

  const choose = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "Tab") return setOpen(false);
    if (!["ArrowDown", "ArrowUp", "Enter", " ", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    if (!open) return openList();
    if (e.key === "ArrowDown") setActive((i) => (i + 1) % options.length);
    if (e.key === "ArrowUp") setActive((i) => (i - 1 + options.length) % options.length);
    if (e.key === "Home") setActive(0);
    if (e.key === "End") setActive(options.length - 1);
    if (e.key === "Enter" || e.key === " ") choose(active);
  };

  return (
    <div ref={root} className={cn("relative", variant === "line" && "w-full", className)}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "group flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 text-left text-foreground",
          variant === "line"
            ? "border-b border-foreground text-[15px] hover:border-accent"
            : "rounded-pill border border-border bg-surface px-4 text-xs font-semibold tracking-[0.08em] uppercase hover:border-foreground",
          open && (variant === "line" ? "border-accent" : "border-accent"),
        )}
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-accent transition-transform", open && "rotate-180")}
          strokeWidth={1.5}
        />
      </button>

      <ul
        id={listId}
        role="listbox"
        tabIndex={-1}
        className={cn(
          "absolute z-40 mt-2 min-w-full origin-top overflow-hidden rounded-card border border-border bg-deep p-1.5 shadow-lift",
          "transition-[opacity,transform,visibility] duration-300",
          align === "right" ? "right-0" : "left-0",
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-2 scale-95 opacity-0",
        )}
      >
        {options.map((o, i) => {
          const isSelected = o.value === value;
          return (
            <li
              key={o.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={isSelected}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-between gap-6 rounded-tag px-3 text-sm whitespace-nowrap transition-colors",
                active === i ? "bg-surface text-accent" : "text-foreground/80",
                isSelected && "font-semibold text-foreground",
                isSelected && active === i && "text-accent",
              )}
            >
              <span className="flex items-center gap-3">
                <span className="w-4 font-display text-xs leading-none text-faint tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {o.label}
              </span>
              <Sparkle
                size={12}
                className={cn("text-accent transition-opacity", isSelected ? "opacity-100" : "opacity-0")}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
