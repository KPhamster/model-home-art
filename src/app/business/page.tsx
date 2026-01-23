"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { businessTypes } from "@/lib/config";
import { toast } from "sonner";
import {
  Building2, Users, Palette, Wrench, Truck, FileText,
  Check, ArrowRight, Upload
} from "lucide-react";

const businessServices = [
  {
    title: "Bulk & Volume Orders",
    description: "Special pricing for large orders and ongoing projects.",
    icon: Building2,
  },
  {
    title: "Consistent Styling",
    description: "Standardized frame styles across all your pieces for a cohesive look.",
    icon: Palette,
  },
  {
    title: "Canvas Printing",
    description: "Print any image on canvas for a modern, frameless option.",
    icon: Users,
  },
  {
    title: "Repairs & Maintenance",
    description: "Ongoing maintenance and repair services for your framed pieces.",
    icon: Wrench,
  },
  {
    title: "Delivery & Installation",
    description: "We deliver and professionally install — even for large projects.",
    icon: Truck,
  },
  {
    title: "Net-30 Invoicing",
    description: "Flexible payment terms for established business accounts.",
    icon: FileText,
  },
];

const processSteps = [
  { title: "Consult", description: "Discuss your project needs and timeline" },
  { title: "Options", description: "We present framing options within your budget" },
  { title: "Production", description: "We craft your frames with care" },
  { title: "Delivery & Install", description: "Professional delivery and installation" },
  { title: "Repeat", description: "A repeatable system for future projects" },
];

export default function BusinessPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      businessName: formData.get('businessName'),
      contactName: formData.get('contactName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      projectDescription: formData.get('projectDescription'),
      sizesInfo: formData.get('sizesInfo'),
      timeline: formData.get('timeline'),
      deliveryNeeds: formData.get('deliveryNeeds'),
      invoicing: formData.get('invoicing') === 'on',
    };

    try {
      const response = await fetch('/api/business-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit inquiry');
      }

      toast.success("Request submitted! We'll be in touch within 24 business hours.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Business inquiry error:', error);
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-stone-100 to-background">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Business Services</Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold mb-6">
              Framing for businesses in Orange County
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              From offices to hotels, we provide reliable, consistent, affordable framing solutions for businesses of all sizes. Volume pricing and net-30 terms available.
            </p>
            <Button asChild size="lg">
              <a href="#request">Request Business Pricing</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              Who We Help
            </h2>
            <p className="text-lg text-muted-foreground">
              We work with businesses across Orange County and beyond.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {businessTypes.map((type) => (
              <div
                key={type}
                className="p-4 bg-stone-50 rounded-lg text-center border border-border"
              >
                <span className="text-sm font-medium">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-20 bg-stone-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              Business Services
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {businessServices.map((service) => (
              <Card key={service.title}>
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              Our Process
            </h2>
            <p className="text-lg text-muted-foreground">
              A streamlined approach that saves you time and money.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={step.title} className="flex items-center gap-2">
                <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg border border-border">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < processSteps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section id="request" className="py-16 lg:py-20 bg-stone-50 scroll-mt-20">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-heading">
                  Request Business Pricing
                </CardTitle>
                <p className="text-muted-foreground">
                  Tell us about your project and we'll get back to you within 24 business hours.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input id="businessName" name="businessName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input id="contactName" name="contactName" required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" type="tel" />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2">
                    <Label htmlFor="projectDescription">Project Description *</Label>
                    <Textarea
                      id="projectDescription"
                      name="projectDescription"
                      placeholder="Describe your framing needs, number of pieces, etc."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sizesInfo">Sizes / Quantities</Label>
                    <Textarea
                      id="sizesInfo"
                      name="sizesInfo"
                      placeholder="List sizes and quantities if known"
                      rows={2}
                    />
                  </div>

                  {/* File Upload Placeholder */}
                  <div className="space-y-2">
                    <Label>Photos (optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop photos or click to upload
                      </p>
                      <input type="file" className="hidden" multiple accept="image/*" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Timeline</Label>
                      <Input
                        id="timeline"
                        name="timeline"
                        placeholder="e.g., 3 weeks, ASAP, flexible"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryNeeds">Delivery/Install Needs</Label>
                      <Input
                        id="deliveryNeeds"
                        name="deliveryNeeds"
                        placeholder="e.g., delivery to downtown office"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id="invoicing" name="invoicing" />
                    <Label htmlFor="invoicing" className="text-sm font-normal">
                      I'm interested in Net-30 invoicing
                    </Label>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Request Business Pricing"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
