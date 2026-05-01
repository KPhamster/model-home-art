"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function parseUrls(value: string) {
  return value
    .split(/[\n,]/)
    .map((url) => url.trim())
    .filter(Boolean);
}

interface PreviewImage {
  name: string;
  url: string;
}

interface DeferredImageFieldProps {
  id: string;
  fileName: string;
  valueName: string;
  label: string;
  defaultValue?: string;
  multiple?: boolean;
  helperText?: string;
  placeholder?: string;
}

export function DeferredImageField({
  id,
  fileName,
  valueName,
  label,
  defaultValue = "",
  multiple = false,
  helperText = "Images stay local until you submit the form.",
  placeholder = "https://...",
}: DeferredImageFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const existingUrls = useMemo(() => parseUrls(value), [value]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const handleFilesChange = (files: FileList | null) => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));

    const selectedFiles = Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));
    setPreviews(
      selectedFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    );
  };

  return (
    <div className="grid gap-3">
      <Label htmlFor={`${id}-files`}>{label}</Label>
      <div className="rounded-lg border bg-stone-50 p-3">
        <Input
          id={`${id}-files`}
          name={fileName}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(event) => handleFilesChange(event.target.files)}
        />
        <p className="mt-2 text-xs text-muted-foreground">{helperText}</p>
      </div>

      {multiple ? (
        <Textarea
          id={id}
          name={valueName}
          rows={4}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <Input
          id={id}
          name={valueName}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
        />
      )}

      {previews.length > 0 || existingUrls.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {previews.map((preview) => (
            <div key={preview.url} className="aspect-square overflow-hidden rounded-md border bg-white">
              <img src={preview.url} alt={preview.name} className="h-full w-full object-cover" />
            </div>
          ))}
          {existingUrls.map((url) => (
            <div key={url} className="aspect-square overflow-hidden rounded-md border bg-white">
              <img src={url} alt="Existing" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
