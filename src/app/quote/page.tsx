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
  service: string;
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
    service: "",
    zipCode: "",
    name: "",
    email: "",
    phone: "",
    preferredContact: "",
  });

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }
    
    // Check total size including new files
    const newImages = [...formData.images, ...files].slice(0, 3);
    const totalSize = getTotalFileSize(newImages);
    
    if (totalSize > MAX_UPLOAD_SIZE_BYTES) {
      toast.error(`Total upload size exceeds ${MAX_UPLOAD_SIZE_MB}MB limit. Please use smaller images.`);
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      images: newImages,
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
        // Size validation: must provide both dimensions OR check "not sure"
        const hasWidth = formData.width.trim() !== "";
        const hasHeight = formData.height.trim() !== "";
        if (!formData.notSureSize) {
          if (!hasWidth && !hasHeight) {
            toast.error("Please enter dimensions or check 'Not sure — help me measure'");
            return false;
          }
          if (hasWidth && !hasHeight) {
            toast.error("Please enter the height");
            return false;
          }
          if (!hasWidth && hasHeight) {
            toast.error("Please enter the width");
            return false;
          }
        }
        return true;
      case 3:
        if (!formData.stylePreference) {
          toast.error("Please select a frame style");
          return false;
        }
        if (!formData.matting) {
          toast.error("Please select a matting option");
          return false;
        }
        if (!formData.protection) {
          toast.error("Please select a glass/protection option");
          return false;
        }
        return true;
      case 4:
        if (!formData.timeline) {
          toast.error("Please select a timeline");
          return false;
        }
        if (!formData.service) {
          toast.error("Please select how you'd like to receive your item");
          return false;
        }
        if (
          (formData.service === "delivery" ||
            formData.service === "installation") &&
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
        if (!formData.phone) {
          toast.error("Please enter your phone number");
          return false;
        }
        if (!formData.preferredContact) {
          toast.error("Please select a preferred contact method");
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

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      // Use FormData to send files as binary (avoids 33% base64 overhead)
      const submitFormData = new FormData();
      
      // Add all form fields as JSON
      const formFields = {
        category: formData.category,
        description: formData.description,
        width: formData.width,
        height: formData.height,
        notSureSize: formData.notSureSize,
        repairsNeeded: formData.repairsNeeded,
        repairNotes: formData.repairNotes,
        stylePreference: formData.stylePreference,
        matting: formData.matting,
        protection: formData.protection,
        budgetRange: formData.budgetRange,
        timeline: formData.timeline,
        service: formData.service,
        services: formData.service ? [formData.service] : [],
        zipCode: formData.zipCode,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferredContact: formData.preferredContact,
      };
      submitFormData.append('formData', JSON.stringify(formFields));
      
      // Add images as binary files
      formData.images.forEach((file, index) => {
        submitFormData.append(`image${index}`, file);
      });

      const response = await fetch('/api/quote', {
        method: 'POST',
        body: submitFormData,
      });

      // Handle payload too large error
      if (response.status === 413) {
        throw new Error(`Your photos exceed the ${MAX_UPLOAD_SIZE_MB}MB limit. Please use smaller images or fewer photos.`);
      }

      // Try to parse JSON response
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Server error. Please try again or contact us directly.');
      }

      if (!response.ok) {
        // Include error code if available for debugging
        const errorMsg = data.error || 'Failed to submit quote request';
        const errorCode = data.code ? ` (Code: ${data.code})` : '';
        throw new Error(`${errorMsg}${errorCode}`);
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
                  <div className="flex items-center justify-between">
                    <Label>Photos *</Label>
                    {formData.images.length > 0 && (
                      <span className={`text-xs font-medium ${
                        getTotalFileSize(formData.images) > MAX_UPLOAD_SIZE_BYTES * 0.9
                          ? "text-amber-600"
                          : "text-muted-foreground"
                      }`}>
                        {formatFileSize(getTotalFileSize(formData.images))} / {MAX_UPLOAD_SIZE_MB} MB
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {formData.images.map((file, index) => (
                      <div
                        key={index}
                        className="relative aspect-square bg-stone-100 rounded-lg overflow-hidden group"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 text-center">
                          {formatFileSize(file.size)}
                        </div>
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
                    Upload 1-3 photos of your item in original quality. Maximum total size: {MAX_UPLOAD_SIZE_MB} MB.
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
                    Help us understand your preferences.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Frame Style *</Label>
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
                  <Label>Matting *</Label>
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
                  <Label>Glass/Protection *</Label>
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
                  <Label>Timeline *</Label>
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
                  <Label>How should we get it to you? *</Label>
                  <RadioGroup
                    value={formData.service}
                    onValueChange={(value) => updateField("service", value)}
                    className="space-y-2"
                  >
                    {quoteOptions.services.map((service) => (
                      <Label
                        key={service.value}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.service === service.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={service.value} className="mr-3" />
                        <span className="text-sm">{service.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                {(formData.service === "delivery" ||
                  formData.service === "installation") && (
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
                      Required for delivery/installation quotes in the United States.
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
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preferred Contact Method *</Label>
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
