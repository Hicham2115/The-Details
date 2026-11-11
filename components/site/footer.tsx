"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubscribe } from "@/hooks/use-subscribe";
import { footerColumns } from "@/lib/data";
import { subscribeSchema } from "@/lib/schemas";
import { Sparkle } from "./sparkle";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const subscribe = useSubscribe();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = subscribeSchema.safeParse({ email });
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message;
      setError(message);
      toast.error(message ?? "Enter a valid email address");
      return;
    }
    try {
      await subscribe.mutateAsync(parsed.data);
      setEmail("");
      setError(undefined);
    } catch {
      // Error toast is handled by the mutation.
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-[400px]">
      <div className="flex items-center gap-2">
        <label htmlFor="f-email" className="sr-only">
          Email address
        </label>
        <Input
          id="f-email"
          type="email"
          autoComplete="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(undefined);
          }}
          aria-invalid={!!error}
          aria-describedby={error ? "f-email-err" : undefined}
          className="h-12 flex-1 rounded-pill border-foreground/25 bg-foreground/5 px-5 text-sm dark:bg-foreground/5"
        />
        <Button
          type="submit"
          variant="solid"
          disabled={subscribe.isPending}
          className="h-12 shrink-0 px-[22px] hover:bg-chrome"
        >
          {subscribe.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          {subscribe.isPending ? "Sending" : "Subscribe"}
        </Button>
      </div>
      {error && (
        <p
          id="f-email-err"
          role="alert"
          className="m-0 pt-2 pl-5 text-xs leading-4 text-accent"
        >
          {error}
        </p>
      )}
    </form>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 overflow-hidden border-t border-border bg-footer">
      <div className="w-full px-8 pt-[72px] phone:px-4 phone:pt-12">
        <div className="grid grid-cols-[minmax(0,4fr)_repeat(3,minmax(0,1.4fr))] gap-8 tablet:grid-cols-2 phone:gap-x-4 phone:gap-y-6">
          <div className="flex flex-col items-start gap-5 tablet:col-span-2">
            <p className="m-0 font-logo text-[40px] leading-none font-bold">
              The Details
            </p>
            <p className="m-0 max-w-[340px] text-sm leading-[22px] text-foreground/70">
              Vintage and Y2K accessories (belts, buckles, rings and cases) sold
              online in Morocco.
            </p>
            <Newsletter />
          </div>

          {footerColumns.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="flex flex-col"
            >
              <p className="m-0 mb-2 text-base leading-6 font-medium">
                {col.title}
              </p>
              {col.links.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="flex min-h-11 items-center text-sm text-foreground/70 transition-all hover:translate-x-1 hover:text-foreground"
                >
                  <span className="link-underline">{label}</span>
                </a>
              ))}
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="m-0 text-[13px] leading-[18px] text-foreground/70">
            © <Year /> The Details. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              ["Privacy", "#privacy"],
              ["Terms", "#terms"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="inline-flex min-h-11 items-center text-[13px] text-foreground/70 transition-all hover:translate-x-1 hover:text-foreground"
              >
                <span className="link-underline">{label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="relative mt-2 text-center">
          <Sparkle
            size={26}
            className="absolute top-[12%] right-[3%] text-chrome"
          />
          <p
            aria-hidden="true"
            className="m-0 -mb-[0.16em] bg-linear-to-b from-chrome/95 to-chrome/5 to-[82%] bg-clip-text font-logo text-[clamp(72px,16vw,230px)] leading-none font-bold whitespace-nowrap text-transparent phone:text-[17vw]"
          >
            The Details
          </p>
        </div>
      </div>
    </footer>
  );
}

function Year() {
  const [year, setYear] = useState<number>();
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <span>{year ?? "\u2009"}</span>;
}
