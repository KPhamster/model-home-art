"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { businessTypes } from "@/lib/config";
import { toast } from "sonner";
import {
  Building2, Users, Palette, Wrench, Truck,
  Check, ArrowRight, Upload, X
} from "lucide-react";

// Maximum total upload size: 4MB (Vercel serverless function limit is 4.5MB)
const MAX_UPLOAD_SIZE_MB = 4;
const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

// Helper to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return mb < 0.1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
};

// Helper to calculate total size of files
const getTotalFileSize = (files: File[]): number => {
  return files.reduce((total, file) => total + file.size, 0);
};

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
  const [images, setImages] = useState<File[]>([]);
  const [imageLink, setImageLink] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    
    const newImages = [...images, ...files].slice(0, 5);
    const totalSize = getTotalFileSize(newImages);
    
    if (totalSize > MAX_UPLOAD_SIZE_BYTES) {
      toast.error(`Total upload size exceeds ${MAX_UPLOAD_SIZE_MB}MB limit. Please use smaller images or provide a link.`);
      return;
    }
    
    setImages(newImages);
    // Clear the input so the same file can be selected again
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formDataEl = new FormData(e.currentTarget);
    
    try {
      // Use FormData to send files as binary
      const submitFormData = new FormData();
      
      const formFields = {
        businessName: formDataEl.get('businessName'),
        contactName: formDataEl.get('contactName'),
        email: formDataEl.get('email'),
        phone: formDataEl.get('phone'),
        projectDescription: formDataEl.get('projectDescription'),
        sizesInfo: formDataEl.get('sizesInfo'),
        timeline: formDataEl.get('timeline'),
        deliveryNeeds: formDataEl.get('deliveryNeeds'),
        invoicing: formDataEl.get('invoicing') === 'on',
        imageLink: imageLink,
      };
      
      submitFormData.append('formData', JSON.stringify(formFields));
      
      // Add images as binary files
      images.forEach((file, index) => {
        submitFormData.append(`image${index}`, file);
      });

      const response = await fetch('/api/business-inquiry', {
        method: 'POST',
        body: submitFormData,
      });

      if (response.status === 413) {
        throw new Error(`Your photos exceed the ${MAX_UPLOAD_SIZE_MB}MB limit. Please use smaller images or provide a link instead.`);
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit inquiry');
      }

      toast.success("Request submitted! We'll be in touch within 24 business hours.");
      (e.target as HTMLFormElement).reset();
      setImages([]);
      setImageLink("");
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
              Framing for businesses in the United States
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              From offices to hotels, we provide reliable, consistent, affordable framing solutions for businesses of all sizes. Volume pricing available.
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
              We work with businesses across the United States.
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

                  {/* Photo Upload */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Photos (optional)</Label>
                      {images.length > 0 && (
                        <span className={`text-xs font-medium ${
                          getTotalFileSize(images) > MAX_UPLOAD_SIZE_BYTES * 0.9
                            ? "text-amber-600"
                            : "text-muted-foreground"
                        }`}>
                          {formatFileSize(getTotalFileSize(images))} / {MAX_UPLOAD_SIZE_MB} MB
                        </span>
                      )}
                    </div>
                    
                    {/* Image previews */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-5 gap-2">
                        {images.map((file, index) => (
                          <div
                            key={index}
                            className="relative aspect-square bg-stone-100 rounded-lg overflow-hidden group"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 text-center">
                              {formatFileSize(file.size)}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-0.5 bg-white rounded-full shadow"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {images.length < 5 && (
                      <label className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors block">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload photos (max {MAX_UPLOAD_SIZE_MB} MB total)
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={images.length >= 5}
                        />
                      </label>
                    )}

                    {/* OR divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">Or</span>
                      </div>
                    </div>

                    {/* Image Link */}
                    <div className="space-y-2">
                      <Label htmlFor="imageLink">Link to Photos (for larger files)</Label>
                      <Input
                        id="imageLink"
                        type="url"
                        value={imageLink}
                        onChange={(e) => setImageLink(e.target.value)}
                        placeholder="https://drive.google.com/... or https://onedrive.com/..."
                        disabled={images.length > 0}
                      />
                      <p className="text-xs text-muted-foreground">
                        For high-resolution photos or files larger than {MAX_UPLOAD_SIZE_MB} MB, paste a link from Google Drive, OneDrive, Dropbox, or iCloud.
                      </p>
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
