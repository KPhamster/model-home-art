import Link from "next/link";
import { framingCategories } from "@/lib/config";
import { 
  Shirt, Square, ScrollText, Palette, Image, Camera, 
  Frame, Scissors, Box, Plus 
} from "lucide-react";

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
            return (
              <Link
                key={category.id}
                href={`/what-we-frame#${category.id}`}
                className="group flex flex-col items-center p-6 bg-white rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </span>
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
