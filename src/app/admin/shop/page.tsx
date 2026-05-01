import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeferredImageField } from "@/components/admin/deferred-image-field";
import { NameSlugFields } from "@/components/admin/name-slug-fields";
import { ProductImageSizeFields } from "@/components/admin/product-image-size-fields";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/db";
import { createCollection, createProduct } from "./actions";
import { Package, Plus, Tags } from "lucide-react";

export const dynamic = "force-dynamic";

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function AdminShopPage() {
  const [collections, products] = await Promise.all([
    prisma.collection.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
    prisma.product.findMany({
      include: { collection: true },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    }),
  ]);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b">
        <div className="container-wide py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-semibold">Shop Admin</h1>
            <p className="text-sm text-muted-foreground">
              Populate collections and ready-to-ship art products.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin">Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/shop">View Shop</Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="container-wide py-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="text-3xl font-semibold">{products.length}</p>
              </div>
              <Package className="h-9 w-9 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collections</p>
                <p className="text-3xl font-semibold">{collections.length}</p>
              </div>
              <Tags className="h-9 w-9 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Featured</p>
              <p className="text-3xl font-semibold">
                {products.filter((product) => product.featured).length}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" /> Add Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createProduct} className="grid gap-4">
                <NameSlugFields
                  nameId="product-name"
                  slugId="product-slug"
                  namePlaceholder="Coastal Abstract No. 1"
                  slugPlaceholder="coastal-abstract-no-1"
                />
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="product-price">Price</Label>
                    <Input id="product-price" name="price" placeholder="129.00" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-compare-price">Compare at</Label>
                    <Input id="product-compare-price" name="comparePrice" placeholder="159.00" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product-collection">Collection</Label>
                  <select
                    id="product-collection"
                    name="collectionId"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    defaultValue=""
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
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea id="product-description" name="description" rows={3} />
                </div>
                <ProductImageSizeFields
                  imageId="product-images"
                  imageName="images"
                  sizeId="product-size"
                  sizeName="sizes"
                />
                <div className="grid gap-2">
                  <Label htmlFor="product-materials">Materials</Label>
                  <Textarea id="product-materials" name="materials" rows={2} />
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="product-inventory">Inventory</Label>
                    <Input id="product-inventory" name="inventory" type="number" defaultValue="1" />
                  </div>
                  <label className="flex items-center gap-2 pt-7 text-sm">
                    <input name="inStock" type="checkbox" defaultChecked /> In stock
                  </label>
                  <label className="flex items-center gap-2 pt-7 text-sm">
                    <input name="featured" type="checkbox" /> Featured
                  </label>
                </div>
                <Button type="submit">Create product</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" /> Add Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createCollection} className="grid gap-4">
                <NameSlugFields
                  nameId="collection-name"
                  slugId="collection-slug"
                  namePlaceholder="Coastal Art"
                  slugPlaceholder="coastal-art"
                />
                <div className="grid gap-2">
                  <Label htmlFor="collection-description">Description</Label>
                  <Textarea id="collection-description" name="description" rows={3} />
                </div>
                <DeferredImageField
                  id="collection-image"
                  fileName="collectionImageFiles"
                  valueName="image"
                  label="Collection images"
                  multiple
                  helperText="Images stay local until you create the collection. The first image is used as the cover."
                  placeholder="One URL per line, or choose files above"
                />
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="collection-order">Sort order</Label>
                    <Input id="collection-order" name="order" type="number" defaultValue="0" />
                  </div>
                  <label className="flex items-center gap-2 pt-7 text-sm">
                    <input name="featured" type="checkbox" /> Featured
                  </label>
                </div>
                <Button type="submit">Create collection</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">/{product.slug}</div>
                    </TableCell>
                    <TableCell>{product.collection?.name ?? "—"}</TableCell>
                    <TableCell>{formatMoney(product.price)}</TableCell>
                    <TableCell>{product.inventory}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {product.inStock ? <Badge>In stock</Badge> : <Badge variant="secondary">Hidden</Badge>}
                        {product.featured ? <Badge variant="outline">Featured</Badge> : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/shop/products/${product.id}`}>Edit</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {products.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No products yet.</p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Collection</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>
                      <div className="font-medium">{collection.name}</div>
                      <div className="text-xs text-muted-foreground">/{collection.slug}</div>
                    </TableCell>
                    <TableCell>{collection._count.products}</TableCell>
                    <TableCell>{collection.order}</TableCell>
                    <TableCell>{collection.featured ? <Badge>Featured</Badge> : <Badge variant="secondary">Standard</Badge>}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/shop/collections/${collection.id}`}>Edit</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
