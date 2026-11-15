"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/ui/page-hero";
import { Textarea } from "@/components/ui/textarea";
import { businessConfig } from "@/lib/config";
import { toast } from "sonner";
import { Check, ExternalLink } from "lucide-react";

// One row of the shop details list: a small label beside its value.
const infoRow = "grid gap-1 py-4 sm:grid-cols-[6rem_1fr] sm:gap-6";
const infoLabel = "text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground sm:pt-1";

const whatToBring = [
  "The item you want framed",
  "Measurements (if you have them)",
  "Inspiration photos (optional)",
  "Your budget in mind",
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      toast.success("Message sent! We'll be in touch soon.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        title="Contact Us"
        lede="Have a question? Want to discuss a project? Stop by the shop or reach out below."
      />

      {/* Contact info and form */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container-wide">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
            {/* Contact info */}
            <div className="flex h-full flex-col">
              <span aria-hidden="true" className="mb-5 block h-0.5 w-10 rounded-full bg-primary" />
              <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Visit Our Shop</h2>

              <dl className="mt-6 divide-y divide-border border-y border-border">
                <div className={infoRow}>
                  <dt className={infoLabel}>Address</dt>
                  <dd>
                    <p className="font-medium">{businessConfig.address.street}</p>
                    <p className="text-muted-foreground">
                      {businessConfig.address.city}, {businessConfig.address.state} {businessConfig.address.zip}
                    </p>
                  </dd>
                </div>
                <div className={infoRow}>
                  <dt className={infoLabel}>Hours</dt>
                  <dd>
                    {businessConfig.hours.structured.map((item, i) => (
                      <p key={i} className={item.hours === "Closed" ? "text-muted-foreground" : ""}>
                        <span className="font-medium">{item.days}:</span> {item.hours}
                      </p>
                    ))}
                  </dd>
                </div>
                <div className={infoRow}>
                  <dt className={infoLabel}>Phone</dt>
                  <dd>
                    <a href={`tel:${businessConfig.phone}`} className="font-medium transition-colors hover:text-primary">
                      {businessConfig.phone}
                    </a>
                  </dd>
                </div>
                <div className={infoRow}>
                  <dt className={infoLabel}>Email</dt>
                  <dd>
                    <a
                      href={`mailto:${businessConfig.email}`}
                      className="break-all font-medium transition-colors hover:text-primary"
                    >
                      {businessConfig.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <Button asChild size="lg" className="mt-6 h-12 w-full text-base">
                <a href={businessConfig.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Get Directions
                </a>
              </Button>

              {/* Map embed */}
              <div className="my-8 aspect-square min-h-[250px] overflow-hidden rounded-xl border border-border md:aspect-auto md:flex-1">
                <iframe
                  src={businessConfig.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "250px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Model Home Art Location"
                />
              </div>

              {/* What to bring */}
              <div className="rounded-xl border border-primary/15 bg-sand/60 p-6">
                <h3 className="font-heading text-lg font-semibold">What to Bring</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Coming in for a consultation? Here&apos;s what to have ready:
                </p>
                <ul className="mt-4 space-y-2">
                  {whatToBring.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <span aria-hidden="true" className="mb-5 block h-0.5 w-10 rounded-full bg-primary" />
              <h2 className="mb-6 font-heading text-2xl font-semibold tracking-tight md:text-3xl">Send a Message</h2>
              
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" type="tel" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="How can we help?"
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Quick Quote CTA */}
              <div className="mt-6 rounded-xl border border-primary/15 bg-sand/60 p-6 text-center">
                <p className="mb-2 font-heading text-lg font-semibold">Need a framing quote?</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Use our quote form for faster response with photos.
                </p>
                <Button asChild>
                  <Link href="/quote">Get a Fast Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
