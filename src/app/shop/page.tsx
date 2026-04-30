import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Framed Art",
  description: "Shop framed art in popular sizes. Modern, classic, gallery sets, and shadow boxes.",
};

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function ProductImage({ src, alt }: { src?: string | null; alt: string }) {
  if (src) {
    return <img src={src} alt={alt} className="h-full w-full object-cover transition-transform group-hover:scale-105" />;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center text-stone-400">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-2 border-4 border-stone-300 rounded" />
        <p className="text-xs">[Product Image]</p>
      </div>
    </div>
  );
}

export default async function ShopPage() {
  const [collections, featuredProducts] = await Promise.all([
    prisma.collection.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
    prisma.product.findMany({
      where: { featured: true, inStock: true },
      include: { collection: true },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <>
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

      <section className="py-12 lg:py-16 bg-background">
        <div className="container-wide">
          <h2 className="text-2xl font-heading font-semibold mb-8">Shop by Collection</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/shop/${collection.slug}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <div className="aspect-[3/2] bg-stone-200 relative overflow-hidden">
                    {collection.image ? (
                      <img src={collection.image} alt={collection.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <span className="text-sm">[Collection Image]</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-semibold">{collection.name}</h3>
                      <p className="text-sm text-white/80">{collection._count.products} products</p>
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
                  <div className="aspect-square bg-stone-100 relative overflow-hidden">
                    <ProductImage src={product.images[0]} alt={product.name} />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {product.sizes[0] ?? product.collection?.name ?? "Ready to ship"}
                    </p>
                    <p className="font-semibold mt-2">{formatMoney(product.price)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {featuredProducts.length === 0 ? (
            <p className="text-muted-foreground">No featured products yet.</p>
          ) : null}
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-primary text-white">
        <div className="container-wide text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4">
            Need something custom?
          </h2>
          <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
            Our ready-made frames are great for standard sizes. For custom dimensions or special items, get a custom framing quote.
          </p>
          <Button asChild variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link href="/quote">Get a Custom Quote</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
