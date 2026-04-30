"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Minus, Plus, ShoppingCart } from "lucide-react";

export function PurchaseControls({ productName, sizes }: { productName: string; sizes: string[] }) {
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "Standard");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} × ${productName} (${selectedSize}) to cart`);
  };

  return (
    <>
      <div className="mb-6">
        <Label className="text-base font-medium mb-3 block">Size</Label>
        <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
          {(sizes.length ? sizes : ["Standard"]).map((size) => (
            <Label
              key={size}
              className={`px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                selectedSize === size ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <RadioGroupItem value={size} className="sr-only" />
              {size}
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="mb-6">
        <Label className="text-base font-medium mb-3 block">Quantity</Label>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <Button size="lg" className="flex-1" onClick={handleAddToCart}>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
      </div>
    </>
  );
}
