"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { businessTypes } from "@/lib/config";
import { toast } from "sonner";
import {
  Building2, Users, Palette, Wrench, Truck,
  ArrowRight, Upload, X, LoaderCircle
} from "lucide-react";
import { MAX_PHOTO_BYTES, MAX_PHOTO_MB, MAX_SEND_BYTES, shrinkPhotos } from "@/lib/shrink-photo";

// How many photos the form takes. Each may be up to MAX_PHOTO_MB as picked; they are resized
// in the browser to fit what the host accepts in one submission (see lib/shrink-photo).
const MAX_PHOTOS = 5;

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

  // True while picked photos are being resized, which can take a second for large ones.
  const [preparingPhotos, setPreparingPhotos] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Clear the input so the same file can be selected again
    e.target.value = "";
    if (files.length === 0) return;
    if (files.length + images.length > MAX_PHOTOS) {
      toast.error(`Maximum ${MAX_PHOTOS} images allowed`);
      return;
    }
    if (files.some((file) => file.size > MAX_PHOTO_BYTES)) {
      toast.error(`Each photo can be up to ${MAX_PHOTO_MB} MB. For anything larger, provide a link instead.`);
      return;
    }

    setPreparingPhotos(true);
    try {
      const ready = await shrinkPhotos(files, MAX_PHOTOS);
      const newImages = [...images, ...ready].slice(0, MAX_PHOTOS);
      // Only a file that could not be resized (a type this browser cannot open) can still be too big.
      if (getTotalFileSize(newImages) > MAX_SEND_BYTES) {
        toast.error("One of those photos is in a format we can't resize here, and it is too large to send as it is. Please use JPEG or PNG files, or provide a link instead.");
        return;
      }
      setImages(newImages);
    } finally {
      setPreparingPhotos(false);
    }
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
        throw new Error("Your photos are too large to send together. Please remove one, or provide a link instead.");
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
      <PageHero
        eyebrow="Business Services"
        title="Framing for businesses in the United States"
        lede="From offices to hotels, we provide reliable, consistent, affordable framing solutions for businesses of all sizes. Volume pricing available."
      >
        <Button asChild size="lg" className="h-12 px-7 text-base">
          <a href="#request">Request Business Pricing</a>
        </Button>
      </PageHero>

      {/* Who we serve */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeading title="Who We Help" lede="We work with businesses across the United States." />

          <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {businessTypes.map((type) => (
              <li
                key={type}
                className="reveal flex items-center justify-center rounded-xl border border-primary/15 bg-sand/60 p-4 text-center"
              >
                <span className="text-sm font-medium">{type}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="bg-sand py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeading title="Business Services" />

          <ul className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2 lg:grid-cols-3">
            {businessServices.map((service) => (
              <li key={service.title} className="reveal flex gap-4 rounded-xl border border-primary/10 bg-white/70 p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary">
                  <service.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold leading-snug">{service.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{service.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeading title="Our Process" lede="A streamlined approach that saves you time and money." />

          <ol className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-4">
            {processSteps.map((step, index) => (
              <li key={step.title} className="reveal flex items-center gap-2">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-heading font-semibold leading-snug">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < processSteps.length - 1 && (
                  <ArrowRight className="hidden h-5 w-5 text-primary/50 lg:block" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Request Form */}
      <section id="request" className="scroll-mt-20 bg-sand py-16 lg:py-24">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="font-heading text-3xl font-semibold tracking-tight">
                  Request Business Pricing
                </CardTitle>
                <p className="text-muted-foreground">
                  Tell us about your project and we&apos;ll get back to you within 24 business hours.
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
                    <Label>Photos (optional)</Label>
                    
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
                    
                    {images.length < MAX_PHOTOS && preparingPhotos && (
                      <div role="status" className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <LoaderCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground animate-spin" aria-hidden="true" />
                        <p className="text-sm text-muted-foreground">Preparing your photos…</p>
                      </div>
                    )}
                    {images.length < MAX_PHOTOS && !preparingPhotos && (
                      <label className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors block">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload up to {MAX_PHOTOS} photos ({MAX_PHOTO_MB} MB each at most)
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">Large photos are resized before they are sent.</p>
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
                        To send photos at their full size, or files larger than {MAX_PHOTO_MB} MB, paste a link from Google Drive, OneDrive, Dropbox, or iCloud.
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
