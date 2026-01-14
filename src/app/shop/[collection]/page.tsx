import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight } from "lucide-react";

// Placeholder data
const collections: Record<string, { name: string; description: string }> = {
  modern: { name: "Modern Frames", description: "Clean lines and contemporary styles for today's spaces." },
  classic: { name: "Classic Frames", description: "Timeless traditional frames that never go out of style." },
  "gallery-sets": { name: "Gallery Sets", description: "Curated frame collections for stunning gallery walls." },
  "shadow-boxes": { name: "Shadow Boxes", description: "Deep frames perfect for 3D displays and memorabilia." },
  "poster-frames": { name: "Poster Frames", description: "Large format frames for posters and prints." },
  floating: { name: "Floating Frames", description: "Modern floating edge designs for a contemporary look." },
  all: { name: "All Frames", description: "Browse our complete collection of ready-made frames." },
};

const allProducts = [
  { id: "1", slug: "modern-black-8x10", name: "Modern Black Frame", size: "8×10", price: 2499, collection: "modern" },
  { id: "2", slug: "modern-black-11x14", name: "Modern Black Frame", size: "11×14", price: 3299, collection: "modern" },
  { id: "3", slug: "modern-black-16x20", name: "Modern Black Frame", size: "16×20", price: 4299, collection: "modern" },
  { id: "4", slug: "modern-white-8x10", name: "Modern White Frame", size: "8×10", price: 2499, collection: "modern" },
  { id: "5", slug: "modern-white-11x14", name: "Modern White Frame", size: "11×14", price: 3299, collection: "modern" },
  { id: "6", slug: "classic-walnut-8x10", name: "Classic Walnut Frame", size: "8×10", price: 2999, collection: "classic" },
  { id: "7", slug: "classic-walnut-11x14", name: "Classic Walnut Frame", size: "11×14", price: 3999, collection: "classic" },
  { id: "8", slug: "classic-cherry-8x10", name: "Classic Cherry Frame", size: "8×10", price: 3299, collection: "classic" },
  { id: "9", slug: "gold-ornate-8x10", name: "Gold Ornate Frame", size: "8×10", price: 3999, collection: "classic" },
  { id: "10", slug: "shadow-box-8x8", name: "Shadow Box", size: "8×8", price: 4299, collection: "shadow-boxes" },
  { id: "11", slug: "shadow-box-12x12", name: "Shadow Box", size: "12×12", price: 5499, collection: "shadow-boxes" },
  { id: "12", slug: "floating-12x12", name: "Floating Frame", size: "12×12", price: 3799, collection: "floating" },
  { id: "13", slug: "floating-16x16", name: "Floating Frame", size: "16×16", price: 4799, collection: "floating" },
  { id: "14", slug: "poster-frame-24x36", name: "Poster Frame", size: "24×36", price: 4999, collection: "poster-frames" },
  { id: "15", slug: "poster-frame-27x40", name: "Poster Frame", size: "27×40", price: 5999, collection: "poster-frames" },
  { id: "16", slug: "gallery-set-5pc", name: "Gallery Set", size: "5 pieces", price: 8999, collection: "gallery-sets" },
];

interface PageProps {
  params: Promise<{ collection: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { collection } = await params;
  const collectionData = collections[collection];
  
  if (!collectionData) {
    return { title: "Collection Not Found" };
  }

  return {
    title: collectionData.name,
    description: collectionData.description,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { collection } = await params;
  const collectionData = collections[collection];

  if (!collectionData) {
    notFound();
  }

  const products = collection === "all" 
    ? allProducts 
    : allProducts.filter((p) => p.collection === collection);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-stone-50 border-b">
        <div className="container-wide py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/shop" className="text-muted-foreground hover:text-foreground">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{collectionData.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="py-8 lg:py-12 bg-background">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-2">
                {collectionData.name}
              </h1>
              <p className="text-muted-foreground">{collectionData.description}</p>
              <p className="text-sm text-muted-foreground mt-2">{products.length} products</p>
            </div>
            <div className="flex gap-3">
              <Select defaultValue="featured">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
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

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products in this collection yet.</p>
              <Button asChild variant="outline">
                <Link href="/shop">Browse all frames</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
