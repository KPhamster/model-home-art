import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { businessConfig } from "@/lib/config";
import { SectionHeading } from "@/components/ui/section-heading";

const label = "text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground sm:pt-1.5";
const row = "grid gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6";

export function VisitUsSection() {
  const { address, hours, phone } = businessConfig;
  return (
    <section id="visit-us" className="scroll-mt-16 bg-background py-20 lg:py-28">
      <div className="container-wide grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-200 sm:aspect-[16/10] lg:aspect-[4/5]">
            <Photo
              name="visit-our-shop"
              alt="Inside the Model Home Art shop with framed art displays"
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <SectionHeading title="Visit Our Shop" align="left" />

          <dl className="reveal mt-8 divide-y divide-border border-y border-border">
            <div className={row}>
              <dt className={label}>Address</dt>
              <dd>
                <p className="text-lg font-medium">{address.street}</p>
                <p className="text-muted-foreground">
                  {address.city}, {address.state} {address.zip}
                </p>
              </dd>
            </div>
            <div className={row}>
              <dt className={label}>Hours</dt>
              <dd>
                {hours.structured.map((item) => (
                  <p key={item.days} className={item.hours === "Closed" ? "text-muted-foreground" : "text-lg"}>
                    <span className="font-medium">{item.days}:</span> {item.hours}
                  </p>
                ))}
              </dd>
            </div>
            <div className={row}>
              <dt className={label}>Phone</dt>
              <dd>
                <a href={`tel:${phone}`} className="text-lg font-medium transition-colors hover:text-primary">
                  {phone}
                </a>
              </dd>
            </div>
          </dl>

          <div className="reveal mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild className="h-12 px-6 text-base">
              <a href={businessConfig.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Get Directions
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-6 text-base">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <p className="flex items-center text-sm text-muted-foreground sm:ml-3">
              <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Walk-ins welcome
            </p>
          </div>

          <div className="reveal mt-8 aspect-video overflow-hidden rounded-xl border border-border lg:aspect-[21/9]">
            <iframe
              src={businessConfig.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Model Home Art Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
