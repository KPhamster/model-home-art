import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingCTA } from "@/components/layout/floating-cta";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Toaster } from "@/components/ui/sonner";
import { businessConfig } from "@/lib/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: businessConfig.seo.title,
    template: `%s | ${businessConfig.name}`,
  },
  description: businessConfig.seo.description,
  keywords: businessConfig.seo.keywords,
  authors: [{ name: businessConfig.name }],
  creator: businessConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: businessConfig.name,
    title: businessConfig.seo.title,
    description: businessConfig.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: businessConfig.seo.title,
    description: businessConfig.seo.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD structured data for local business
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: businessConfig.name,
  description: businessConfig.seo.description,
  url: "https://modelhomeart.com",
  telephone: businessConfig.phone,
  email: businessConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: businessConfig.address.street,
    addressLocality: businessConfig.address.city,
    addressRegion: businessConfig.address.state,
    postalCode: businessConfig.address.zip,
    addressCountry: "US",
  },
  areaServed: {
    "@type": "Place",
    name: businessConfig.serviceArea,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "16:00",
    },
  ],
  priceRange: "$$",
  image: "/og-image.jpg",
  sameAs: [
    businessConfig.social.instagram,
    businessConfig.social.facebook,
    businessConfig.social.yelp,
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingCTA />
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}
