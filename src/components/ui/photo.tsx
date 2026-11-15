import { photos, type PhotoName } from "@/lib/photos";

type PhotoProps = {
  /** Which photo, by its name in scripts/build-photos.mjs. */
  name: PhotoName;
  alt: string;
  /**
   * How wide the photo is drawn at each screen width (the HTML `sizes` attribute).
   * The browser uses it to pick the smallest file that is still sharp.
   */
  sizes: string;
  className?: string;
};

/**
 * A site photo. The originals in assets/ are several megabytes each; this serves the
 * small WebP copies made by scripts/build-photos.mjs, at the width the screen needs,
 * and only once the photo is about to scroll into view.
 */
export function Photo({ name, alt, sizes, className }: PhotoProps) {
  const photo = photos[name];
  const url = (width: number) => `/photos/${name}-${width}.webp`;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- already compressed and sized by scripts/build-photos.mjs
    <img
      src={url(photo.widths[photo.widths.length - 1])}
      srcSet={photo.widths.map((width) => `${url(width)} ${width}w`).join(", ")}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
