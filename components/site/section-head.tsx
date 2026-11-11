import { Sparkle } from "./sparkle";

export function SectionTitle({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <h2
        id={id}
        className="m-0 font-display text-[56px] leading-[0.95] font-normal tablet:text-[40px]"
      >
        {children}
      </h2>
      <Sparkle size={22} className="mt-0.5 text-foreground tablet:hidden" />
    </div>
  );
}

export function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 tablet:mb-7 phone:gap-3">
      {children}
    </div>
  );
}
