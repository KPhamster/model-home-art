import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Placeholder product data
const featuredProducts = [
  { id: "1", name: "Modern Black Frame", size: "8x10", price: 2499 },
  { id: "2", name: "Classic Wood Frame", size: "11x14", price: 3499 },
  { id: "3", name: "White Gallery Frame", size: "16x20", price: 4499 },
  { id: "4", name: "Gold Ornate Frame", size: "8x10", price: 3999 },
  { id: "5", name: "Natural Oak Frame", size: "11x14", price: 3299 },
  { id: "6", name: "Slim Metal Frame", size: "5x7", price: 1999 },
  { id: "7", name: "Floating Frame", size: "12x12", price: 3799 },
  { id: "8", name: "Shadow Box Frame", size: "8x8", price: 4299 },
];

const collections = [
  { id: "modern", name: "Modern", count: 24 },
  { id: "classic", name: "Classic", count: 18 },
  { id: "gallery", name: "Gallery Sets", count: 12 },
  { id: "shadow", name: "Shadow Boxes", count: 8 },
];

export function ShopPreviewSection() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-2">
              Shop Framed Art
            </h2>
            <p className="text-lg text-muted-foreground">
              Beautiful art in quality frames — ready to ship!
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/shop">View All Frames</Link>
          </Button>
        </div>

        {/* Collections */}
        <div className="flex flex-wrap gap-2 mb-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/shop/${collection.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
            >
              <span className="font-medium">{collection.name}</span>
              <Badge variant="secondary" className="text-xs">
                {collection.count}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/shop/product/${product.id}`}>
              <Card className="group overflow-hidden hover:shadow-md transition-shadow">
                {/* Product Image Placeholder */}
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
                  <p className="font-semibold mt-2">
                    ${(product.price / 100).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <Button asChild size="lg">
            <Link href="/shop">Shop All Frames</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
