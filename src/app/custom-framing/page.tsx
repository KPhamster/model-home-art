import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Camera, Check, Frame, Image as ImageIcon, Layers, Palette, Shield, Sparkles, Truck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryTiles } from "@/components/ui/category-tiles";
import { CtaBanner } from "@/components/ui/cta-banner";
import { PageHero, onDarkOutline } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { businessConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Custom Framing",
  description: "Affordable custom framing in Orange County, CA that delivers nationwide. We frame art, photos, jerseys, diplomas, mirrors & more. Budget-friendly options with expert guidance.",
};

const framingOptions = [
  {
    title: "Frame Styles",
    description: "From sleek modern profiles to ornate traditional frames — we have thousands of options in every price range.",
    icon: Frame,
  },
  {
    title: "Matting",
    description: "Single, double, or no mat — matting adds depth and visual impact. We'll help you choose colors that complement your piece.",
    icon: Layers,
  },
  {
    title: "Glass & Glazing",
    description: "Standard glass, non-glare, UV-protective, or museum-grade. We'll recommend the right protection for your piece.",
    icon: Shield,
  },
  {
    title: "Mounting & Backing",
    description: "Proper mounting and acid-free backing protects your piece and ensures it stays beautiful for years.",
    icon: Sparkles,
  },
];

const specialtyServices = [
  {
    title: "Preservation Framing",
    description: "Museum-quality framing with archival materials to protect valuable artwork, documents, and heirlooms.",
    icon: Shield,
  },
  {
    title: "Shadow Boxes",
    description: "Display 3D items like jerseys, medals, memorabilia, and keepsakes in custom-built shadow boxes.",
    icon: Frame,
  },
  {
    title: "Canvas Stretching & Printing",
    description: "We stretch canvas artwork and can print any image on high-quality canvas.",
    icon: ImageIcon,
  },
  {
    title: "Repairs & Re-framing",
    description: "Damaged frame? Outdated style? We can repair or re-frame your existing pieces.",
    icon: Wrench,
  },
];

const processSteps = [
  {
    number: "1",
    title: "Send a photo + size",
    description: "Upload photos and dimensions. Not sure? We'll help you measure.",
    icon: Camera,
  },
  {
    number: "2",
    title: "We design options",
    description: "We'll create options that fit your style and budget.",
    icon: Palette,
  },
  {
    number: "3",
    title: "Pickup, delivery, or ship",
    description: "Pick up, schedule delivery + installation, or we'll ship it.",
    icon: Truck,
  },
];

const heroLede =
  "From precious artwork to sports memorabilia, we provide expert framing at prices that won't break the bank. Visit our shop or get a fast quote online.";
const optionsLede = "Custom framing means choices. Here's what goes into creating the perfect frame.";
const budgetLede =
  "Tell us your budget and we'll create options that work. No pressure, no upselling — just honest guidance to help you get the best value for your money.";
const budgetPromises = ["Budget-friendly options", "No hidden fees", "Transparent pricing"];

/** A titled point with an icon: used for the framing options and the specialty services. */
function Feature({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <li className={cn("reveal flex gap-4 rounded-xl border p-6", className)}>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <h3 className="font-heading text-lg font-semibold leading-snug">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </li>
  );
}

export default function CustomFramingPage() {
  return (
    <>
      <PageHero title="Affordable custom framing — we frame it all" lede={heroLede}>
        <div className="grid gap-3 sm:flex sm:justify-center sm:gap-4">
          <Button asChild size="lg" className="h-12 px-7 text-base">
            <Link href="/quote">Get a Fast Quote</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className={cn("h-12 px-7 text-base", onDarkOutline)}>
            <Link href="/contact">Visit the Shop</Link>
          </Button>
        </div>
      </PageHero>

      {/* What we frame */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeading
            title="We Frame It All"
            lede="No matter what you need framed, we have the expertise and materials to do it beautifully."
          />
          <CategoryTiles className="mt-12" />
          <p className="reveal mt-10 text-center">
            <Link
              href="/what-we-frame"
              className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
            >
              See full list <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </section>

      {/* Framing options explained */}
      <section className="bg-sand py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeading title="Your Framing Options" lede={optionsLede} />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
            {framingOptions.map((option) => (
              <Feature key={option.title} {...option} className="border-primary/10 bg-white/70" />
            ))}
          </ul>
        </div>
      </section>

      {/* Budget promise */}
      <section className="relative isolate overflow-hidden bg-[#151311] py-16 text-stone-50 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(96,88,80,0.3),transparent_72%)]"
        />
        <div className="reveal container-wide text-center">
          <span aria-hidden="true" className="mx-auto mb-6 block h-0.5 w-10 rounded-full bg-brand" />
          <h2 className="mx-auto max-w-3xl font-heading text-3xl font-semibold leading-[1.12] tracking-tight md:text-4xl lg:text-5xl">
            We&apos;ll design to <span className="italic text-[#e3cdb2]">your budget.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-300 md:text-xl">{budgetLede}</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
            {budgetPromises.map((promise) => (
              <li
                key={promise}
                className="flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-stone-200"
              >
                <Check className="mr-2 h-4 w-4 text-[#e3cdb2]" aria-hidden="true" />
                {promise}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Specialty services */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeading
            title="Specialty Services"
            lede="Beyond standard framing, we offer specialized services for unique needs."
          />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
            {specialtyServices.map((service) => (
              <Feature key={service.title} {...service} className="border-border bg-white" />
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-sand py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeading title="How It Works" />
          <ol className="mx-auto mt-12 grid max-w-4xl gap-10 md:grid-cols-3 md:gap-8">
            {processSteps.map((step) => (
              <li key={step.number} className="reveal text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-white">
                  <step.icon className="size-6" aria-hidden="true" />
                </span>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-primary">Step {step.number}</p>
                <h3 className="mt-1 font-heading text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBanner
        title={
          <>
            Ready to get <span className="italic text-[#e3cdb2]">started?</span>
          </>
        }
        lede="Get a fast quote online or visit our Orange County, CA shop for a free consultation."
        footnote={
          <>
            {businessConfig.address.full} • {businessConfig.hours.display}
          </>
        }
      >
        <Button asChild size="lg" className="h-12 px-7 text-base">
          <Link href="/quote">Get a Fast Quote</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className={cn("h-12 px-7 text-base", onDarkOutline)}>
          <Link href="/contact">Visit the Shop</Link>
        </Button>
      </CtaBanner>
    </>
  );
}
