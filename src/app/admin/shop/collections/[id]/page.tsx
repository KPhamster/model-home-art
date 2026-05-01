import Link from "next/link";
import { notFound } from "next/navigation";
import { DeferredImageField } from "@/components/admin/deferred-image-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/db";
import { deleteCollection, updateCollection } from "../../actions";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCollectionPage({ params }: PageProps) {
  const { id } = await params;
  const collection = await prisma.collection.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!collection) notFound();

  const updateAction = updateCollection.bind(null, collection.id);
  const deleteAction = deleteCollection.bind(null, collection.id);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b">
        <div className="container-wide py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-semibold">Edit Collection</h1>
            <p className="text-sm text-muted-foreground">
              {collection.name} · {collection._count.products} products
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/shop">Back to Shop Admin</Link>
          </Button>
        </div>
      </div>

      <main className="container-wide py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Collection details</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateAction} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={collection.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" defaultValue={collection.slug} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={4} defaultValue={collection.description ?? ""} />
              </div>
              <DeferredImageField
                id="image"
                fileName="collectionImageFiles"
                valueName="image"
                label="Collection images"
                defaultValue={collection.image ?? ""}
                multiple
                helperText="Images stay local until you save the collection. The first image is used as the cover."
                placeholder="One URL per line, or choose files above"
              />
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="order">Sort order</Label>
                  <Input id="order" name="order" type="number" defaultValue={collection.order} />
                </div>
                <label className="flex items-center gap-2 pt-7 text-sm">
                  <input name="featured" type="checkbox" defaultChecked={collection.featured} /> Featured
                </label>
              </div>
              <Button type="submit">Save collection</Button>
            </form>

            <form action={deleteAction} className="mt-6 border-t pt-6">
              <Button type="submit" variant="destructive" disabled={collection._count.products > 0}>
                Delete collection
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                Collections can only be deleted after moving or deleting their products.
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
