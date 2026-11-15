import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: React.ReactNode;
  /** One or two sentences under the title. */
  lede?: React.ReactNode;
  align?: "center" | "left";
  /** "dark" on sections with a dark background. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * How every homepage section below the hero opens: a short copper rule, the title in the
 * heading typeface, and an optional lede.
 */
export function SectionHeading({ title, lede, align = "center", tone = "light", className }: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={cn("reveal", align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl", className)}>
      <span
        aria-hidden="true"
        className={cn("mb-5 block h-0.5 w-10 rounded-full", align === "center" && "mx-auto", dark ? "bg-brand" : "bg-primary")}
      />
      <h2
        className={cn(
          "font-heading text-3xl font-semibold leading-[1.12] tracking-tight md:text-4xl lg:text-[2.75rem]",
          dark ? "text-stone-50" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {lede && <p className={cn("mt-4 text-lg", dark ? "text-stone-300" : "text-muted-foreground")}>{lede}</p>}
    </div>
  );
}
