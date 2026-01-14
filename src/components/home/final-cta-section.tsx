import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  return (
    <section className="py-16 lg:py-24 bg-primary text-white">
      <div className="container-wide text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold mb-6">
          Ready to get your piece framed?
        </h2>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Send us photos and we'll provide options that fit your style and budget. 
          No pressure, no surprises.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-base bg-white text-primary hover:bg-white/90"
          >
            <Link href="/quote">Get a Fast Quote</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-base border-white text-white hover:bg-white/10"
          >
            <Link href="/contact">Visit Our Shop</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
