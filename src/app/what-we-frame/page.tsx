import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { extendedFramingCategories } from "@/lib/config";
import { Search } from "lucide-react";

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
            {extendedFramingCategories.map((category) => (
              <Card key={category.id} id={category.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="aspect-video bg-stone-100 rounded-lg mb-4 flex items-center justify-center text-muted-foreground">
                    <span className="text-sm">[{category.name} Image]</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Professional framing for your {category.name.toLowerCase()}. We'll help you choose the perfect frame style, matting, and glass.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/quote">Get a Quote</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Items List */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="container-wide">
          <h2 className="text-2xl font-heading font-semibold mb-4">And So Much More...</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Here's a partial list of other items we frame. Don't see what you're looking for? Just ask — if it can be framed, we can do it.
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
      <section className="py-16 lg:py-20 bg-primary text-white">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6">
            Have something to frame?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Send us photos and we'll provide options that fit your style and budget.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link href="/quote">Get a Fast Quote</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
