import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { SectionHeading } from "./section-heading";

const lede =
  "We work with offices, interior designers, hotels, medical facilities, and more. Whether you need 5 frames or 500, we deliver consistent quality on time and on budget.";

const benefits = [
  "Volume pricing for bulk orders",
  "Consistent frame styles across projects",
  "Delivery and professional installation",
];

export function BusinessSection() {
  return (
    <section className="bg-sand py-20 lg:py-28">
      <div className="container-wide grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            align="left"
            title={
              <>
                Framing for businesses —{" "}
                <span className="italic text-primary">reliable, consistent, affordable.</span>
              </>
            }
            lede={lede}
          />

          <ul className="reveal mt-8 divide-y divide-primary/15 border-y border-primary/15">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 py-3.5">
                <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="reveal mt-8">
            <Button asChild size="lg" className="h-12 px-7 text-base">
              <Link href="/business#request">Request Business Pricing</Link>
            </Button>
          </div>
        </div>

        {/* The thin outline set off from the photo is a nod to a mat around a picture. */}
        <div className="reveal relative mx-auto w-full max-w-xl lg:max-w-none">
          <span aria-hidden="true" className="absolute -inset-3 rounded-[1.4rem] border border-primary/25 sm:-inset-4" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-200">
            <Photo
              name="business"
              alt="Business installation with framed artwork"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
