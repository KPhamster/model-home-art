import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Shop Framed Art",
  description: "Shop framed art in popular sizes. Modern, classic, gallery sets, and shadow boxes.",
};

// Placeholder data
const collections = [
  { id: "modern", name: "Modern", description: "Clean lines and contemporary styles", count: 24, image: "/collections/modern.jpg" },
  { id: "classic", name: "Classic", description: "Timeless traditional frames", count: 18, image: "/collections/classic.jpg" },
  { id: "gallery-sets", name: "Gallery Sets", description: "Curated frame collections for gallery walls", count: 12, image: "/collections/gallery.jpg" },
  { id: "shadow-boxes", name: "Shadow Boxes", description: "Deep frames for 3D displays", count: 8, image: "/collections/shadow.jpg" },
  { id: "poster-frames", name: "Poster Frames", description: "Large format frames for posters", count: 15, image: "/collections/poster.jpg" },
  { id: "floating", name: "Floating Frames", description: "Modern floating edge designs", count: 10, image: "/collections/floating.jpg" },
];

const featuredProducts = [
  { id: "1", slug: "modern-black-8x10", name: "Modern Black Frame", size: "8×10", price: 2499, collection: "modern" },
  { id: "2", slug: "classic-walnut-11x14", name: "Classic Walnut Frame", size: "11×14", price: 3499, collection: "classic" },
  { id: "3", slug: "white-gallery-16x20", name: "White Gallery Frame", size: "16×20", price: 4499, collection: "modern" },
  { id: "4", slug: "gold-ornate-8x10", name: "Gold Ornate Frame", size: "8×10", price: 3999, collection: "classic" },
  { id: "5", slug: "natural-oak-11x14", name: "Natural Oak Frame", size: "11×14", price: 3299, collection: "modern" },
  { id: "6", slug: "slim-metal-5x7", name: "Slim Metal Frame", size: "5×7", price: 1999, collection: "modern" },
  { id: "7", slug: "floating-12x12", name: "Floating Frame", size: "12×12", price: 3799, collection: "floating" },
  { id: "8", slug: "shadow-box-8x8", name: "Shadow Box Frame", size: "8×8", price: 4299, collection: "shadow-boxes" },
];

export default function ShopPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-stone-100 to-background">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-4">
              Shop Framed Art
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Beautiful art in quality frames — ready to ship!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="px-3 py-1">Easy returns</Badge>
              <Badge variant="secondary" className="px-3 py-1">Ships in 3-5 days</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container-wide">
          <h2 className="text-2xl font-heading font-semibold mb-8">Shop by Collection</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/shop/${collection.id}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <div className="aspect-[3/2] bg-stone-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <span className="text-sm">[Collection Image]</span>
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-semibold">{collection.name}</h3>
                      <p className="text-sm text-white/80">{collection.count} frames</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">{collection.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 lg:py-16 bg-stone-50">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-heading font-semibold">Featured Frames</h2>
            <Link href="/shop/all" className="text-primary font-medium hover:underline">
              View all →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/shop/product/${product.slug}`}>
                <Card className="group overflow-hidden hover:shadow-md transition-shadow h-full">
                  <div className="aspect-square bg-stone-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 border-4 border-stone-300 rounded" />
                        <p className="text-xs">[Product Image]</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{product.size}</p>
                    <p className="font-semibold mt-2">${(product.price / 100).toFixed(2)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Framing CTA */}
      <section className="py-12 lg:py-16 bg-primary text-white">
        <div className="container-wide text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4">
            Need something custom?
          </h2>
          <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
            Our ready-made frames are great for standard sizes. For custom dimensions 
            or special items, get a custom framing quote.
          </p>
          <Button asChild variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link href="/quote">Get a Custom Quote</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
