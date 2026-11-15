import { Photo } from "@/components/ui/photo";

type CtaBannerProps = {
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** The buttons. */
  children: React.ReactNode;
  /** A small line under the buttons, such as the address and hours. */
  footnote?: React.ReactNode;
};

/**
 * The closing banner: a darkened photo of a frame with a call to action over it.
 * Used at the end of the homepage and of the inner pages.
 */
export function CtaBanner({ title, lede, children, footnote }: CtaBannerProps) {
  return (
    <section className="relative isolate overflow-hidden py-24 text-stone-50 lg:py-32">
      <div className="absolute inset-0 -z-10">
        <Photo
          name="call-to-action"
          alt="Custom framed art in a warm home setting"
          sizes="100vw"
          className="h-full w-full object-cover"
        />
        {/* Darkens the photo so the text reads, most at the bottom where it meets the footer. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(21,19,17,0.74),rgba(21,19,17,0.58)_45%,rgba(21,19,17,0.86))]" />
      </div>

      <div className="reveal container-wide text-center">
        <span aria-hidden="true" className="mx-auto mb-6 block h-0.5 w-10 rounded-full bg-brand" />
        <h2 className="mx-auto max-w-3xl font-heading text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
          {title}
        </h2>
        {lede && <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-200 md:text-xl">{lede}</p>}
        <div className="mt-9 grid gap-3 sm:flex sm:justify-center sm:gap-4">{children}</div>
        {footnote && <p className="mt-7 text-sm text-stone-300">{footnote}</p>}
      </div>
    </section>
  );
}
