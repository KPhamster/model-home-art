import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Truck } from "lucide-react";

const trustChips = [
  { icon: CheckCircle, label: "Budget-friendly options" },
  { icon: Shield, label: "Preservation & repair" },
  { icon: Truck, label: "Delivery/Shipping/Install" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-100 to-background">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      
      <div className="container-wide py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold tracking-tight text-foreground mb-6">
              Custom framing that looks high-end —{" "}
              <span className="text-primary">without the high-end price.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              We frame just about anything: art, photos, jerseys, diplomas, mirrors, and memorabilia. 
              Visit our Orange County shop or get a fast quote online. We deliver, ship, and install.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button asChild size="lg" className="text-base">
                <Link href="/quote">Get a Fast Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/shop">Shop Ready-Made Frames</Link>
              </Button>
            </div>
            
            {/* Tertiary link */}
            <div className="mb-8">
              <a 
                href="#visit-us" 
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
              >
                Visit the Store →
              </a>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {trustChips.map((chip) => (
                <Badge
                  key={chip.label}
                  variant="secondary"
                  className="px-4 py-2 text-sm font-normal"
                >
                  <chip.icon className="h-4 w-4 mr-2 text-primary" />
                  {chip.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-stone-200 border border-border overflow-hidden shadow-2xl">
              {/* Placeholder for hero lifestyle image */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-stone-300 flex items-center justify-center">
                    <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="font-medium">[HERO LIFESTYLE IMAGE]</p>
                  <p className="text-sm mt-1">Beautiful framed pieces in a home setting</p>
                </div>
              </div>
            </div>
            
            {/* Floating accent element */}
            <div className="absolute -bottom-4 -left-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm font-medium">Orange County's favorite framing shop</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
