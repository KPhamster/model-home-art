/**
 * Getting large photos through the site's forms.
 *
 * A form's photos are emailed to the shop as attachments, and the host (Vercel) refuses any
 * submission over 4.5 MB. A phone photo is often 5 to 15 MB. So before a photo is added to a
 * form it is resized in the visitor's own browser to fit its share of that limit: fewer
 * pixels, saved again as a JPEG. A photo that is already small enough is left untouched.
 */

/** The largest photo a visitor may pick, before any resizing. */
export const MAX_PHOTO_MB = 20;
export const MAX_PHOTO_BYTES = MAX_PHOTO_MB * 1024 * 1024;

/** What one submission's photos may add up to once resized: the host's 4.5 MB, less room for the rest of the form. */
export const MAX_SEND_BYTES = 4 * 1024 * 1024;

// Tried in order until the photo fits: longest side in pixels, then JPEG quality.
const STEPS = [
  [2400, 0.82],
  [2000, 0.8],
  [1600, 0.78],
  [1280, 0.74],
  [1024, 0.7],
] as const;

/**
 * Returns the photo small enough to fit `budgetBytes`, resizing it if need be. A file the
 * browser cannot open as a picture (HEIC outside Safari, for one) comes back unchanged, as
 * does a GIF or SVG, which resizing would spoil; the caller checks the total afterwards.
 */
export async function shrinkPhoto(file: File, budgetBytes: number): Promise<File> {
  if (file.size <= budgetBytes) return file;
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return file;

  const url = URL.createObjectURL(file);
  try {
    // An <img> is drawn the right way up whatever way the camera was held; its sizes account for that too.
    const image = new Image();
    image.src = url;
    await image.decode();
    const longest = Math.max(image.naturalWidth, image.naturalHeight);

    let smallest: Blob | null = null;
    for (const [side, quality] of STEPS) {
      const scale = Math.min(1, side / longest);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      if (!context) return file;
      // A JPEG has no transparency: see-through parts of a PNG become white, not black.
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
      if (!blob) return file;
      smallest = blob;
      if (blob.size <= budgetBytes) break;
    }
    if (!smallest || smallest.size >= file.size) return file;
    return new File([smallest], `${file.name.replace(/\.[^.]*$/, "")}.jpg`, { type: "image/jpeg", lastModified: file.lastModified });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Resizes each photo to its share of what one submission may carry. `slots` is how many
 * photos the form accepts, so a full set always fits.
 */
export function shrinkPhotos(files: File[], slots: number): Promise<File[]> {
  const budget = Math.floor(MAX_SEND_BYTES / slots);
  return Promise.all(files.map((file) => shrinkPhoto(file, budget)));
}
