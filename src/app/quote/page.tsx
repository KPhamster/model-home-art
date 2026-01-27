"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { quoteOptions, businessConfig } from "@/lib/config";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, Upload, X, Check, Camera,
  Ruler, Palette, Clock, User, CheckCircle
} from "lucide-react";

const steps = [
  { id: 1, name: "Item", icon: Camera },
  { id: 2, name: "Size", icon: Ruler },
  { id: 3, name: "Style", icon: Palette },
  { id: 4, name: "Service", icon: Clock },
  { id: 5, name: "Contact", icon: User },
];

interface FormData {
  // Step 1
  category: string;
  description: string;
  // Step 2
  width: string;
  height: string;
  notSureSize: boolean;
  images: File[];
  repairsNeeded: boolean;
  repairNotes: string;
  // Step 3
  stylePreference: string;
  matting: string;
  protection: string;
  budgetRange: string;
  // Step 4
  timeline: string;
  services: string[];
  zipCode: string;
  // Step 5
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
}

export default function QuotePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    category: "",
    description: "",
    width: "",
    height: "",
    notSureSize: false,
    images: [],
    repairsNeeded: false,
    repairNotes: "",
    stylePreference: "",
    matting: "",
    protection: "",
    budgetRange: "",
    timeline: "",
    services: [],
    zipCode: "",
    name: "",
    email: "",
    phone: "",
    preferredContact: "",
  });

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 3),
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.category) {
          toast.error("Please select a category");
          return false;
        }
        return true;
      case 2:
        if (formData.images.length === 0) {
          toast.error("Please upload at least one photo");
          return false;
        }
        return true;
      case 3:
        return true;
      case 4:
        if (
          (formData.services.includes("delivery") ||
            formData.services.includes("installation")) &&
          !formData.zipCode
        ) {
          toast.error("Please enter your zip code for delivery/installation");
          return false;
        }
        return true;
      case 5:
        if (!formData.name || !formData.email) {
          toast.error("Please fill in required fields");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      // Convert images to base64 for submission
      const imageBase64s = await Promise.all(
        formData.images.map((file) => fileToBase64(file))
      );

      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: imageBase64s,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit quote request');
      }

      setIsComplete(true);
      toast.success("Quote request submitted!");
    } catch (error) {
      console.error('Quote submission error:', error);
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / 5) * 100;

  // Confirmation Screen
  if (isComplete) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-16">
        <div className="container-wide max-w-xl">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-heading font-semibold mb-4">
                Thanks — we got your request!
              </h1>
              <p className="text-muted-foreground mb-6">
                We'll follow up within <strong>{businessConfig.responseTime}</strong> with 
                options aligned to your budget and timeline.
              </p>
              <div className="p-4 bg-stone-50 rounded-lg mb-6 text-sm">
                <p className="font-medium mb-1">Visit us anytime:</p>
                <p className="text-muted-foreground">{businessConfig.address.full}</p>
                <p className="text-muted-foreground">{businessConfig.hours.display}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link href="/">Back to Home</Link>
                </Button>
                <Button asChild>
                  <Link href="/shop">Shop Framed Art</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12 bg-stone-50 min-h-[calc(100vh-200px)]">
      <div className="container-wide max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-2">
            Get a Fast Quote
          </h1>
          <p className="text-muted-foreground">
            Tell us about your project and we'll provide options that fit your budget.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id === currentStep
                    ? "text-primary"
                    : step.id < currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                    step.id === currentStep
                      ? "bg-primary text-white"
                      : step.id < currentStep
                      ? "bg-primary/20 text-primary"
                      : "bg-stone-200"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs hidden sm:block">{step.name}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card>
          <CardContent className="p-6 md:p-8">
            {/* Step 1: Category & Description */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">What are you framing?</h2>
                  <p className="text-sm text-muted-foreground">
                    Select the category that best describes your item.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => updateField("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {quoteOptions.categories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Tell us more (optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Any details about your item — artist, occasion, special requirements..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Size & Photos */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Size & Photos</h2>
                  <p className="text-sm text-muted-foreground">
                    Upload photos of your item and provide dimensions if known.
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>Photos *</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {formData.images.map((file, index) => (
                      <div
                        key={index}
                        className="relative aspect-square bg-stone-100 rounded-lg overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {formData.images.length < 3 && (
                      <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                        <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">Add Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload 1-3 photos of your item. Required for accurate quotes.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (inches)</Label>
                    <Input
                      id="width"
                      type="text"
                      value={formData.width}
                      onChange={(e) => updateField("width", e.target.value)}
                      placeholder="e.g., 16"
                      disabled={formData.notSureSize}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (inches)</Label>
                    <Input
                      id="height"
                      type="text"
                      value={formData.height}
                      onChange={(e) => updateField("height", e.target.value)}
                      placeholder="e.g., 20"
                      disabled={formData.notSureSize}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="notSureSize"
                    checked={formData.notSureSize}
                    onCheckedChange={(checked) =>
                      updateField("notSureSize", checked as boolean)
                    }
                  />
                  <Label htmlFor="notSureSize" className="text-sm font-normal">
                    Not sure — help me measure
                  </Label>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <Checkbox
                      id="repairsNeeded"
                      checked={formData.repairsNeeded}
                      onCheckedChange={(checked) =>
                        updateField("repairsNeeded", checked as boolean)
                      }
                    />
                    <Label htmlFor="repairsNeeded" className="text-sm font-normal">
                      This item needs repairs
                    </Label>
                  </div>
                  {formData.repairsNeeded && (
                    <Textarea
                      value={formData.repairNotes}
                      onChange={(e) => updateField("repairNotes", e.target.value)}
                      placeholder="Describe the repairs needed..."
                      rows={2}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Style & Budget */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Style & Budget</h2>
                  <p className="text-sm text-muted-foreground">
                    Help us understand your preferences. Not sure? That's okay!
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Frame Style</Label>
                  <RadioGroup
                    value={formData.stylePreference}
                    onValueChange={(value) => updateField("stylePreference", value)}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                  >
                    {quoteOptions.styles.map((style) => (
                      <Label
                        key={style.value}
                        className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.stylePreference === style.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={style.value} className="sr-only" />
                        <span className="text-sm">{style.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Matting</Label>
                  <RadioGroup
                    value={formData.matting}
                    onValueChange={(value) => updateField("matting", value)}
                    className="grid grid-cols-2 gap-3"
                  >
                    {quoteOptions.matting.map((mat) => (
                      <Label
                        key={mat.value}
                        className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.matting === mat.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={mat.value} className="sr-only" />
                        <span className="text-sm">{mat.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Glass/Protection</Label>
                  <RadioGroup
                    value={formData.protection}
                    onValueChange={(value) => updateField("protection", value)}
                    className="grid grid-cols-2 gap-3"
                  >
                    {quoteOptions.protection.map((prot) => (
                      <Label
                        key={prot.value}
                        className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.protection === prot.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={prot.value} className="sr-only" />
                        <span className="text-sm">{prot.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Budget Range</Label>
                  <Select
                    value={formData.budgetRange}
                    onValueChange={(value) => updateField("budgetRange", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {quoteOptions.budget.map((b) => (
                        <SelectItem key={b.value} value={b.value}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 4: Timeline & Service */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Timeline & Service</h2>
                  <p className="text-sm text-muted-foreground">
                    When do you need it and how should we get it to you?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <RadioGroup
                    value={formData.timeline}
                    onValueChange={(value) => updateField("timeline", value)}
                    className="space-y-2"
                  >
                    {quoteOptions.timeline.map((t) => (
                      <Label
                        key={t.value}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.timeline === t.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={t.value} className="mr-3" />
                        <span className="text-sm">{t.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>How should we get it to you?</Label>
                  <div className="space-y-2">
                    {quoteOptions.services.map((service) => (
                      <Label
                        key={service.value}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.services.includes(service.value)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Checkbox
                          checked={formData.services.includes(service.value)}
                          onCheckedChange={() => handleServiceToggle(service.value)}
                          className="mr-3"
                        />
                        <span className="text-sm">{service.label}</span>
                      </Label>
                    ))}
                  </div>
                </div>

                {(formData.services.includes("delivery") ||
                  formData.services.includes("installation")) && (
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => updateField("zipCode", e.target.value)}
                      placeholder="e.g., 92602"
                      maxLength={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Required for delivery/installation quotes in Orange County.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Contact Info */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Your Contact Info</h2>
                  <p className="text-sm text-muted-foreground">
                    How should we reach you with your quote?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preferred Contact Method</Label>
                  <RadioGroup
                    value={formData.preferredContact}
                    onValueChange={(value) => updateField("preferredContact", value)}
                    className="flex gap-4"
                  >
                    {quoteOptions.contactMethods.map((method) => (
                      <Label
                        key={method.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <RadioGroupItem value={method.value} />
                        <span className="text-sm">{method.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < 5 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Get My Estimate"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            <Check className="w-4 h-4 inline mr-1 text-primary" />
            We'll respond within {businessConfig.responseTime}
          </p>
        </div>
      </div>
    </div>
  );
}
