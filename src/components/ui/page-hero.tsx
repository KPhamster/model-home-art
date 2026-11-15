import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** A short line above the title, such as the kind of page. Without one, a copper rule is shown. */
  eyebrow?: React.ReactNode;
  /** Anything under the lede: buttons, a search box. */
  children?: React.ReactNode;
  /** A shorter band with a smaller title, for pages that are mostly a form. */
  compact?: boolean;
  className?: string;
};

/** Classes for an outline button on a dark background, as in the homepage hero. */
export const onDarkOutline = "border-white/25 bg-transparent text-stone-50 hover:bg-white/10 hover:text-white";

/**
 * The dark band every inner page opens with, in the same style as the homepage hero:
 * the title in the heading typeface, a lede, and room for buttons underneath.
 */
export function PageHero({ title, lede, eyebrow, children, compact = false, className }: PageHeroProps) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-[#151311] text-stone-50", className)}>
      {/* The same soft light as behind the homepage hero's artwork. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_95%_at_50%_0%,rgba(96,88,80,0.38),transparent_72%)]"
      />
      <div className={cn("container-wide text-center", compact ? "py-10 sm:py-12 lg:py-14" : "py-16 sm:py-20 lg:py-24")}>
        <div className="mx-auto max-w-3xl">
          {eyebrow ? (
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-brand">{eyebrow}</p>
          ) : (
            <span aria-hidden="true" className="mx-auto mb-6 block h-0.5 w-10 rounded-full bg-brand" />
          )}
          <h1
            className={cn(
              "font-heading font-semibold leading-[1.1] tracking-tight",
              compact ? "text-3xl sm:text-4xl lg:text-5xl" : "text-4xl sm:text-5xl lg:text-[3.5rem]",
            )}
          >
            {title}
          </h1>
          {lede && (
            <p className={cn("mx-auto max-w-2xl text-stone-300", compact ? "mt-4 text-base md:text-lg" : "mt-6 text-lg md:text-xl")}>
              {lede}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
