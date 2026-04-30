"use client";

import { useMemo, useState } from "react";
import { UploadButton } from "@uploadthing/react";
import type { ClientUploadedFileData } from "uploadthing/types";
import type { AdminUploadRouter } from "@/app/admin/api/uploadthing/core";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function parseUrls(value: string) {
  return value
    .split(/[\n,]/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function uploadedUrl(file: ClientUploadedFileData<{ url: string; name: string }>) {
  return file.serverData?.url || file.ufsUrl || file.url;
}

interface ImageUploadFieldProps {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  multiple?: boolean;
  placeholder?: string;
}

export function ImageUploadField({
  id,
  name,
  label,
  defaultValue = "",
  multiple = true,
  placeholder = "Paste image URLs or upload files",
}: ImageUploadFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const urls = useMemo(() => parseUrls(value), [value]);

  const appendUrls = (newUrls: string[]) => {
    setValue((current) => {
      const existing = multiple ? parseUrls(current) : [];
      const next = multiple ? [...existing, ...newUrls] : newUrls.slice(0, 1);
      return next.join("\n");
    });
  };

  return (
    <div className="grid gap-3">
      <Label htmlFor={id}>{label}</Label>
      <div className="rounded-lg border bg-stone-50 p-3">
        <UploadButton<AdminUploadRouter, "shopImageUploader">
          endpoint="shopImageUploader"
          url="/admin/api/uploadthing"
          onClientUploadComplete={(files) => {
            appendUrls(files.map(uploadedUrl).filter(Boolean));
          }}
          onUploadError={(error) => {
            window.alert(`Upload failed: ${error.message}`);
          }}
          appearance={{
            container: "items-start gap-2",
            button:
              "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium",
            allowedContent: "text-xs text-muted-foreground",
          }}
          content={{
            button: multiple ? "Upload images" : "Upload image",
            allowedContent: "Images up to 8MB each",
          }}
        />
      </div>

      {multiple ? (
        <Textarea
          id={id}
          name={name}
          rows={4}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <Input
          id={id}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
        />
      )}

      {urls.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {urls.map((url) => (
            <div key={url} className="aspect-square overflow-hidden rounded-md border bg-white">
              <img src={url} alt="Uploaded preview" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
