import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const benefits = [
  "Volume pricing for bulk orders",
  "Consistent frame styles across projects",
  "Net-30 invoicing available",
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

          {/* Image Placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-stone-200 border border-border overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-stone-300 rounded-lg flex items-center justify-center">
                    <svg className="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="font-medium">[BUSINESS INSTALLATION IMAGE]</p>
                  <p className="text-sm mt-1">Office or hotel installation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
