import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/ui/cta-banner";
import { onDarkOutline } from "@/components/ui/page-hero";
import { cn } from "@/lib/utils";

const lede = "Send us photos and we'll provide options that fit your style and budget. No pressure, no surprises.";

export function FinalCTASection() {
  return (
    <CtaBanner
      title={
        <>
          Ready to get your piece <span className="italic text-[#e3cdb2]">framed?</span>
        </>
      }
      lede={lede}
    >
      <Button asChild size="lg" className="h-12 px-7 text-base">
        <Link href="/quote">Get a Fast Quote</Link>
      </Button>
      <Button asChild size="lg" variant="outline" className={cn("h-12 px-7 text-base", onDarkOutline)}>
        <Link href="/contact">Visit Our Shop</Link>
      </Button>
    </CtaBanner>
  );
}
