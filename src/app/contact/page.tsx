"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { businessConfig } from "@/lib/config";
import { toast } from "sonner";
import {
  MapPin, Phone, Mail, Clock, ExternalLink, Check
} from "lucide-react";

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
    
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Message sent! We'll be in touch soon.");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-stone-100 to-background">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground">
              Have a question? Want to discuss a project? Stop by the shop or reach out below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-heading font-semibold mb-6">
                Visit Our Shop
              </h2>
              
              <Card className="mb-6">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{businessConfig.address.street}</p>
                      <p className="text-muted-foreground">
                        {businessConfig.address.city}, {businessConfig.address.state} {businessConfig.address.zip}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      {businessConfig.hours.structured.map((item, i) => (
                        <p key={i} className={item.hours === "Closed" ? "text-muted-foreground" : ""}>
                          <span className="font-medium">{item.days}:</span> {item.hours}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <a 
                      href={`tel:${businessConfig.phone}`} 
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {businessConfig.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                    <a 
                      href={`mailto:${businessConfig.email}`} 
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {businessConfig.email}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Button asChild className="w-full mb-8">
                <a href={businessConfig.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get Directions
                </a>
              </Button>

              {/* Map Placeholder */}
              <div className="aspect-video rounded-lg bg-stone-200 border border-border overflow-hidden mb-8">
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center p-4">
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-stone-400" />
                    <p className="font-medium">[GOOGLE MAP EMBED]</p>
                    <p className="text-sm">Store location</p>
                  </div>
                </div>
              </div>

              {/* What to Bring */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What to Bring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Coming in for a consultation? Here's what to have ready:
                  </p>
                  <ul className="space-y-2">
                    {whatToBring.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-heading font-semibold mb-6">
                Send a Message
              </h2>
              
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
              <div className="mt-6 p-6 bg-primary/5 rounded-lg border border-primary/20 text-center">
                <p className="font-medium mb-2">Need a framing quote?</p>
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
