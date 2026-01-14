"use client";

import { useState } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { galleryCategories } from "@/lib/config";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

// Placeholder gallery items
const galleryItems = [
  { id: "1", title: "Lakers Jersey", category: "jerseys", image: "/gallery/jersey-1.jpg" },
  { id: "2", title: "Signed Baseball Jersey", category: "jerseys", image: "/gallery/jersey-2.jpg" },
  { id: "3", title: "Football Jersey Display", category: "jerseys", image: "/gallery/jersey-3.jpg" },
  { id: "4", title: "Law School Diploma", category: "diplomas", image: "/gallery/diploma-1.jpg" },
  { id: "5", title: "Medical Degree", category: "diplomas", image: "/gallery/diploma-2.jpg" },
  { id: "6", title: "MBA Certificate", category: "diplomas", image: "/gallery/diploma-3.jpg" },
  { id: "7", title: "Abstract Oil Painting", category: "fine-art", image: "/gallery/art-1.jpg" },
  { id: "8", title: "Watercolor Landscape", category: "fine-art", image: "/gallery/art-2.jpg" },
  { id: "9", title: "Original Sketch", category: "fine-art", image: "/gallery/art-3.jpg" },
  { id: "10", title: "Vintage Movie Poster", category: "posters", image: "/gallery/poster-1.jpg" },
  { id: "11", title: "Concert Poster Collection", category: "posters", image: "/gallery/poster-2.jpg" },
  { id: "12", title: "Travel Poster Set", category: "posters", image: "/gallery/poster-3.jpg" },
  { id: "13", title: "Military Medals Display", category: "shadowboxes", image: "/gallery/shadow-1.jpg" },
  { id: "14", title: "Baby Keepsakes Box", category: "shadowboxes", image: "/gallery/shadow-2.jpg" },
  { id: "15", title: "Wedding Memorabilia", category: "shadowboxes", image: "/gallery/shadow-3.jpg" },
  { id: "16", title: "Faded Photo Restoration", category: "before-after", image: "/gallery/before-1.jpg", beforeImage: "/gallery/before-1-old.jpg" },
  { id: "17", title: "Damaged Frame Repair", category: "before-after", image: "/gallery/before-2.jpg", beforeImage: "/gallery/before-2-old.jpg" },
  { id: "18", title: "Office Wall Installation", category: "installations", image: "/gallery/install-1.jpg" },
  { id: "19", title: "Hotel Lobby Display", category: "installations", image: "/gallery/install-2.jpg" },
  { id: "20", title: "Home Gallery Wall", category: "installations", image: "/gallery/install-3.jpg" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredItems = activeCategory === "all"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  const handlePrev = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : filteredItems.length - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage < filteredItems.length - 1 ? selectedImage + 1 : 0);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-stone-100 to-background">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-6">
              Our Work
            </h1>
            <p className="text-xl text-muted-foreground">
              Browse examples of our custom framing, from jerseys to fine art to full installations.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container-wide">
          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
            <TabsList className="flex flex-wrap justify-center gap-2 h-auto bg-transparent">
              {galleryCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredItems.map((item, index) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <Card
                    className="break-inside-avoid cursor-pointer group overflow-hidden"
                    onClick={() => setSelectedImage(index)}
                  >
                    <div className="relative aspect-[4/3] bg-stone-200">
                      {/* Placeholder Image */}
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <div className="text-center p-4">
                          <div className="w-12 h-12 mx-auto mb-2 border-2 border-stone-300 rounded" />
                          <p className="text-xs">[{item.title}]</p>
                        </div>
                      </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium">{item.title}</p>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-[4/3] bg-stone-200 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <p className="font-medium">[{item.title}]</p>
                        <p className="text-sm">Full size image</p>
                      </div>
                    </div>
                    {/* Navigation */}
                    <button
                      onClick={handlePrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{item.category.replace("-", " ")}</p>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {/* No Results */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-primary text-white">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6">
            Ready to frame your piece?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Send us photos and we'll show you how amazing it could look.
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
