"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function parseUrls(value: string) {
  return value
    .split(/[\n,]/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function urlsToValue(urls: string[]) {
  return urls.join("\n");
}

interface PreviewImage {
  file: File;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const existingUrls = useMemo(() => parseUrls(value), [value]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const syncInputFiles = (nextPreviews: PreviewImage[]) => {
    if (!inputRef.current) return;

    const dataTransfer = new DataTransfer();
    nextPreviews.forEach((preview) => dataTransfer.items.add(preview.file));
    inputRef.current.files = dataTransfer.files;
  };

  const setSyncedPreviews = (nextPreviews: PreviewImage[]) => {
    setPreviews(nextPreviews);
    syncInputFiles(nextPreviews);
  };

  const handleFilesChange = (files: FileList | null) => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));

    const selectedFiles = Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));
    setSyncedPreviews(
      selectedFiles.map((file) => ({
        file,
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    );
  };

  const removePreview = (index: number) => {
    const removed = previews[index];
    if (removed) URL.revokeObjectURL(removed.url);
    setSyncedPreviews(previews.filter((_, previewIndex) => previewIndex !== index));
  };

  const movePreview = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= previews.length) return;

    const nextPreviews = [...previews];
    [nextPreviews[index], nextPreviews[nextIndex]] = [nextPreviews[nextIndex], nextPreviews[index]];
    setSyncedPreviews(nextPreviews);
  };

  const removeExistingUrl = (index: number) => {
    setValue(urlsToValue(existingUrls.filter((_, urlIndex) => urlIndex !== index)));
  };

  const moveExistingUrl = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= existingUrls.length) return;

    const nextUrls = [...existingUrls];
    [nextUrls[index], nextUrls[nextIndex]] = [nextUrls[nextIndex], nextUrls[index]];
    setValue(urlsToValue(nextUrls));
  };

  return (
    <div className="grid gap-3">
      <Label htmlFor={`${id}-files`}>{label}</Label>
      <div className="rounded-lg border bg-stone-50 p-3">
        <Input
          ref={inputRef}
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
          {previews.map((preview, index) => (
            <div key={preview.url} className="group relative aspect-square overflow-hidden rounded-md border bg-white">
              <img src={preview.url} alt={preview.name} className="h-full w-full object-cover" />
              <div className="absolute inset-x-1 top-1 flex justify-between gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                {multiple ? (
                  <button
                    type="button"
                    onClick={() => movePreview(index, -1)}
                    disabled={index === 0}
                    className="rounded bg-black/65 px-2 py-1 text-xs text-white disabled:opacity-30"
                  >
                    ←
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="ml-auto rounded bg-black/65 px-2 py-1 text-xs text-white"
                >
                  Remove
                </button>
                {multiple ? (
                  <button
                    type="button"
                    onClick={() => movePreview(index, 1)}
                    disabled={index === previews.length - 1}
                    className="rounded bg-black/65 px-2 py-1 text-xs text-white disabled:opacity-30"
                  >
                    →
                  </button>
                ) : null}
              </div>
            </div>
          ))}
          {existingUrls.map((url, index) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-md border bg-white">
              <img src={url} alt="Existing" className="h-full w-full object-cover" />
              <div className="absolute inset-x-1 top-1 flex justify-between gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                {multiple ? (
                  <button
                    type="button"
                    onClick={() => moveExistingUrl(index, -1)}
                    disabled={index === 0}
                    className="rounded bg-black/65 px-2 py-1 text-xs text-white disabled:opacity-30"
                  >
                    ←
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => removeExistingUrl(index)}
                  className="ml-auto rounded bg-black/65 px-2 py-1 text-xs text-white"
                >
                  Remove
                </button>
                {multiple ? (
                  <button
                    type="button"
                    onClick={() => moveExistingUrl(index, 1)}
                    disabled={index === existingUrls.length - 1}
                    className="rounded bg-black/65 px-2 py-1 text-xs text-white disabled:opacity-30"
                  >
                    →
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
