import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import businessImage from "../../../assets/business_image.png";

const benefits = [
  "Volume pricing for bulk orders",
  "Consistent frame styles across projects",
  "Delivery and professional installation",
];

export function BusinessSection() {
  return (
    <section className="py-16 lg:py-20 bg-stone-50">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6">
              Framing for businesses —{" "}
              <span className="text-primary">reliable, consistent, affordable.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We work with offices, interior designers, hotels, medical facilities, and more. 
              Whether you need 5 frames or 500, we deliver consistent quality on time and on budget.
            </p>
            
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Button asChild size="lg">
              <Link href="/business#request">Request Business Pricing</Link>
            </Button>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-stone-200 border border-border overflow-hidden">
              <img
                src={businessImage.src}
                alt="Business installation with framed artwork"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
