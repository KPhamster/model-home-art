import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ collection: string }>;
}

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { collection } = await params;
  if (collection === "all") {
    return { title: "All Frames", description: "Browse our complete collection of ready-made frames." };
  }

  const collectionData = await prisma.collection.findUnique({ where: { slug: collection } });
  if (!collectionData) return { title: "Collection Not Found" };

  return {
    title: collectionData.name,
    description: collectionData.description ?? undefined,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { collection } = await params;
  const collectionData = collection === "all"
    ? { name: "All Frames", description: "Browse our complete collection of ready-made frames." }
    : await prisma.collection.findUnique({ where: { slug: collection } });

  if (!collectionData) notFound();

  const products = await prisma.product.findMany({
    where: collection === "all" ? { inStock: true } : { inStock: true, collection: { slug: collection } },
    include: { collection: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });

  return (
    <>
      <div className="bg-stone-50 border-b">
        <div className="container-wide py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/shop" className="text-muted-foreground hover:text-foreground">Shop</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{collectionData.name}</span>
          </nav>
        </div>
      </div>

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
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/shop/product/${product.slug}`}>
                <Card className="group overflow-hidden hover:shadow-md transition-shadow h-full">
                  <div className="aspect-square bg-stone-100 relative overflow-hidden">
                    {product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 border-4 border-stone-300 rounded" />
                          <p className="text-xs">[Product Image]</p>
                        </div>
                      </div>
                    )}
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
