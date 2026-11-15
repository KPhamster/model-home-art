import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CtaBanner } from "@/components/ui/cta-banner";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Framed Art",
  description: "Shop framed art in popular sizes. Modern, classic, gallery sets, and shadow boxes.",
};

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function firstImage(value?: string | null) {
  return value
    ?.split(/[\n,]/)
    .map((url) => url.trim())
    .filter(Boolean)[0];
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
      <PageHero title="Shop Framed Art" lede="Beautiful art in quality frames — ready to ship!">
        <ul className="flex flex-wrap justify-center gap-2.5">
          {["Easy returns", "Ships in 3-5 days"].map((promise) => (
            <li
              key={promise}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-stone-200"
            >
              {promise}
            </li>
          ))}
        </ul>
      </PageHero>

      {/* Shown only when there is at least one collection, so the heading never stands alone. */}
      {collections.length > 0 ? (
        <section className="bg-background py-16 lg:py-24">
          <div className="container-wide">
            <SectionHeading align="left" title="Shop by Collection" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <Link key={collection.id} href={`/shop/${collection.slug}`} className="reveal">
                  <Card className="group h-full overflow-hidden rounded-xl py-0 transition-shadow duration-300 hover:shadow-lg">
                    <div className="relative aspect-[3/2] overflow-hidden bg-stone-200">
                      {firstImage(collection.image) ? (
                        <img
                          src={firstImage(collection.image)}
                          alt={collection.name}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <span className="text-sm">[Collection Image]</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-heading text-xl font-semibold">{collection.name}</h3>
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
      ) : null}

      <section className="bg-sand py-16 lg:py-24">
        <div className="container-wide">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading align="left" title="Featured Frames" />
            <Link href="/shop/all" className="reveal shrink-0 pb-1 font-medium text-primary underline-offset-4 hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/shop/product/${product.slug}`} className="reveal">
                <Card className="group h-full overflow-hidden rounded-xl py-0 transition-shadow duration-300 hover:shadow-md">
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    <ProductImage src={product.images[0]} alt={product.name} />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="line-clamp-1 text-sm font-medium transition-colors group-hover:text-primary">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {product.sizes[0] ?? product.collection?.name ?? "Ready to ship"}
                    </p>
                    <p className="mt-2 font-semibold">{formatMoney(product.price)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {featuredProducts.length === 0 ? <p className="text-muted-foreground">No featured products yet.</p> : null}
        </div>
      </section>

      <CtaBanner
        title={
          <>
            Need something <span className="italic text-[#e3cdb2]">custom?</span>
          </>
        }
        lede="Our ready-made frames are great for standard sizes. For custom dimensions or special items, get a custom framing quote."
      >
        <Button asChild size="lg" className="h-12 px-7 text-base">
          <Link href="/quote">Get a Custom Quote</Link>
        </Button>
      </CtaBanner>
    </>
  );
}
