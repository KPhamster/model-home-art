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

type OrderedImage =
  | { id: string; type: "preview"; previewIndex: number; src: string; alt: string }
  | { id: string; type: "existing"; existingIndex: number; src: string; alt: string };

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
  const [order, setOrder] = useState<string[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const existingUrls = useMemo(() => parseUrls(value), [value]);

  const previewIds = useMemo(() => previews.map((preview) => `preview:${preview.url}`), [previews]);
  const existingIds = useMemo(() => existingUrls.map((url, index) => `existing:${index}:${url}`), [existingUrls]);
  const allIds = useMemo(() => [...previewIds, ...existingIds], [previewIds, existingIds]);

  const effectiveOrder = useMemo(() => {
    const keptIds = order.filter((imageId) => allIds.includes(imageId));
    const addedIds = allIds.filter((imageId) => !keptIds.includes(imageId));
    return [...keptIds, ...addedIds];
  }, [allIds, order]);

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

  const orderedImages = useMemo(() => {
    const previewItems = new Map(
      previews.map((preview, previewIndex) => [
        `preview:${preview.url}`,
        {
          id: `preview:${preview.url}`,
          type: "preview" as const,
          previewIndex,
          src: preview.url,
          alt: preview.name,
        },
      ]),
    );
    const existingItems = new Map(
      existingUrls.map((url, existingIndex) => [
        `existing:${existingIndex}:${url}`,
        {
          id: `existing:${existingIndex}:${url}`,
          type: "existing" as const,
          existingIndex,
          src: url,
          alt: "Existing",
        },
      ]),
    );

    return effectiveOrder
      .map((imageId) => previewItems.get(imageId) ?? existingItems.get(imageId))
      .filter((item): item is OrderedImage => Boolean(item));
  }, [effectiveOrder, existingUrls, previews]);

  const imageOrderValue = useMemo(
    () =>
      JSON.stringify(
        orderedImages.map((image) =>
          image.type === "preview"
            ? { type: "uploaded", index: image.previewIndex }
            : { type: "existing", url: existingUrls[image.existingIndex] },
        ),
      ),
    [existingUrls, orderedImages],
  );

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

  const removeExistingUrl = (index: number) => {
    setValue(urlsToValue(existingUrls.filter((_, urlIndex) => urlIndex !== index)));
  };

  const moveImage = (fromId: string | null, toId: string) => {
    if (!multiple || !fromId || fromId === toId) return;

    setOrder((currentOrder) => {
      const currentEffectiveOrder = [
        ...currentOrder.filter((imageId) => allIds.includes(imageId)),
        ...allIds.filter((imageId) => !currentOrder.includes(imageId)),
      ];
      const fromIndex = currentEffectiveOrder.indexOf(fromId);
      const toIndex = currentEffectiveOrder.indexOf(toId);
      if (fromIndex === -1 || toIndex === -1) return currentOrder;

      const nextOrder = [...currentEffectiveOrder];
      const [moved] = nextOrder.splice(fromIndex, 1);
      nextOrder.splice(toIndex, 0, moved);
      return nextOrder;
    });
  };

  const removeImage = (image: OrderedImage) => {
    if (image.type === "preview") {
      removePreview(image.previewIndex);
    } else {
      removeExistingUrl(image.existingIndex);
    }
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

      <input type="hidden" name={`${valueName}Order`} value={imageOrderValue} />

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

      {orderedImages.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {orderedImages.map((image) => (
            <div
              key={image.id}
              draggable={multiple}
              onDragStart={(event) => {
                setDraggedId(image.id);
                event.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(event) => {
                if (!multiple) return;
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
              }}
              onDrop={(event) => {
                event.preventDefault();
                moveImage(draggedId, image.id);
                setDraggedId(null);
              }}
              onDragEnd={() => setDraggedId(null)}
              className="group relative aspect-square cursor-grab overflow-hidden rounded-md border bg-white active:cursor-grabbing"
            >
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
              {multiple ? (
                <div className="absolute bottom-1 left-1 rounded bg-black/65 px-2 py-1 text-[10px] text-white">
                  Drag
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => removeImage(image)}
                className="absolute right-1 top-1 rounded bg-black/65 px-2 py-1 text-xs text-white opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
