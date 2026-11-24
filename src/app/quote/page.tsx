"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageHero } from "@/components/ui/page-hero";
import { Photo } from "@/components/ui/photo";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { quoteOptions, quoteCategoryForFramingId, businessConfig } from "@/lib/config";
import { DEFAULT_FRAME, FRAME_FOR_STYLE, FrameCorner, FramePreview, GLARE } from "@/components/quote/frame-preview";
import { quoteCategorySamples, quoteSampleArt, type QuoteFrameId } from "@/components/quote/quote-frames";
import type { PhotoName } from "@/lib/photos";
import { MAX_PHOTO_BYTES, MAX_PHOTO_MB, MAX_SEND_BYTES, shrinkPhotos } from "@/lib/shrink-photo";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, Upload, X, Check, Camera, LoaderCircle,
  Ruler, Palette, Clock, User, CheckCircle, CircleHelp,
  Shapes, Store, Truck, Package, Hammer, ChevronDown, type LucideIcon
} from "lucide-react";

const steps = [
  { id: 1, name: "Item", icon: Camera },
  { id: 2, name: "Size", icon: Ruler },
  { id: 3, name: "Style", icon: Palette },
  { id: 4, name: "Service", icon: Clock },
  { id: 5, name: "Contact", icon: User },
];

// How many photos the form takes. Each may be up to MAX_PHOTO_MB as picked; they are resized
// in the browser to fit what the host accepts in one submission (see lib/shrink-photo).
const MAX_PHOTOS = 3;

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

const TILE_PICTURE = "aspect-[16/10] w-full";
// A category card's picture: square on a phone, where three sit side by side, taller from there up.
const CATEGORY_PICTURE = "aspect-square w-full sm:aspect-[4/5]";

/** The site photo that stands for each category on the first step. "Other" has none. */
const CATEGORY_PHOTO: Partial<Record<string, PhotoName>> = {
  "photo": "photo",
  "poster/print": "poster",
  "fine art": "fine-art",
  "diploma/certificate": "diploma",
  "jersey": "jersey",
  "mirror": "mirror",
  "canvas": "canvas-stretching",
  "needlework/textile": "needlework",
  "shadowbox/memorabilia": "memorabilia",
  "medals/awards": "medals",
  "vinyl/album art": "album",
  "baby keepsake": "baby-keepsake",
  "wedding": "wedding",
  "military": "military",
  "sports equipment": "sports",
  "document": "document",
  "map/blueprint": "map",
  "flag/banner": "flags",
};

// The categories as the form lays them out: the main ones, the ones behind "More", and "Other".
const MAIN_CATEGORIES = quoteOptions.categories.slice(0, quoteOptions.mainCategoryCount);
const MORE_CATEGORIES = quoteOptions.categories.slice(quoteOptions.mainCategoryCount, -1);
const OTHER_CATEGORY = quoteOptions.categories[quoteOptions.categories.length - 1];

// The kind named in the page's address (/quote?category=flags), as a What We Frame page button
// leaves it. Read this way it is absent on the server and during hydration, then appears.
const noSubscription = () => () => {};
const framingIdInAddress = () => new URLSearchParams(window.location.search).get("category");

/** The icon for each way of getting the finished piece to the customer. */
const SERVICE_ICON: Partial<Record<string, LucideIcon>> = {
  pickup: Store,
  delivery: Truck,
  shipping: Package,
  installation: Hammer,
};

// How an answer card looks when it is and is not the chosen one, and when it has keyboard focus.
const optionCard = (selected: boolean) =>
  `cursor-pointer overflow-hidden rounded-lg border transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/60 ${
    selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"
  }`;

/** One answer shown as a picture of what it is, with its name underneath. */
function PictureOption({
  value,
  label,
  selected,
  small,
  children,
}: {
  value: string;
  label: string;
  selected: boolean;
  /** Smaller name, for cards that sit three across on a phone. */
  small?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Label className={`flex flex-col items-stretch gap-0 ${optionCard(selected)}`}>
      <RadioGroupItem value={value} className="sr-only" />
      {children || (
        // "Not sure": nothing to picture.
        <span aria-hidden="true" className={`${TILE_PICTURE} flex items-center justify-center bg-sand text-primary/50`}>
          <CircleHelp className="size-7" strokeWidth={1.5} />
        </span>
      )}
      {/* A zero-width space lets "Museum/Preservation" wrap at the slash on a narrow tile. */}
      <span className={`px-2 py-2 text-center font-normal leading-snug ${small ? "px-1 text-xs sm:px-2 sm:text-sm" : "text-sm"}`}>
        {label.replaceAll("/", "/\u200b")}
      </span>
    </Label>
  );
}

