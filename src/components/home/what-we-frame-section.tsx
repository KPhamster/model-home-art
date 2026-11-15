import Link from "next/link";
import { CategoryTiles } from "@/components/ui/category-tiles";
import { SectionHeading } from "@/components/ui/section-heading";

const lede = "From jerseys to diplomas, fine art to family photos — we frame it all with care and precision.";

export function WhatWeFrameSection() {
  return (
    <section className="bg-sand py-20 lg:py-28">
      <div className="container-wide">
        <SectionHeading title="What We Frame" lede={lede} />
        <CategoryTiles className="mt-12" />
        <p className="reveal mt-10 text-center">
          <Link href="/what-we-frame" className="font-medium text-primary underline-offset-4 hover:underline">
            See all categories →
          </Link>
        </p>
      </div>
    </section>
  );
}
