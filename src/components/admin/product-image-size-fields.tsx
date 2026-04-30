"use client";

import { useMemo, useState } from "react";
import { ImageUploadField, type ImageDimensions } from "@/components/admin/image-upload-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SHRINK_FACTOR = 80;

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

function numeric(value: string) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
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
  const initialSize = useMemo(() => parseFirstSize(sizeDefaultValue), [sizeDefaultValue]);
  const [length, setLength] = useState(initialSize.length);
  const [width, setWidth] = useState(initialSize.width);
  const [ratio, setRatio] = useState(() => {
    const initialLength = numeric(initialSize.length);
    const initialWidth = numeric(initialSize.width);
    return initialLength && initialWidth ? initialLength / initialWidth : null;
  });

  const savedSize = length && width ? `${length}×${width}` : "";

  const applyImageDimensions = ({ width: pixelWidth, height: pixelHeight }: ImageDimensions) => {
    if (!pixelWidth || !pixelHeight) return;

    setRatio(pixelWidth / pixelHeight);
    setLength(String(roundedSize(pixelWidth)));
    setWidth(String(roundedSize(pixelHeight)));
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
      <ImageUploadField
        id={imageId}
        name={imageName}
        label="Images"
        defaultValue={imageDefaultValue}
        placeholder="One URL per line, or upload files above"
        onImageDimensions={applyImageDimensions}
      />

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
          Uploading an image sets size from pixels ÷ {SHRINK_FACTOR}, rounded. Editing one side preserves the ratio.
        </p>
      </div>
    </div>
  );
}
