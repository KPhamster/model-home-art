import Link from "next/link";
import { Button } from "@/components/ui/button";
import callToActionImage from "../../../assets/calltoaction_image.jpg";

export function FinalCTASection() {
  return (
    <section className="relative py-16 lg:py-24 text-white overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={callToActionImage.src}
          alt="Custom framed art in a warm home setting"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative container-wide text-center">
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
            className="text-base bg-primary text-white hover:bg-white hover:text-primary"
          >
            <Link href="/quote">Get a Fast Quote</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-base bg-white text-primary hover:bg-primary hover:text-white"
          >
            <Link href="/contact">Visit Our Shop</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
