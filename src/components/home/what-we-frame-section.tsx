import Link from "next/link";
import { framingCategories } from "@/lib/config";
import { 
  Shirt, Square, ScrollText, Palette, Image, Camera, 
  Frame, Scissors, Box, Plus 
} from "lucide-react";
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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shirt: Shirt,
  square: Square,
  scroll: ScrollText,
  palette: Palette,
  image: Image,
  camera: Camera,
  frame: Frame,
  scissors: Scissors,
  box: Box,
  plus: Plus,
};

const cardImages: Partial<Record<string, { src: string; alt: string }>> = {
  jerseys: { src: jerseyImage.src, alt: "Framed jersey" },
  mirrors: { src: mirrorImage.src, alt: "Framed mirror" },
  diplomas: { src: diplomaImage.src, alt: "Framed diploma and certificates" },
  "fine-art": { src: fineArtImage.src, alt: "Framed fine art" },
  posters: { src: posterImage.src, alt: "Framed posters and prints" },
  photos: { src: photoImage.src, alt: "Framed photos" },
  canvas: { src: canvasStretchingImage.src, alt: "Stretched canvas" },
  needlework: { src: needleworkImage.src, alt: "Framed needlework and textiles" },
  shadowboxes: { src: memorabiliaImage.src, alt: "Shadowbox memorabilia display" },
  medals: { src: medalsImage.src, alt: "Framed medals and awards" },
};

export function WhatWeFrameSection() {
  return (
    <section className="py-16 lg:py-20 bg-stone-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
            What We Frame
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From jerseys to diplomas, fine art to family photos — we frame it all with care and precision.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {framingCategories.map((category) => {
            const Icon = iconMap[category.icon] || Frame;
            const cardImage = cardImages[category.id];
            const isJersey = category.id === "jerseys";
            return (
              <Link
                key={category.id}
                href={`/what-we-frame#${category.id}`}
                className={`group flex flex-col min-h-[300px] sm:min-h-[330px] lg:min-h-[360px] rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all bg-white ${
                  cardImage ? "overflow-hidden" : "items-center justify-center p-6"
                }`}
              >
                {cardImage ? (
                  <>
                    <div className="w-full min-h-[300px] sm:min-h-[330px] lg:min-h-[360px] bg-stone-100 overflow-hidden">
                      <img
                        src={cardImage.src}
                        alt={cardImage.alt}
                        className={isJersey ? "h-full w-full object-contain" : "h-full w-full object-cover"}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-center p-4">
                      <span className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors overflow-hidden">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/what-we-frame"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            See all categories →
          </Link>
        </div>
      </div>
    </section>
  );
}
