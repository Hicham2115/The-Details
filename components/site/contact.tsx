"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContact } from "@/hooks/use-contact";
import { getErrorMessage } from "@/lib/errors";
import { contactSchema, TOPICS } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { CustomSelect } from "./custom-select";

type Values = {
  firstName: string;
  lastName: string;
  topic: (typeof TOPICS)[number];
  email: string;
  message: string;
};
type Errors = Partial<Record<keyof Values, string>>;

const initial: Values = {
  firstName: "",
  lastName: "",
  topic: TOPICS[0],
  email: "",
  message: "",
};

const fieldBase =
  "h-11 w-full rounded-none border-0 border-b border-foreground bg-transparent px-0 py-0 text-[15px] text-foreground shadow-none focus-visible:ring-0 dark:bg-transparent";
const labelCls = "text-[13px] leading-[18px] text-muted-foreground";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="m-0 pt-1 text-xs leading-4 text-accent">
      {message}
    </p>
  );
}

export function Contact() {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const contact = useContact();

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        next[key] ??= issue.message;
      }
      setErrors(next);
      toast.error("Please fix the highlighted fields");
      return;
    }
    try {
      await contact.mutateAsync(parsed.data);
      setValues(initial);
      setErrors({});
    } catch (error) {
      // The mutation already shows a toast; this guards against anything unexpected.
      console.error(getErrorMessage(error));
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mt-20 tablet:mt-16"
    >
      <h2
        id="contact-title"
        className="m-0 text-center font-display text-[clamp(64px,20vw,300px)] leading-[0.85] font-normal tracking-[-0.01em] whitespace-nowrap phone:text-[19vw]"
      >
        CONTACT US
      </h2>

      <div className="mt-6 grid grid-cols-[240px_minmax(0,640px)] items-start justify-center gap-12 tablet:grid-cols-1 tablet:gap-8 phone:mt-5 phone:gap-7">
        <div className="flex flex-col gap-4 text-[13px] leading-[18px]">
          <p className="m-0">
            <strong className="block font-semibold">Based in</strong>
            Casablanca, Morocco
            <br />
            Delivering across the country
          </p>
          <p className="m-0">
            <strong className="block font-semibold">Opening hours</strong>
            Every day, all week
            <br />
            24/7
          </p>
          <p className="m-0">
            <strong className="block font-semibold">We reply within</strong>
            Instantly, or within one day
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
            <legend className="p-0 text-[13px] leading-[18px] font-semibold">
              Name (required)
            </legend>
            <div className="grid grid-cols-2 gap-6 tablet:grid-cols-1">
              <div className="flex flex-col">
                <label htmlFor="c-first" className={labelCls}>
                  First name
                </label>
                <Input
                  id="c-first"
                  autoComplete="given-name"
                  value={values.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={
                    errors.firstName ? "c-first-err" : undefined
                  }
                  className={fieldBase}
                />
                <FieldError id="c-first-err" message={errors.firstName} />
              </div>
              <div className="flex flex-col">
                <label htmlFor="c-last" className={labelCls}>
                  Last name
                </label>
                <Input
                  id="c-last"
                  autoComplete="family-name"
                  value={values.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "c-last-err" : undefined}
                  className={fieldBase}
                />
                <FieldError id="c-last-err" message={errors.lastName} />
              </div>
            </div>
          </fieldset>

          <div className="flex flex-col">
            <label htmlFor="c-topic" className={labelCls}>
              Topic
            </label>
            <CustomSelect
              id="c-topic"
              value={values.topic}
              onChange={(v) => set("topic", v)}
              options={TOPICS.map((t) => ({ value: t, label: t }))}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="c-email"
              className="text-[13px] leading-[18px] font-semibold"
            >
              Email (required)
            </label>
            <Input
              id="c-email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "c-email-err" : undefined}
              className={fieldBase}
            />
            <FieldError id="c-email-err" message={errors.email} />
          </div>

          <div className="flex flex-col">
            <label htmlFor="c-message" className={labelCls}>
              Message
            </label>
            <Textarea
              id="c-message"
              rows={3}
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "c-message-err" : undefined}
              className={cn(
                fieldBase,
                "min-h-[88px] resize-y py-2.5 text-[15px] leading-[22px]",
              )}
            />
            <FieldError id="c-message-err" message={errors.message} />
          </div>

          <Button
            type="submit"
            variant="solid"
            size="pill"
            disabled={contact.isPending}
            className="self-start px-8 phone:h-12 phone:w-full phone:self-stretch"
          >
            {contact.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>

      <div className="mt-14 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 phone:mt-10 phone:flex-col phone:items-start phone:gap-2">
        {["thedetailss.018@gmail.com", "[YOUR WHATSAPP]"].map((text, i) => (
          <a
            key={text}
            href={i === 0 ? "mailto:thedetailss.018@gmail.com" : "#whatsapp"}
            className="break-all text-[clamp(22px,3.4vw,44px)] leading-[1.05] font-bold tracking-[-0.02em] transition-colors hover:text-accent phone:min-h-11 phone:text-[clamp(15px,5.2vw,22px)]"
          >
            {text}
          </a>
        ))}
      </div>
    </section>
  );
}
