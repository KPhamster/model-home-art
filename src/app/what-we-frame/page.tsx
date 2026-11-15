import Link from "next/link";
import { Metadata } from "next";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/ui/cta-banner";
import { Input } from "@/components/ui/input";
import { PageHero, onDarkOutline } from "@/components/ui/page-hero";
import { Photo } from "@/components/ui/photo";
import { SectionHeading } from "@/components/ui/section-heading";
import { extendedFramingCategories } from "@/lib/config";
import type { PhotoName } from "@/lib/photos";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "What We Frame",
  description: "We frame jerseys, diplomas, fine art, posters, photos, mirrors, canvas, needlework, shadowboxes, memorabilia, and more. See our full list of framing services.",
};

const additionalItems = [
  "Concert tickets",
  "Sports tickets",
  "Event memorabilia",
  "Medals & ribbons",
  "Awards & plaques",
  "Vinyl records",
  "Album covers",
  "Movie posters",
  "Travel posters",
  "Baby footprints",
  "Ultrasound photos",
  "Birth announcements",
  "Wedding invitations",
  "Marriage certificates",
  "Family photos",
  "Portrait photography",
  "Original paintings",
  "Watercolors",
  "Drawings & sketches",
  "Limited edition prints",
  "Military flags",
  "Service medals",
  "Dog tags",
  "Uniforms",
  "Maps & blueprints",
  "Architectural drawings",
  "Legal documents",
  "Historical documents",
  "Cross-stitch",
  "Embroidery",
  "Quilted pieces",
  "Vintage textiles",
  "Sports equipment",
  "Golf flags",
  "Game-worn items",
  "Autographed items",
  "Magazine covers",
  "Newspaper clippings",
  "Children's artwork",
  "Custom puzzles",
];

const cardImages: Partial<Record<string, { name: PhotoName; alt: string }>> = {
  jerseys: { name: "jersey", alt: "Framed jersey display" },
  mirrors: { name: "mirror", alt: "Custom framed mirror" },
  diplomas: { name: "diploma", alt: "Framed diplomas and certificates" },
  "fine-art": { name: "fine-art", alt: "Framed fine art" },
  posters: { name: "poster", alt: "Framed posters and prints" },
  photos: { name: "photo", alt: "Framed photos" },
  canvas: { name: "canvas-stretching", alt: "Stretched canvas" },
  needlework: { name: "needlework", alt: "Framed needlework and textiles" },
  shadowboxes: { name: "memorabilia", alt: "Shadowbox memorabilia display" },
  medals: { name: "medals", alt: "Framed medals and awards" },
  vinyl: { name: "album", alt: "Framed vinyl record and album art" },
  baby: { name: "baby-keepsake", alt: "Framed baby keepsakes" },
  wedding: { name: "wedding", alt: "Framed wedding items" },
  military: { name: "military", alt: "Framed military memorabilia" },
  sports: { name: "sports", alt: "Framed sports equipment" },
  documents: { name: "document", alt: "Framed important documents" },
  maps: { name: "map", alt: "Framed maps and blueprints" },
  flags: { name: "flags", alt: "Framed flags and banners" },
};

const cardDescriptions: Partial<Record<string, string>> = {
  jerseys: "Celebrate the moment it all happened — we frame jerseys to feel like true trophies on your wall.",
  mirrors: "Turn a simple mirror into a piece that completes the room with a frame that feels made for your home.",
  diplomas: "Give hard-earned milestones the respect they deserve with archival framing that lasts for decades.",
  "fine-art": "Let your art breathe and shine with conservation materials that protect what you love.",
  posters: "Make favorite posters look intentional and elevated with crisp mats and clean lines.",
  photos: "Keep your most meaningful memories front and center with framing that makes them feel timeless.",
  canvas: "Transform canvas into a gallery-ready statement with a tight, polished stretch and frame.",
  needlework: "Honor the hours and care in every stitch with framing that preserves color and detail.",
  shadowboxes: "Tell the full story by framing depth — perfect for keepsakes, medals, and heirlooms.",
  medals: "Display pride and achievement with a refined presentation that feels ceremonial.",
  vinyl: "Showcase the soundtrack of your life by framing vinyl and album art like true icons.",
  baby: "Hold onto fleeting moments with keepsake framing that feels warm, gentle, and lasting.",
  wedding: "Preserve the pieces of your day — vows, invites, and florals — in frames worthy of the memory.",
  military: "Honor service and sacrifice with dignified framing built to last generations.",
  sports: "Celebrate game-day memories with custom depth that protects and displays your gear.",
  documents: "Protect the papers that matter most with archival mats and UV glass.",
  maps: "Frame the places you love — a home, a journey, a dream — with clean, tailored mats.",
  flags: "Preserve tradition and pride with custom framing that supports and protects every fold.",
};

const heroLede =
  "If it's meaningful to you, we can frame it. Browse our categories below or ask us about anything you'd like to preserve and display.";
const moreLede =
  "Here's a partial list of other items we frame. Don't see what you're looking for? Just ask — if it can be framed, we can do it!";
const closingLede = "Send us photos and we'll provide options that fit your style and budget.";

export default function WhatWeFramePage() {
  return (
    <>
      <PageHero title="What We Frame" lede={heroLede}>
        <div className="relative mx-auto max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="h-12 border-white/15 bg-white/5 pl-11 text-base text-stone-50 placeholder:text-stone-400"
          />
        </div>
      </PageHero>

      {/* Main categories */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeading align="left" title="Popular Categories" />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {extendedFramingCategories.map((category) => {
              const cardImage = cardImages[category.id];
              const description =
                cardDescriptions[category.id] ??
                `Professional framing for your ${category.name.toLowerCase()}. We'll help you choose the perfect frame style, matting, and glass.`;
              return (
                // scroll-mt keeps the card clear of the sticky header when the homepage links to it.
                <article
                  key={category.id}
                  id={category.id}
                  className="reveal group scroll-mt-24 overflow-hidden rounded-xl border border-border bg-white transition-shadow duration-300 hover:shadow-lg"
                >
                  {/* The photos are two wide by three tall, and so is their box: nothing is cropped. */}
                  <div
                    className={cn(
                      "overflow-hidden bg-stone-100",
                      cardImage ? "aspect-[2/3]" : "flex aspect-video items-center justify-center text-muted-foreground",
                    )}
                  >
                    {cardImage ? (
                      <Photo
                        name={cardImage.name}
                        alt={cardImage.alt}
                        sizes="(min-width: 1400px) 440px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span className="text-sm">[{category.name} Image]</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-semibold transition-colors group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mt-4 border-primary/60 text-primary hover:bg-primary hover:text-white"
                    >
                      <Link href="/quote">Get a Quote</Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Everything else */}
      <section className="bg-sand py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeading align="left" title="And So Much More..." lede={moreLede} className="max-w-2xl" />

          <ul className="reveal mt-10 flex flex-wrap gap-2">
            {additionalItems.map((item) => (
              <li
                key={item}
                className="rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-sm transition-colors hover:border-primary/50"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner
        title={
          <>
            Have something to <span className="italic text-[#e3cdb2]">frame?</span>
          </>
        }
        lede={closingLede}
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
