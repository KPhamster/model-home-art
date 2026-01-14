import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { businessConfig } from "@/lib/config";
import {
  Heart, DollarSign, Palette, Award, MapPin, Truck, Users
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: `${businessConfig.name} is a local framing shop in Orange County, CA. We offer budget-friendly custom framing with expert guidance, delivery, and installation.`,
};

const whyUsReasons = [
  {
    title: "Expert Guidance",
    description: "Our team will help you choose the perfect frame, matting, and glass — no design degree required.",
    icon: Palette,
  },
  {
    title: "Affordable Pricing",
    description: "We offer options for every budget. Tell us your range and we'll make it work.",
    icon: DollarSign,
  },
  {
    title: "Wide Selection",
    description: "Thousands of frame styles, from sleek modern profiles to ornate traditional frames.",
    icon: Award,
  },
  {
    title: "Quality Craftsmanship",
    description: "Every frame is assembled with care, using quality materials that will last.",
    icon: Heart,
  },
];

const serviceHighlights = [
  {
    title: "Local Shop",
    description: "Visit us in Orange County for hands-on help and to see samples in person.",
    icon: MapPin,
  },
  {
    title: "Delivery & Install",
    description: "We deliver throughout Orange County and professionally hang your pieces.",
    icon: Truck,
  },
  {
    title: "Business Services",
    description: "Volume pricing and dedicated service for offices, hotels, and designers.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-stone-100 to-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-6">
                Framing your memories, beautifully and affordably.
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {businessConfig.name} is a local framing shop serving Orange County, CA. 
                We believe custom framing shouldn't cost a fortune, and we're here to prove it.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Whether it's a treasured family photo, a signed jersey, or art for your office walls — 
                we'll help you display it beautifully without breaking the bank.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/quote">Get a Quote</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Visit Us</Link>
                </Button>
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-stone-200 border border-border overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-stone-300 rounded-full flex items-center justify-center">
                      <Users className="w-10 h-10 text-stone-400" />
                    </div>
                    <p className="font-medium">[TEAM OR SHOP PHOTO]</p>
                    <p className="text-sm mt-1">Our team or storefront</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6 text-center">
              Our Story
            </h2>
            <div className="prose-custom text-muted-foreground">
              <p>
                We started {businessConfig.name} with a simple mission: make custom framing 
                accessible to everyone. We noticed that many framing shops felt intimidating, 
                with high prices and confusing options. We wanted to change that.
              </p>
              <p>
                Our approach is different. We listen to your needs, understand your budget, 
                and guide you to the best options. Whether you're framing your first piece 
                or your fiftieth, we treat every project with the same care and attention.
              </p>
              <p>
                Located in Orange County, CA, we serve customers throughout Southern California. 
                From our local shop, we offer custom framing, ready-made frames, canvas printing, 
                repairs, and professional delivery and installation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-muted-foreground">
              Here's what sets us apart from the rest.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {whyUsReasons.map((reason) => (
              <Card key={reason.title}>
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <reason.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{reason.title}</h3>
                    <p className="text-sm text-muted-foreground">{reason.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              How We Serve You
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {serviceHighlights.map((highlight) => (
              <div key={highlight.title} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <highlight.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{highlight.title}</h3>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6">
              Serving Orange County and Beyond
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Our shop is located in Orange County, California. We serve customers throughout 
              Southern California with local delivery and professional installation. We also 
              ship ready-made frames and completed custom orders nationwide.
            </p>
            <p className="text-muted-foreground">
              <strong>Shop Address:</strong> {businessConfig.address.full}<br />
              <strong>Hours:</strong> {businessConfig.hours.display}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-primary text-white">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Get a fast quote online or visit our shop for a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
            >
              <Link href="/quote">Get a Fast Quote</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="/contact">Visit Our Shop</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
