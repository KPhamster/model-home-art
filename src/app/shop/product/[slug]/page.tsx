"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  ChevronRight, Minus, Plus, ShoppingCart, Truck, RotateCcw, Shield,
  Check
} from "lucide-react";

// Placeholder product data
const products: Record<string, {
  name: string;
  price: number;
  description: string;
  sizes: string[];
  materials: string;
  collection: string;
}> = {
  "modern-black-8x10": {
    name: "Modern Black Frame",
    price: 2499,
    description: "A sleek, contemporary frame with clean lines. Perfect for modern spaces and minimalist decor.",
    sizes: ["5×7", "8×10", "11×14", "16×20"],
    materials: "Solid wood with matte black finish, glass front, sturdy backing",
    collection: "modern",
  },
  "classic-walnut-11x14": {
    name: "Classic Walnut Frame",
    price: 3499,
    description: "A timeless traditional frame with rich walnut finish. Perfect for diplomas, certificates, and fine art.",
    sizes: ["8×10", "11×14", "16×20"],
    materials: "Solid walnut wood, UV-protective glass, acid-free backing",
    collection: "classic",
  },
  // Add more products as needed
};

const defaultProduct = {
  name: "Frame Product",
  price: 2999,
  description: "A quality ready-made frame in popular sizes. Perfect for photos, prints, and artwork.",
  sizes: ["8×10", "11×14", "16×20"],
  materials: "Solid wood frame, glass front, sturdy backing",
  collection: "modern",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const { slug } = use(params);
  const product = products[slug] || defaultProduct;
  
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} × ${product.name} (${selectedSize}) to cart`);
  };

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
            <Link
              href={`/shop/${product.collection}`}
              className="text-muted-foreground hover:text-foreground capitalize"
            >
              {product.collection.replace("-", " ")}
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product */}
      <section className="py-8 lg:py-12 bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-stone-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-32 h-32 mx-auto mb-4 border-8 border-stone-300 rounded" />
                  <p>[Main Product Image]</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-stone-100 rounded cursor-pointer hover:ring-2 ring-primary transition-all flex items-center justify-center"
                  >
                    <span className="text-xs text-muted-foreground">[{i}]</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="mb-6">
                <Badge variant="secondary" className="mb-2 capitalize">
                  {product.collection.replace("-", " ")}
                </Badge>
                <h1 className="text-3xl font-heading font-semibold mb-2">
                  {product.name}
                </h1>
                <p className="text-2xl font-semibold text-primary">
                  ${(product.price / 100).toFixed(2)}
                </p>
              </div>

              <p className="text-muted-foreground mb-6">{product.description}</p>

              {/* Size Selection */}
              <div className="mb-6">
                <Label className="text-base font-medium mb-3 block">Size</Label>
                <RadioGroup
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  className="flex flex-wrap gap-2"
                >
                  {product.sizes.map((size) => (
                    <Label
                      key={size}
                      className={`px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                        selectedSize === size
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value={size} className="sr-only" />
                      {size}
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <Label className="text-base font-medium mb-3 block">Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-3 mb-8">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-3 bg-stone-50 rounded-lg">
                  <Truck className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs">Free shipping $150+</p>
                </div>
                <div className="text-center p-3 bg-stone-50 rounded-lg">
                  <RotateCcw className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs">Easy returns</p>
                </div>
                <div className="text-center p-3 bg-stone-50 rounded-lg">
                  <Shield className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-xs">Quality guaranteed</p>
                </div>
              </div>

              {/* Product Details Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="materials">
                  <AccordionTrigger>Materials & Quality</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{product.materials}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        Free shipping on orders over $150
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        Ships within 3-5 business days
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        30-day return policy for undamaged items
                      </li>
                    </ul>
                    <div className="mt-3">
                      <Link href="/policies/shipping" className="text-primary text-sm hover:underline">
                        View full shipping policy →
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="custom">
                  <AccordionTrigger>Need a Custom Size?</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground text-sm mb-3">
                      Don't see your size? We offer custom framing for any dimensions.
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

      {/* Related Products */}
      <section className="py-12 bg-stone-50">
        <div className="container-wide">
          <h2 className="text-2xl font-heading font-semibold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="group overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-stone-100 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">[Related {i}]</span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm">Related Frame</h3>
                  <p className="text-xs text-muted-foreground">8×10</p>
                  <p className="font-semibold mt-1">$24.99</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
