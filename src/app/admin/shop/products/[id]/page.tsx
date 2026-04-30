import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductImageSizeFields } from "@/components/admin/product-image-size-fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/db";
import { deleteProduct, updateProduct } from "../../actions";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

function dollars(cents: number | null) {
  return cents ? (cents / 100).toFixed(2) : "";
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, collections] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.collection.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] }),
  ]);

  if (!product) notFound();

  const updateAction = updateProduct.bind(null, product.id);
  const deleteAction = deleteProduct.bind(null, product.id);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b">
        <div className="container-wide py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-semibold">Edit Product</h1>
            <p className="text-sm text-muted-foreground">{product.name}</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/shop">Back to Shop Admin</Link>
          </Button>
        </div>
      </div>

      <main className="container-wide py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Product details</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateAction} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={product.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" defaultValue={product.slug} required />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" defaultValue={dollars(product.price)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="comparePrice">Compare at</Label>
                  <Input id="comparePrice" name="comparePrice" defaultValue={dollars(product.comparePrice)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="collectionId">Collection</Label>
                <select
                  id="collectionId"
                  name="collectionId"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  defaultValue={product.collectionId ?? ""}
                >
                  <option value="">No collection</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={4} defaultValue={product.description ?? ""} />
              </div>
              <ProductImageSizeFields
                imageId="images"
                imageName="images"
                imageDefaultValue={product.images.join("\n")}
                sizeId="size"
                sizeName="sizes"
                sizeDefaultValue={product.sizes[0] ?? ""}
              />
              <div className="grid gap-2">
                <Label htmlFor="materials">Materials</Label>
                <Textarea id="materials" name="materials" rows={3} defaultValue={product.materials ?? ""} />
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="inventory">Inventory</Label>
                  <Input id="inventory" name="inventory" type="number" defaultValue={product.inventory} />
                </div>
                <label className="flex items-center gap-2 pt-7 text-sm">
                  <input name="inStock" type="checkbox" defaultChecked={product.inStock} /> In stock
                </label>
                <label className="flex items-center gap-2 pt-7 text-sm">
                  <input name="featured" type="checkbox" defaultChecked={product.featured} /> Featured
                </label>
              </div>
              <div className="flex justify-between gap-3 pt-2">
                <Button type="submit">Save product</Button>
              </div>
            </form>

            <form action={deleteAction} className="mt-6 border-t pt-6">
              <Button type="submit" variant="destructive">
                Delete product
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                Only delete products that have not been used in orders.
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
