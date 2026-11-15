import Link from "next/link";
import { Plus } from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { framingCategories } from "@/lib/config";
import type { PhotoName } from "@/lib/photos";
import { cn } from "@/lib/utils";

const tilePhotos: Partial<Record<string, { name: PhotoName; alt: string }>> = {
  jerseys: { name: "jersey", alt: "Framed jersey" },
  mirrors: { name: "mirror", alt: "Framed mirror" },
  diplomas: { name: "diploma", alt: "Framed diploma and certificates" },
  "fine-art": { name: "fine-art", alt: "Framed fine art" },
  posters: { name: "poster", alt: "Framed posters and prints" },
  photos: { name: "photo", alt: "Framed photos" },
  canvas: { name: "canvas-stretching", alt: "Stretched canvas" },
  needlework: { name: "needlework", alt: "Framed needlework and textiles" },
  shadowboxes: { name: "memorabilia", alt: "Shadowbox memorabilia display" },
  medals: { name: "medals", alt: "Framed medals and awards" },
};

/** How wide a tile is drawn, so the browser can pick the smallest photo that is sharp. */
const tileSizes = "(min-width: 1400px) 260px, (min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw";

/**
 * The grid of things we frame: one photo tile per category, each linking to its entry on
 * the What We Frame page. Used on the homepage and on Custom Framing.
 */
export function CategoryTiles({ className }: { className?: string }) {
  return (
    // Every photo is two wide by three tall, and so are the tiles: nothing is cropped.
    <ul className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5", className)}>
      {framingCategories.map((category) => {
        const photo = tilePhotos[category.id];
        return (
          // With three columns the tenth tile would sit alone on its row, so there the
          // "and more" tile becomes a strip across all three.
          <li key={category.id} className={cn("reveal", !photo && "sm:max-lg:col-span-3")}>
            <Link
              href={`/what-we-frame#${category.id}`}
              className={cn(
                "group relative block aspect-[2/3] overflow-hidden rounded-xl bg-stone-200 shadow-sm transition-shadow duration-300 hover:shadow-lg",
                !photo && "sm:max-lg:aspect-auto sm:max-lg:h-28",
              )}
            >
              {photo ? (
                <>
                  <Photo
                    name={photo.name}
                    alt={photo.alt}
                    sizes={tileSizes}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3.5 pb-3.5 pt-16 sm:px-4 sm:pb-4">
                    <span className="font-heading text-base font-semibold leading-snug text-white sm:text-lg">
                      {category.name}
                    </span>
                  </span>
                </>
              ) : (
                <span className="flex h-full flex-col items-center justify-center gap-4 bg-[#151311] p-4 text-center sm:max-lg:flex-row sm:max-lg:gap-5">
                  <span className="flex size-12 items-center justify-center rounded-full border border-brand/60 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-[#151311]">
                    <Plus className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-heading text-base font-semibold leading-snug text-stone-50 sm:text-lg">
                    {category.name}
                  </span>
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
