import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { extendedFramingCategories } from "@/lib/config";
import { Search } from "lucide-react";
import jerseyImage from "../../../assets/jersey_image.png";
import mirrorImage from "../../../assets/mirror_image.jpeg";
import diplomaImage from "../../../assets/diploma_image.jpeg";
import fineArtImage from "../../../assets/fine_art_image.jpg";
import posterImage from "../../../assets/poster_image.jpeg";
import photoImage from "../../../assets/photo_image.png";
import canvasStretchingImage from "../../../assets/canvas_stretching_image.png";
import needleworkImage from "../../../assets/needlework_image.png";
import memorabiliaImage from "../../../assets/memorabilia_image.png";
import medalsImage from "../../../assets/medals_image.jpeg";
import albumImage from "../../../assets/album_image.jpeg";
import babyKeepsakeImage from "../../../assets/babykeepsake_image.jpeg";
import weddingImage from "../../../assets/wedding_image.jpeg";
import militaryImage from "../../../assets/military_image.jpeg";
import sportsImage from "../../../assets/sports_image.jpeg";
import documentImage from "../../../assets/document_image.jpeg";
import mapImage from "../../../assets/map_image.jpeg";
import flagsImage from "../../../assets/flags_image.jpeg";
import callToActionImage from "../../../assets/calltoaction_image.jpg";

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

const cardImages: Partial<Record<string, { src: string; alt: string }>> = {
  jerseys: { src: jerseyImage.src, alt: "Framed jersey display" },
  mirrors: { src: mirrorImage.src, alt: "Custom framed mirror" },
  diplomas: { src: diplomaImage.src, alt: "Framed diplomas and certificates" },
  "fine-art": { src: fineArtImage.src, alt: "Framed fine art" },
  posters: { src: posterImage.src, alt: "Framed posters and prints" },
  photos: { src: photoImage.src, alt: "Framed photos" },
  canvas: { src: canvasStretchingImage.src, alt: "Stretched canvas" },
  needlework: { src: needleworkImage.src, alt: "Framed needlework and textiles" },
  shadowboxes: { src: memorabiliaImage.src, alt: "Shadowbox memorabilia display" },
  medals: { src: medalsImage.src, alt: "Framed medals and awards" },
  vinyl: { src: albumImage.src, alt: "Framed vinyl record and album art" },
  baby: { src: babyKeepsakeImage.src, alt: "Framed baby keepsakes" },
  wedding: { src: weddingImage.src, alt: "Framed wedding items" },
  military: { src: militaryImage.src, alt: "Framed military memorabilia" },
  sports: { src: sportsImage.src, alt: "Framed sports equipment" },
  documents: { src: documentImage.src, alt: "Framed important documents" },
  maps: { src: mapImage.src, alt: "Framed maps and blueprints" },
  flags: { src: flagsImage.src, alt: "Framed flags and banners" },
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

export default function WhatWeFramePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-stone-100 to-background">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-6">
              What We Frame
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              If it's meaningful to you, we can frame it. Browse our categories below or ask us about anything you'd like to preserve and display.
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container-wide">
          <h2 className="text-2xl font-heading font-semibold mb-8">Popular Categories</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extendedFramingCategories.map((category) => {
              const cardImage = cardImages[category.id];
              const isJersey = category.id === "jerseys";
              const description =
                cardDescriptions[category.id] ??
                `Professional framing for your ${category.name.toLowerCase()}. We'll help you choose the perfect frame style, matting, and glass.`;
              return (
                <Card
                  key={category.id}
                  id={category.id}
                  className="group hover:shadow-lg transition-shadow py-0 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div
                      className={`bg-stone-100 overflow-hidden ${
                        cardImage
                          ? "min-h-[300px] sm:min-h-[330px] lg:min-h-[360px]"
                          : "aspect-video flex items-center justify-center text-muted-foreground rounded-lg"
                      }`}
                    >
                      {cardImage ? (
                        <img
                          src={cardImage.src}
                          alt={cardImage.alt}
                          className={isJersey ? "h-full w-full object-contain" : "h-full w-full object-cover"}
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-sm">[{category.name} Image]</span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {description}
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className={
                          cardImage
                            ? "border-primary/70 text-primary hover:bg-primary/90 hover:text-white"
                            : ""
                        }
                      >
                        <Link href="/quote">Get a Quote</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Items List */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="container-wide">
          <h2 className="text-2xl font-heading font-semibold mb-4">And So Much More...</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Here's a partial list of other items we frame. Don't see what you're looking for? Just ask — if it can be framed, we can do it!
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {additionalItems.map((item) => (
              <div
                key={item}
                className="px-3 py-2 bg-white rounded border border-border text-sm hover:border-primary/50 transition-colors"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 lg:py-24 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={callToActionImage.src}
            alt="Custom framed art in a warm home setting"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container-wide text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold mb-6">
            Have something to frame?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Send us photos and we'll provide options that fit your style and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-base bg-primary text-white hover:bg-white hover:text-primary"
            >
              <Link href="/quote">Get a Fast Quote</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-base bg-white text-primary hover:bg-primary hover:text-white"
            >
              <Link href="/contact">Visit Our Shop</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
