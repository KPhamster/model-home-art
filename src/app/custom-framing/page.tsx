import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { framingCategories, businessConfig } from "@/lib/config";
import {
  Frame,
  Layers,
  Shield,
  Sparkles,
  Wrench,
  Image as ImageIcon,
  Check,
  ArrowRight,
  Camera,
  Palette,
  Truck,
  Shirt,
  Square,
  ScrollText,
  Image as ImageLucide,
  Scissors,
  Box,
  Plus,
} from "lucide-react";
import jerseyImage from "../../../assets/jersey_image.png";
import mirrorImage from "../../../assets/mirror_image.jpeg";
import diplomaImage from "../../../assets/diploma_image.jpeg";
import fineArtImage from "../../../assets/fine_art_image.jpg";
import posterImage from "../../../assets/poster_image.jpeg";
import photoImage from "../../../assets/photo_image.png";
import canvasStretchingImage from "../../../assets/canvas_stretching_image.png";
import needleworkImage from "../../../assets/needlework_image.png";
import memorabiliaImage from "../../../assets/memorabilia_image.png";
import medalsImage from "../../../assets/medals_image.jpeg";

export const metadata: Metadata = {
  title: "Custom Framing",
  description: "Affordable custom framing in Orange County, CA that delivers nationwide. We frame art, photos, jerseys, diplomas, mirrors & more. Budget-friendly options with expert guidance.",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shirt: Shirt,
  square: Square,
  scroll: ScrollText,
  palette: Palette,
  image: ImageLucide,
  camera: Camera,
  frame: Frame,
  scissors: Scissors,
  box: Box,
  plus: Plus,
};

const cardImages: Partial<Record<string, { src: string; alt: string }>> = {
  jerseys: { src: jerseyImage.src, alt: "Framed jersey" },
  mirrors: { src: mirrorImage.src, alt: "Framed mirror" },
  diplomas: { src: diplomaImage.src, alt: "Framed diploma and certificates" },
  "fine-art": { src: fineArtImage.src, alt: "Framed fine art" },
  posters: { src: posterImage.src, alt: "Framed posters and prints" },
  photos: { src: photoImage.src, alt: "Framed photos" },
  canvas: { src: canvasStretchingImage.src, alt: "Stretched canvas" },
  needlework: { src: needleworkImage.src, alt: "Framed needlework and textiles" },
  shadowboxes: { src: memorabiliaImage.src, alt: "Shadowbox memorabilia display" },
  medals: { src: medalsImage.src, alt: "Framed medals and awards" },
};

const framingOptions = [
  {
    title: "Frame Styles",
    description: "From sleek modern profiles to ornate traditional frames — we have thousands of options in every price range.",
    icon: Frame,
  },
  {
    title: "Matting",
    description: "Single, double, or no mat — matting adds depth and visual impact. We'll help you choose colors that complement your piece.",
    icon: Layers,
  },
  {
    title: "Glass & Glazing",
    description: "Standard glass, non-glare, UV-protective, or museum-grade. We'll recommend the right protection for your piece.",
    icon: Shield,
  },
  {
    title: "Mounting & Backing",
    description: "Proper mounting and acid-free backing protects your piece and ensures it stays beautiful for years.",
    icon: Sparkles,
  },
];

const specialtyServices = [
  {
    title: "Preservation Framing",
    description: "Museum-quality framing with archival materials to protect valuable artwork, documents, and heirlooms.",
    icon: Shield,
  },
  {
    title: "Shadow Boxes",
    description: "Display 3D items like jerseys, medals, memorabilia, and keepsakes in custom-built shadow boxes.",
    icon: Frame,
  },
  {
    title: "Canvas Stretching & Printing",
    description: "We stretch canvas artwork and can print any image on high-quality canvas.",
    icon: ImageIcon,
  },
  {
    title: "Repairs & Re-framing",
    description: "Damaged frame? Outdated style? We can repair or re-frame your existing pieces.",
    icon: Wrench,
  },
];

const processSteps = [
  {
    number: "1",
    title: "Send a photo + size",
    description: "Upload photos and dimensions. Not sure? We'll help you measure.",
    icon: Camera,
  },
  {
    number: "2",
    title: "We design options",
    description: "We'll create options that fit your style and budget.",
    icon: Palette,
  },
  {
    number: "3",
    title: "Pickup, delivery, or ship",
    description: "Pick up, schedule delivery + installation, or we'll ship it.",
    icon: Truck,
  },
];

export default function CustomFramingPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-stone-100 to-background">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-6">
              Affordable custom framing — we frame it all
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              From precious artwork to sports memorabilia, we provide expert framing at prices that won't break the bank. 
              Visit our shop or get a fast quote online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/quote">Get a Fast Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Visit the Shop</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Frame */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              We Frame It All
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No matter what you need framed, we have the expertise and materials to do it beautifully.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {framingCategories.map((category) => {
              const Icon = iconMap[category.icon] || Frame;
              const cardImage = cardImages[category.id];
              const isJersey = category.id === "jerseys";
              return (
                <Link
                  key={category.id}
                  href={`/what-we-frame#${category.id}`}
                  className={`group flex flex-col min-h-[300px] sm:min-h-[330px] lg:min-h-[360px] rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all bg-white ${
                    cardImage ? "overflow-hidden" : "items-center justify-center p-6"
                  }`}
                >
                  {cardImage ? (
                    <>
                      <div className="w-full min-h-[300px] sm:min-h-[330px] lg:min-h-[360px] bg-stone-100 overflow-hidden">
                        <img
                          src={cardImage.src}
                          alt={cardImage.alt}
                          className={isJersey ? "h-full w-full object-contain" : "h-full w-full object-cover"}
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-1 items-center justify-center p-4">
                        <span className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                          {category.name}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors overflow-hidden">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/what-we-frame"
              className="text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              See full list <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Framing Options Explained */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              Your Framing Options
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Custom framing means choices. Here's what goes into creating the perfect frame.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {framingOptions.map((option) => (
              <Card key={option.title}>
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <option.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Budget Promise */}
      <section className="py-16 lg:py-20 bg-primary text-white">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6">
              We'll design to your budget.
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Tell us your budget and we'll create options that work. No pressure, no upselling — 
              just honest guidance to help you get the best value for your money.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                <Check className="w-4 h-4 mr-2" />
                Budget-friendly options
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                <Check className="w-4 h-4 mr-2" />
                No hidden fees
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                <Check className="w-4 h-4 mr-2" />
                Transparent pricing
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Services */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              Specialty Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Beyond standard framing, we offer specialized services for unique needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {specialtyServices.map((service) => (
              <Card key={service.title}>
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {processSteps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6">
              Ready to get started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get a fast quote online or visit our Orange County, CA shop for a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/quote">Get a Fast Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Visit the Shop</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {businessConfig.address.full} • {businessConfig.hours.display}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
