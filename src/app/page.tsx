import { HeroSection } from "@/components/home/hero-section";
import { VisitUsSection } from "@/components/home/visit-us-section";
import { WhatWeFrameSection } from "@/components/home/what-we-frame-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { ServicesSection } from "@/components/home/services-section";
import { ShopPreviewSection } from "@/components/home/shop-preview-section";
import { BusinessSection } from "@/components/home/business-section";
import { ReviewsSection } from "@/components/home/reviews-section";
import { FAQSection } from "@/components/home/faq-section";
import { FinalCTASection } from "@/components/home/final-cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <VisitUsSection />
      <WhatWeFrameSection />
      <HowItWorksSection />
      <ServicesSection />
      <ShopPreviewSection />
      <BusinessSection />
      <ReviewsSection />
      <FAQSection />
      <FinalCTASection />
    </>
  );
}