interface FormData {
  // Step 1
  category: string;
  description: string;
  // Step 2
  width: string;
  height: string;
  notSureSize: boolean;
  images: File[];
  imageLink: string; // Alternative: link to Google Drive, OneDrive, etc.
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
    imageLink: "",
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

  // The frame drawn in the live preview. A "Frame Style" answer brings up that style's lead
  // frame; the visitor can then try any other. Only a frame they picked themselves is passed
  // on to the shop.
  const [previewFrame, setPreviewFrame] = useState<QuoteFrameId>(DEFAULT_FRAME);
  const [framePicked, setFramePicked] = useState(false);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // The category in force: the visitor's own choice, or failing that the one a What We Frame
  // page button asked for. Anything else in the address is ignored.
  const linkedId = useSyncExternalStore(noSubscription, framingIdInAddress, () => null);
  const linkedCategory = linkedId && Object.hasOwn(quoteCategoryForFramingId, linkedId) ? quoteCategoryForFramingId[linkedId].toLowerCase() : "";
  const category = formData.category || linkedCategory;
  // The picture framed until the visitor adds a photo: one of the kind of piece they chose.
  const sample = quoteCategorySamples[category] ?? quoteSampleArt;
  // The less common categories stay folded away unless asked for, or unless one of them is chosen.
  const [moreCategoriesOpen, setMoreCategoriesOpen] = useState(false);
  const moreCategoryChosen = MORE_CATEGORIES.some((cat) => cat.toLowerCase() === category);
  const shownCategories =
    moreCategoriesOpen || moreCategoryChosen ? quoteOptions.categories : [...MAIN_CATEGORIES, OTHER_CATEGORY];

  // The picture framed in the preview and in the Style step's tiles: the photo the visitor
  // picked or added last (their first, if that one has been removed), or the sample picture
  // when they picked that instead. A null shownPhoto means the sample.
  const [previewPick, setPreviewPick] = useState<File | "sample" | null>(null);
  const shownPhoto =
    previewPick === "sample" ? null : previewPick && formData.images.includes(previewPick) ? previewPick : (formData.images[0] ?? null);

  const chooseStyle = (value: string) => {
    updateField("stylePreference", value);
    const lead = FRAME_FOR_STYLE[value];
    if (lead) {
      setPreviewFrame(lead);
      setFramePicked(false);
    }
  };

  // True while a picked photo is being resized, which can take a second for a large one.
  const [preparingPhotos, setPreparingPhotos] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (files.length + formData.images.length > MAX_PHOTOS) {
      toast.error(`Maximum ${MAX_PHOTOS} images allowed`);
      return;
    }
    if (files.some((file) => file.size > MAX_PHOTO_BYTES)) {
      toast.error(`Each photo can be up to ${MAX_PHOTO_MB} MB. For anything larger, paste a link instead.`);
      return;
    }

