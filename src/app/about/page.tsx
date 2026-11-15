import Link from "next/link";
import { Metadata } from "next";
import { Award, DollarSign, Heart, MapPin, Palette, Truck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/ui/cta-banner";
import { onDarkOutline } from "@/components/ui/page-hero";
import { Photo } from "@/components/ui/photo";
import { SectionHeading } from "@/components/ui/section-heading";
import { businessConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description: `${businessConfig.name} is a local framing shop in Orange County, CA that delivers nationwide. We offer budget-friendly custom framing with expert guidance, delivery, and installation.`,
};

const whyUsReasons = [
  {
    title: "Expert Guidance",
    description: "Our team will help you choose the perfect frame, matting, and glass — no design degree required.",
    icon: Palette,
  },
  {
    title: "Affordable Pricing",
    description: "We offer options for every budget. Tell us your range and we'll make it work.",
    icon: DollarSign,
  },
  {
    title: "Wide Selection",
    description: "Thousands of frame styles, from sleek modern profiles to ornate traditional frames.",
    icon: Award,
  },
  {
    title: "Quality Craftsmanship",
    description: "Every frame is assembled with care, using quality materials that will last.",
    icon: Heart,
  },
];

const serviceHighlights = [
  {
    title: "Local Shop",
    description: "Visit us in Orange County, CA for hands-on help and to see samples in person.",
    icon: MapPin,
  },
  {
    title: "Delivery & Install",
    description: "We deliver nationwide and professionally hang your pieces.",
    icon: Truck,
  },
  {
    title: "Business Services",
    description: "Volume pricing and dedicated service for offices, hotels, and designers.",
    icon: Users,
  },
];

const whyUsLede = "Here's what sets us apart from the rest.";

export default function AboutPage() {
  return (
    <>
      {/* Hero: the same dark band as the other pages, with the shop photo beside the text. */}
      <section className="relative isolate overflow-hidden bg-[#151311] text-stone-50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_80%_at_75%_45%,rgba(96,88,80,0.36),transparent_72%)]"
        />
        <div className="container-wide grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div>
            <span aria-hidden="true" className="mb-6 block h-0.5 w-10 rounded-full bg-brand" />
            <h1 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              Framing your memories,{" "}
              <span className="italic text-[#e3cdb2]">beautifully and affordably.</span>
            </h1>
            <p className="mt-6 text-lg text-stone-200 md:text-xl">
              {businessConfig.name} is a local framing shop in Orange County, CA that delivers nationwide. We believe
              custom framing shouldn&apos;t cost a fortune, and we&apos;re here to prove it.
            </p>
            <p className="mt-4 text-lg text-stone-300">
              Whether it&apos;s a treasured family photo, a signed jersey, or art for your office walls — we&apos;ll
              help you display it beautifully without breaking the bank.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:gap-4">
              <Button asChild size="lg" className="h-12 px-7 text-base">
                <Link href="/quote">Get a Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className={cn("h-12 px-7 text-base", onDarkOutline)}>
                <Link href="/contact">Visit Us</Link>
              </Button>
            </div>
          </div>

          {/* The shop photo from the homepage stands in until there is a team photo. */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <span aria-hidden="true" className="absolute -inset-3 rounded-[1.4rem] border border-brand/30 sm:-inset-4" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-800">
              <Photo
                name="visit-our-shop"
                alt="Inside the Model Home Art shop with framed art displays"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeading title="Our Story" />
          <div className="reveal mx-auto mt-10 max-w-3xl space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              We started {businessConfig.name} with a simple mission: make custom framing accessible to everyone. We
              noticed that many framing shops felt intimidating, with high prices and confusing options. We wanted to
              change that.
            </p>
            <p>
              Our approach is different. We listen to your needs, understand your budget, and guide you to the best
              options. Whether you&apos;re framing your first piece or your fiftieth, we treat every project with the
              same care and attention.
            </p>
            <p>
              Located in Orange County, CA, we serve customers nationwide. From our local shop, we offer custom
              framing, ready-made frames, canvas printing, repairs, and professional delivery and installation.
            </p>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-sand py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeading title="Why Choose Us" lede={whyUsLede} />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
            {whyUsReasons.map((reason) => (
              <li key={reason.title} className="reveal flex gap-4 rounded-xl border border-primary/10 bg-white/70 p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary">
                  <reason.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold leading-snug">{reason.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{reason.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Service highlights */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeading title="How We Serve You" />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-10 md:grid-cols-3 md:gap-8">
            {serviceHighlights.map((highlight) => (
              <li key={highlight.title} className="reveal text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-primary/40 text-primary">
                  <highlight.icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold">{highlight.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{highlight.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Service area */}
      <section className="bg-sand py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeading
            title="Serving Nationwide"
            lede="Our shop is located in Orange County, California. We serve customers nationwide with delivery and professional installation. We also ship framed art and completed custom orders nationwide."
            className="max-w-3xl"
          />
          <dl className="reveal mx-auto mt-10 max-w-xl divide-y divide-primary/15 border-y border-primary/15">
            <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground sm:pt-1">
                Shop Address
              </dt>
              <dd className="font-medium">{businessConfig.address.full}</dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground sm:pt-1">Hours</dt>
              <dd className="font-medium">{businessConfig.hours.display}</dd>
            </div>
          </dl>
        </div>
      </section>

      <CtaBanner
        title={
          <>
            Ready to get <span className="italic text-[#e3cdb2]">started?</span>
          </>
        }
        lede="Get a fast quote online or visit our shop for a free consultation."
      >
        <Button asChild size="lg" className="h-12 px-7 text-base">
          <Link href="/quote">Get a Fast Quote</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className={cn("h-12 px-7 text-base", onDarkOutline)}>
          <Link href="/contact">Visit Our Shop</Link>
        </Button>
      </CtaBanner>
    </>
  );
}
