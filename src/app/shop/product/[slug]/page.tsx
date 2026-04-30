import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import prisma from "@/lib/db";
import { ChevronRight, RotateCcw, Shield, Check } from "lucide-react";
import { PurchaseControls } from "./purchase-controls";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { collection: true },
  });

  if (!product || !product.inStock) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      inStock: true,
      id: { not: product.id },
      collectionId: product.collectionId,
    },
    take: 4,
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });

  return (
    <>
      <div className="bg-stone-50 border-b">
        <div className="container-wide py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/shop" className="text-muted-foreground hover:text-foreground">Shop</Link>
            {product.collection ? (
              <>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <Link href={`/shop/${product.collection.slug}`} className="text-muted-foreground hover:text-foreground">
                  {product.collection.name}
                </Link>
              </>
            ) : null}
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="py-8 lg:py-12 bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-stone-100 rounded-lg flex items-center justify-center overflow-hidden">
                {product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="w-32 h-32 mx-auto mb-4 border-8 border-stone-300 rounded" />
                    <p>[Main Product Image]</p>
                  </div>
                )}
              </div>
              {product.images.length > 1 ? (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div key={image} className="aspect-square bg-stone-100 rounded overflow-hidden">
                      <img src={image} alt={`${product.name} image ${index + 1}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <div className="mb-6">
                {product.collection ? (
                  <Badge variant="secondary" className="mb-2">{product.collection.name}</Badge>
                ) : null}
                <h1 className="text-3xl font-heading font-semibold mb-2">{product.name}</h1>
                <div className="flex items-baseline gap-3">
                  <p className="text-2xl font-semibold text-primary">{formatMoney(product.price)}</p>
                  {product.comparePrice ? (
                    <p className="text-muted-foreground line-through">{formatMoney(product.comparePrice)}</p>
                  ) : null}
                </div>
              </div>

              {product.description ? (
                <p className="text-muted-foreground mb-6">{product.description}</p>
              ) : null}

              <PurchaseControls productName={product.name} sizes={product.sizes} />

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center p-3 bg-stone-50 rounded-lg">
                  <RotateCcw className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs">Easy returns</p>
                </div>
                <div className="text-center p-3 bg-stone-50 rounded-lg">
                  <Shield className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs">Quality guaranteed</p>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="materials">
                  <AccordionTrigger>Materials & Quality</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{product.materials ?? "Quality framed art, ready to display."}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        Ships within 3-5 business days
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        30-day return policy for undamaged items
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="custom">
                  <AccordionTrigger>Need a Custom Size?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground text-sm mb-3">
                      Don&apos;t see your size? We offer custom framing for any dimensions.
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/quote">Get a Custom Quote</Link>
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="py-12 bg-stone-50">
          <div className="container-wide">
            <h2 className="text-2xl font-heading font-semibold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <Link key={related.id} href={`/shop/product/${related.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-stone-100 flex items-center justify-center overflow-hidden">
                      {related.images[0] ? (
                        <img src={related.images[0]} alt={related.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-muted-foreground text-sm">[Related]</span>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-sm">{related.name}</h3>
                      <p className="text-xs text-muted-foreground">{related.sizes[0] ?? "Ready to ship"}</p>
                      <p className="font-semibold mt-1">{formatMoney(related.price)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
