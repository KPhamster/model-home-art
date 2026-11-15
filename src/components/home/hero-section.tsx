import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroFrameSwap } from "./hero-frame-swap";
import styles from "./hero-section.module.css";

const trustChips = [
  { icon: CheckCircle, label: "Budget-friendly options" },
  { icon: Shield, label: "Preservation & repair" },
  { icon: Truck, label: "Delivery/Shipping/Install" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#151311] text-stone-50">
      {/* Soft light behind the artwork, so the lit wall carries on past the picture's edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_55%_at_50%_38%,rgba(96,88,80,0.34),transparent_72%)] lg:bg-[radial-gradient(ellipse_48%_78%_at_73%_50%,rgba(96,88,80,0.34),transparent_72%)]"
      />

      <div className={cn(styles.grid, "container-wide pt-4 pb-10 sm:pt-10 lg:py-6")}>
        <h1
          className={cn(
            styles.title,
            // On desktop the size follows the column width, so each half of the headline stays on two lines.
            // On phones it is sized and balanced to take three lines, which keeps the buttons on the first screen.
            "text-balance text-center font-heading text-[1.75rem] font-semibold leading-[1.12] tracking-tight text-stone-50 sm:text-5xl lg:text-left lg:text-[clamp(2.6rem,3.9vw,3.75rem)]",
          )}
        >
          Custom framing that looks <span className="whitespace-nowrap">high-end —</span>{" "}
          <span className="italic text-[#e3cdb2] lg:block">
            without the <span className="whitespace-nowrap">high-end</span> price.
          </span>
        </h1>

        <HeroFrameSwap className={styles.art} />

        <p
          className={cn(
            styles.copy,
            "mx-auto mt-7 max-w-2xl text-center text-lg text-stone-300 md:text-xl lg:mx-0 lg:mt-6 lg:text-left lg:text-lg 2xl:text-xl",
          )}
        >
          We frame just about anything: art, photos, jerseys, diplomas, mirrors, and memorabilia.
          Visit our Orange County, CA shop or get a fast quote online. We deliver, ship, and install nationwide in the United States.
        </p>

        <div className={cn(styles.cta, "grid grid-cols-2 gap-3 sm:flex sm:justify-center sm:gap-4 lg:mt-8 lg:justify-start")}>
          <Button asChild size="lg" className="h-12 px-3 text-[0.95rem] sm:px-7 sm:text-base">
            <Link href="/quote">Get a Fast Quote</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 border-white/25 bg-transparent px-3 text-[0.95rem] text-stone-50 hover:bg-white/10 hover:text-white sm:px-7 sm:text-base"
          >
            <Link href="/shop">Shop Framed Art</Link>
          </Button>
        </div>

        <div className={cn(styles.extra, "mt-7 text-center lg:text-left")}>
          <a
            href="#visit-us"
            className="font-medium text-stone-200 underline-offset-4 hover:text-white hover:underline"
          >
            Visit the Store →
          </a>

          <ul className="mt-7 flex flex-wrap justify-center gap-2.5 lg:justify-start">
            {trustChips.map((chip) => (
              <li
                key={chip.label}
                className="flex items-center rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-stone-200"
              >
                <chip.icon className="mr-2 h-4 w-4 text-[#e3cdb2]" aria-hidden="true" />
                {chip.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
