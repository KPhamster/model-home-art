"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SHRINK_FACTOR = 80;

interface PreviewImage {
  file: File;
  name: string;
  url: string;
}

function roundedSize(pixels: number) {
  return Math.max(1, Math.round(pixels / SHRINK_FACTOR));
}

function parseFirstSize(value: string) {
  const match = value.match(/(\d+(?:\.\d+)?)\s*(?:x|×|:|by)\s*(\d+(?:\.\d+)?)/i);
  if (!match) return { length: "", width: "" };
  return {
    length: String(Math.round(Number(match[1]))),
    width: String(Math.round(Number(match[2]))),
  };
}

function parseUrls(value: string) {
  return value
    .split(/[\n,]/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function urlsToValue(urls: string[]) {
  return urls.join("\n");
}

function numeric(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function readImageDimensions(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image dimensions."));
    };

    image.src = objectUrl;
  });
}

interface ProductImageSizeFieldsProps {
  imageId: string;
  imageName: string;
  imageDefaultValue?: string;
  sizeId: string;
  sizeName: string;
  sizeDefaultValue?: string;
}

export function ProductImageSizeFields({
  imageId,
  imageName,
  imageDefaultValue = "",
  sizeId,
  sizeName,
  sizeDefaultValue = "",
}: ProductImageSizeFieldsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialSize = useMemo(() => parseFirstSize(sizeDefaultValue), [sizeDefaultValue]);
  const [imageUrls, setImageUrls] = useState(imageDefaultValue);
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const [length, setLength] = useState(initialSize.length);
  const [width, setWidth] = useState(initialSize.width);
  const [ratio, setRatio] = useState(() => {
    const initialLength = numeric(initialSize.length);
    const initialWidth = numeric(initialSize.width);
    return initialLength && initialWidth ? initialLength / initialWidth : null;
  });

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const existingUrls = useMemo(() => parseUrls(imageUrls), [imageUrls]);
  const savedSize = length && width ? `${length}×${width}` : "";

  const applyImageDimensions = ({ width: pixelWidth, height: pixelHeight }: { width: number; height: number }) => {
    if (!pixelWidth || !pixelHeight) return;

    // Browser image dimensions are width × height. For product sizing, map
    // height to Length and width to Width.
    setRatio(pixelHeight / pixelWidth);
    setLength(String(roundedSize(pixelHeight)));
    setWidth(String(roundedSize(pixelWidth)));
  };

  const syncInputFiles = (nextPreviews: PreviewImage[]) => {
    if (!fileInputRef.current) return;

    const dataTransfer = new DataTransfer();
    nextPreviews.forEach((preview) => dataTransfer.items.add(preview.file));
    fileInputRef.current.files = dataTransfer.files;
  };

  const setSyncedPreviews = (nextPreviews: PreviewImage[]) => {
    setPreviews(nextPreviews);
    syncInputFiles(nextPreviews);
  };

  const inferSizeFromFirstPreview = (nextPreviews: PreviewImage[]) => {
    const firstImage = nextPreviews[0]?.file;
    if (!firstImage) return;

    readImageDimensions(firstImage)
      .then(applyImageDimensions)
      .catch(() => {
        // Product creation can still proceed; size auto-fill is best effort.
      });
  };

  const handleFilesChange = (files: FileList | null) => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));

    const selectedFiles = Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));
    const nextPreviews = selectedFiles.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setSyncedPreviews(nextPreviews);
    inferSizeFromFirstPreview(nextPreviews);
  };

  const removePreview = (index: number) => {
    const removed = previews[index];
    if (removed) URL.revokeObjectURL(removed.url);

    const nextPreviews = previews.filter((_, previewIndex) => previewIndex !== index);
    setSyncedPreviews(nextPreviews);
    if (index === 0) inferSizeFromFirstPreview(nextPreviews);
  };

  const removeExistingUrl = (index: number) => {
    setImageUrls(urlsToValue(existingUrls.filter((_, urlIndex) => urlIndex !== index)));
  };

  const handleLengthChange = (value: string) => {
    setLength(value);
    const nextLength = numeric(value);
    if (!nextLength || !ratio) return;
    setWidth(String(Math.max(1, Math.round(nextLength / ratio))));
  };

  const handleWidthChange = (value: string) => {
    setWidth(value);
    const nextWidth = numeric(value);
    if (!nextWidth || !ratio) return;
    setLength(String(Math.max(1, Math.round(nextWidth * ratio))));
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <Label htmlFor={`${imageId}-files`}>Images</Label>
        <div className="rounded-lg border bg-stone-50 p-3">
          <Input
            ref={fileInputRef}
            id={`${imageId}-files`}
            name="imageFiles"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => handleFilesChange(event.target.files)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Images stay local until you submit the form. They upload only when you create/save the product.
          </p>
        </div>

        <Textarea
          id={imageId}
          name={imageName}
          rows={4}
          value={imageUrls}
          onChange={(event) => setImageUrls(event.target.value)}
          placeholder="Existing image URLs, one per line. New files are added on submit."
        />

        {previews.length > 0 || existingUrls.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {previews.map((preview, index) => (
              <div key={preview.url} className="group relative aspect-square overflow-hidden rounded-md border bg-white">
                <img src={preview.url} alt={preview.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="absolute right-1 top-1 rounded bg-black/65 px-2 py-1 text-xs text-white opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            ))}
            {existingUrls.map((url, index) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-md border bg-white">
                <img src={url} alt="Existing product" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingUrl(index)}
                  className="absolute right-1 top-1 rounded bg-black/65 px-2 py-1 text-xs text-white opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label>Size</Label>
        <input type="hidden" name={sizeName} value={savedSize} />
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor={`${sizeId}-length`} className="text-xs text-muted-foreground">
              Length
            </Label>
            <Input
              id={`${sizeId}-length`}
              inputMode="numeric"
              value={length}
              onChange={(event) => handleLengthChange(event.target.value)}
              placeholder="19"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${sizeId}-width`} className="text-xs text-muted-foreground">
              Width
            </Label>
            <Input
              id={`${sizeId}-width`}
              inputMode="numeric"
              value={width}
              onChange={(event) => handleWidthChange(event.target.value)}
              placeholder="13"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Selecting an image sets size from pixels ÷ {SHRINK_FACTOR}, rounded. Editing one side preserves the ratio.
        </p>
      </div>
    </div>
  );
}