    setPreparingPhotos(true);
    try {
      const ready = await shrinkPhotos(files, MAX_PHOTOS);
      const newImages = [...formData.images, ...ready].slice(0, MAX_PHOTOS);
      // Only a file that could not be resized (a type this browser cannot open) can still be too big.
      if (getTotalFileSize(newImages) > MAX_SEND_BYTES) {
        toast.error("That photo is in a format we can't resize here, and it is too large to send as it is. Please use a JPEG or PNG, or paste a link instead.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        images: newImages,
      }));
      // Show the photo that was just added.
      setPreviewPick(newImages[newImages.length - 1]);
    } finally {
      setPreparingPhotos(false);
    }
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
        if (!category) {
          toast.error("Please select a category");
          return false;
        }
        return true;
      case 2:
        // Require either uploaded images OR a link to images
        if (formData.images.length === 0 && !formData.imageLink.trim()) {
          toast.error("Please upload photos or provide a link to your images");
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
        category,
        description: formData.description,
        width: formData.width,
        height: formData.height,
        notSureSize: formData.notSureSize,
        imageLink: formData.imageLink,
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
        previewFrame: framePicked ? previewFrame : undefined,
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
        throw new Error("Your photos are too large to send together. Please remove one, or paste a link to them instead.");
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
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-sand py-16">
        <div className="container-wide max-w-xl!">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="mb-4 font-heading text-3xl font-semibold tracking-tight">
                Thanks — we got your request!
              </h1>
              <p className="text-muted-foreground mb-6">
                We&apos;ll follow up within <strong>{businessConfig.responseTime}</strong> with 
                options aligned to your budget and timeline.
              </p>
              <div className="mb-6 rounded-xl border border-primary/15 bg-sand/60 p-4 text-sm">
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
    <>
    <PageHero
      compact
      title="Get a Fast Quote"
      lede="Tell us about your project and we'll provide options that fit your budget."
    />
    <div className="min-h-[calc(100vh-200px)] bg-sand py-10 lg:py-14">
      {/* Phones: progress, preview, form in one column. Desktop: the preview stays beside the form,
          wider on wider screens. The second row takes any height the preview adds, so the
          progress bar stays snug against the form. */}
      <div className="container-wide max-w-3xl! lg:grid lg:max-w-6xl! lg:grid-cols-[minmax(0,1fr)_24rem] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-10 xl:max-w-7xl! xl:grid-cols-[minmax(0,1fr)_34rem] 2xl:max-w-[1400px]! 2xl:grid-cols-[minmax(0,1fr)_40rem]">

        {/* Progress */}
        <div className="mb-8 lg:col-start-1">
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
                      : "bg-white text-muted-foreground ring-1 ring-border"
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

        {/* Live preview. On a phone it stays in view through the Style step, where every answer
            changes it, and steps aside for the last two steps, which do not. */}
        <div
          className={`z-20 mb-4 bg-sand lg:sticky lg:top-20 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mb-0 ${
            currentStep === 3 ? "max-lg:sticky max-lg:top-16 max-lg:-mt-2 max-lg:py-2" : currentStep > 3 ? "max-lg:hidden" : ""
          }`}
        >
          <FramePreview
            sample={sample}
            photos={formData.images}
            photo={shownPhoto}
            onPhotoChange={(photo) => setPreviewPick(photo ?? "sample")}
            sampleOffered={category !== ""}
            width={formData.width}
            height={formData.height}
            matting={formData.matting}
            protection={formData.protection}
            frameId={previewFrame}
            onFrameChange={(id) => {
              setPreviewFrame(id);
              setFramePicked(true);
            }}
            onAddPhoto={handleImageUpload}
            compactOnPhones={currentStep === 3}
          />
        </div>

        {/* Form card, with the reassurance line kept right under it however tall the preview is */}
        <div className="lg:col-start-1">
        <Card>
          <CardContent className="p-6 md:p-8">
            {/* Step 1: Category & Description */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-1 font-heading text-2xl font-semibold tracking-tight">What are you framing?</h2>
                  <p className="text-sm text-muted-foreground">
                    Select the category that best describes your item.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label id="category-label">Category *</Label>
                  <RadioGroup
                    aria-labelledby="category-label"
                    value={category}
                    onValueChange={(value) => updateField("category", value)}
                    className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 xl:grid-cols-5"
                  >
                    {/* A photo of that kind of piece, framed; "Other" gets a symbol instead. */}
                    {shownCategories.map((cat) => {
                      const value = cat.toLowerCase();
                      const photo = CATEGORY_PHOTO[value];
                      return (
                        <PictureOption key={cat} value={value} label={cat} selected={category === value} small>
                          {photo ? (
                            <Photo
                              name={photo}
                              alt=""
                              sizes="(min-width: 1280px) 7rem, (min-width: 640px) 8.5rem, 30vw"
                              className={`${CATEGORY_PICTURE} object-cover`}
                            />
                          ) : (
                            <span aria-hidden="true" className={`${CATEGORY_PICTURE} flex items-center justify-center bg-sand text-primary/50`}>
                              <Shapes className="size-7" strokeWidth={1.5} />
                            </span>
                          )}
                        </PictureOption>
                      );
                    })}
                  </RadioGroup>
                  {/* Hidden while one of the extra categories is chosen, since folding would hide the choice. */}
                  {!moreCategoryChosen && (
                    <button
                      type="button"
                      aria-expanded={moreCategoriesOpen}
                      onClick={() => setMoreCategoriesOpen((open) => !open)}
                      className="mx-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-primary outline-offset-2 transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      {moreCategoriesOpen ? "Show fewer" : `More categories (${MORE_CATEGORIES.length})`}
                      <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${moreCategoriesOpen ? "rotate-180" : ""}`} />
                    </button>
                  )}
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
                  <h2 className="mb-1 font-heading text-2xl font-semibold tracking-tight">Size & Photos</h2>
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
                    {formData.images.length < MAX_PHOTOS &&
                      (preparingPhotos ? (
                        <div
                          role="status"
                          className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center"
                        >
                          <LoaderCircle className="w-6 h-6 text-muted-foreground mb-2 animate-spin" aria-hidden="true" />
                          <span className="text-xs text-muted-foreground">Preparing…</span>
                        </div>
                      ) : (
                        <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                          <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground">Add Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleImageUpload(e);
                              // Cleared so the same photo can be picked again after being removed.
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>
                      ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload 1-{MAX_PHOTOS} photos of your item, up to {MAX_PHOTO_MB} MB each. Large photos are resized before they are sent.
                  </p>
                </div>

                {/* OR divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                {/* Image Link Alternative */}
                <div className="space-y-2">
                  <Label htmlFor="imageLink">Link to Photos (for full-size files)</Label>
                  <Input
                    id="imageLink"
                    type="url"
                    value={formData.imageLink}
                    onChange={(e) => updateField("imageLink", e.target.value)}
                    placeholder="https://drive.google.com/... or https://onedrive.com/..."
                    disabled={formData.images.length > 0}
                  />
                  <p className="text-xs text-muted-foreground">
                    To send photos at their full size, or files larger than {MAX_PHOTO_MB} MB, paste a link from Google Drive, OneDrive, Dropbox, or iCloud. Make sure the link is set to &ldquo;Anyone with the link can view.&rdquo;
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
                  <h2 className="mb-1 font-heading text-2xl font-semibold tracking-tight">Style & Budget</h2>
                  <p className="text-sm text-muted-foreground">
                    Help us understand your preferences.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Frame Style *</Label>
                  <RadioGroup
                    value={formData.stylePreference}
                    onValueChange={chooseStyle}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                  >
                    {/* Each style shows a corner of the frame it brings up in the preview. */}
                    {quoteOptions.styles.map((style) => {
                      const lead = FRAME_FOR_STYLE[style.value];
                      return (
                        <PictureOption key={style.value} value={style.value} label={style.label} selected={formData.stylePreference === style.value}>
                          {lead && <FrameCorner frameId={lead} photo={shownPhoto} sample={sample} span={7.5} className={TILE_PICTURE} />}
                        </PictureOption>
                      );
                    })}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Matting *</Label>
                  <RadioGroup
                    value={formData.matting}
                    onValueChange={(value) => updateField("matting", value)}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                  >
                    {/* Drawn in the frame the preview is showing, from further back so the mat fits in. */}
                    {quoteOptions.matting.map((mat) => (
                      <PictureOption key={mat.value} value={mat.value} label={mat.label} selected={formData.matting === mat.value}>
                        {mat.value !== "not-sure" && (
                          <FrameCorner frameId={previewFrame} matting={mat.value} photo={shownPhoto} sample={sample} span={14} className={TILE_PICTURE} />
                        )}
                      </PictureOption>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Glass/Protection *</Label>
                  <RadioGroup
                    value={formData.protection}
                    onValueChange={(value) => updateField("protection", value)}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                  >
                    {/* The same corner three times, differing only in how much the glass reflects. */}
                    {quoteOptions.protection.map((prot) => (
                      <PictureOption key={prot.value} value={prot.value} label={prot.label} selected={formData.protection === prot.value}>
                        {prot.value !== "not-sure" && (
                          <FrameCorner frameId={previewFrame} glare={GLARE[prot.value] ?? 0} photo={shownPhoto} sample={sample} span={9} className={TILE_PICTURE} />
                        )}
                      </PictureOption>
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
                  <h2 className="mb-1 font-heading text-2xl font-semibold tracking-tight">Timeline & Service</h2>
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
                    className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                  >
                    {quoteOptions.services.map((service) => {
                      const Icon = SERVICE_ICON[service.value];
                      return (
                        <Label
                          key={service.value}
                          className={`flex flex-col items-center gap-2 px-2 py-4 text-center ${optionCard(formData.service === service.value)}`}
                        >
                          <RadioGroupItem value={service.value} className="sr-only" />
                          {Icon && <Icon aria-hidden="true" className="size-7 text-primary" strokeWidth={1.5} />}
                          <span className="text-sm font-normal leading-snug">{service.label}</span>
                        </Label>
                      );
                    })}
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
                  <h2 className="mb-1 font-heading text-2xl font-semibold tracking-tight">Your Contact Info</h2>
                  <p className="text-sm text-muted-foreground">
                    How should we reach you with your quote?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name or Business Name*</Label>
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
            We&apos;ll respond within {businessConfig.responseTime}
          </p>
        </div>
        </div>
      </div>
    </div>
    </>
  );
}
