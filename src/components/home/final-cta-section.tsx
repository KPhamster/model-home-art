import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";

const lede = "Send us photos and we'll provide options that fit your style and budget. No pressure, no surprises.";

export function FinalCTASection() {
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
          Ready to get your piece <span className="italic text-[#e3cdb2]">framed?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-200 md:text-xl">{lede}</p>
        <div className="mt-9 grid gap-3 sm:flex sm:justify-center sm:gap-4">
          <Button asChild size="lg" className="h-12 px-7 text-base">
            <Link href="/quote">Get a Fast Quote</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-white/30 bg-transparent px-7 text-base text-stone-50 hover:bg-white/10 hover:text-white"
          >
            <Link href="/contact">Visit Our Shop</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
