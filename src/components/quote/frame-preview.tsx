"use client";

import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties } from "react";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { quoteFrames, quoteSampleArt, type QuoteFrame, type QuoteFrameId, type QuoteSample } from "./quote-frames";
import styles from "./frame-preview.module.css";

// How wide the sample picture is drawn at each screen width, for choosing which file to fetch.
const SAMPLE_SIZES = "(min-width: 1536px) 36rem, (min-width: 1280px) 30rem, (min-width: 1024px) 21rem, 76vw";

/** The frame shown before the visitor has chosen anything. */
export const DEFAULT_FRAME: QuoteFrameId = "walnut";

/** The frame a "Frame Style" answer brings up first. "Not sure" leaves the frame alone. */
export const FRAME_FOR_STYLE: Partial<Record<string, QuoteFrameId>> = {
  modern: "black",
  classic: "walnut",
  minimal: "natural",
  ornate: "gold",
};

const frameById = (id: QuoteFrameId): QuoteFrame => quoteFrames.find((f) => f.id === id) ?? quoteFrames[0];
const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const parseInches = (text: string) => {
  const n = Number.parseFloat(text);
  return Number.isFinite(n) && n > 0 && n <= 240 ? n : null;
};
const tidy = (n: number) => String(Math.round(n * 100) / 100);

// One address per chosen file for as long as the page is open. They are never revoked: the
// form keeps the files themselves until it is sent, so the addresses hold on to nothing extra.
const photoUrls = new WeakMap<File, string>();
function photoUrlFor(file: File) {
  let url = photoUrls.get(file);
  if (!url) {
    url = URL.createObjectURL(file);
    photoUrls.set(file, url);
  }
  return url;
}

/** Sizes, in inches, of everything the preview draws. */
function measure(width: string, height: string, photoRatio: number | null, sample: QuoteSample, matting: string, mouldingInches: number) {
  const typedW = parseInches(width);
  const typedH = parseInches(height);
  const typed = typedW !== null && typedH !== null;
  // What the visitor typed. Failing that, the shape of their photo with a 20 in long side;
  // failing that, the sample picture at the size such a piece usually is.
  const ratio = clamp(typed ? typedW / typedH : (photoRatio ?? sample.widthInches / sample.heightInches), 0.25, 4);
  const long = typed ? Math.max(typedW, typedH) : photoRatio !== null ? 20 : Math.max(sample.widthInches, sample.heightInches);
  const w = ratio >= 1 ? long : long * ratio;
  const h = ratio >= 1 ? long / ratio : long;
  const short = Math.min(w, h);

  // Mats and mouldings come in real widths, so a small picture gets a visibly heavier surround.
  const matted = matting === "single" || matting === "double" || matting === "not-sure";
  const mat = matted ? clamp(short * 0.14, 1.5, 4) : 0;
  const reveal = matting === "double" ? clamp(short * 0.02, 0.25, 0.5) : 0;
  const moulding = Math.min(mouldingInches, short * 0.3);
  const surround = 2 * (mat + reveal + moulding);
  return { typed, typedW, typedH, mat, reveal, moulding, totalW: w + surround, totalH: h + surround };
}

const MAT_WORDS: Record<string, string> = {
  none: "no mat",
  single: "a single mat",
  double: "a double mat",
  "not-sure": "a single mat",
};
/** How strong a reflection each glass answer is drawn with: plain glass 1, museum glass none. */
export const GLARE: Partial<Record<string, number>> = { standard: 1, upgraded: 0.3 };

type FramePreviewProps = {
  /** The picture to frame while the visitor has not added a photo; it follows the kind of piece they chose. */
  sample?: QuoteSample;
  /** Every photo the visitor has added, and the one to draw (null before they add any). */
  photos: File[];
  photo: File | null;
  onPhotoChange: (photo: File) => void;
  /** Width and height of the item in inches, as typed. */
  width: string;
  height: string;
  /** The form's matting and glass answers ("" until chosen). */
  matting: string;
  protection: string;
  frameId: QuoteFrameId;
  onFrameChange: (id: QuoteFrameId) => void;
  /** Lets the visitor add a photo from the preview itself; uses the form's own upload checks. */
  onAddPhoto: (event: ChangeEvent<HTMLInputElement>) => void;
  /**
   * Below the "lg" breakpoint, use a shorter wall and leave out the caption. For when the
   * preview is pinned above the form and the form needs the rest of the screen.
   */
  compactOnPhones?: boolean;
  className?: string;
};

/**
 * Shows the visitor's own photo (or a sample picture) on a wall, in a real frame, and redraws
 * it as they answer the form: the frame they pick, the mat, the glass and the size. Below the
 * "lg" breakpoint it drops its second caption line and small print, to leave a phone screen room for the form.
 */
export function FramePreview({
  sample = quoteSampleArt,
  photos,
  photo,
  onPhotoChange,
  width,
  height,
  matting,
  protection,
  frameId,
  onFrameChange,
  onAddPhoto,
  compactOnPhones,
  className,
}: FramePreviewProps) {
  // The frame on screen. It follows frameId once that frame's photo has downloaded, so the
  // picture never sits bare while one loads.
  const [shownId, setShownId] = useState(frameId);
  // The sample on screen, which likewise waits for the next one to download before changing,
  // so the wall never shows the old picture squeezed into the new one's shape.
  const [shownSample, setShownSample] = useState(sample);
  const [loaded, setLoaded] = useState<{ url: string; ratio: number } | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const preloaded = useRef(false);

  useEffect(() => {
    if (frameId === shownId) return;
    let stale = false;
    const image = new Image();
    image.src = frameById(frameId).image;
    const show = () => {
      if (!stale) setShownId(frameId);
    };
    image.decode().then(show, show);
    return () => {
      stale = true;
    };
  }, [frameId, shownId]);

  useEffect(() => {
    if (sample === shownSample) return;
    let stale = false;
    const image = new Image();
    image.sizes = SAMPLE_SIZES;
    image.srcset = sample.srcSet;
    image.src = sample.src;
    const show = () => {
      if (!stale) setShownSample(sample);
    };
    image.decode().then(show, show);
    return () => {
      stale = true;
    };
  }, [sample, shownSample]);

  // The other frames are fetched the first time the visitor reaches for the picker.
  const preloadFrames = () => {
    if (preloaded.current) return;
    preloaded.current = true;
    for (const frame of quoteFrames) new Image().src = frame.image;
  };

  const url = photo ? photoUrlFor(photo) : null;
  // Some photo types (HEIC outside Safari, for one) cannot be drawn by the browser.
  const photoShown = url !== null && url !== failedUrl;
  const photoRatio = photoShown && loaded?.url === url ? loaded.ratio : null;

  const frame = frameById(shownId);
  const size = measure(width, height, photoRatio, shownSample, matting, frame.inches);
  const [top, right, bottom, left] = frame.slice;
  const frameStyle = {
    "--total-w": size.totalW,
    "--total-h": size.totalH,
    "--moulding": size.moulding,
    "--mat": size.mat,
    "--reveal": size.reveal,
    "--glare": GLARE[protection] ?? 0,
    borderImageSource: `url(${frame.image})`,
    borderImageSlice: `${top}% ${right}% ${bottom}% ${left}%`,
  } as CSSProperties;

  const picture = photoShown ? "Your photo" : "Sample picture";
  const matWords = MAT_WORDS[matting];
  const sizeWords = size.typed ? `${tidy(size.typedW!)} × ${tidy(size.typedH!)} in` : null;
  const article = /^[aeiou]/i.test(frame.label) ? "an" : "a";
  const summary = `${picture} in ${article} ${frame.label.toLowerCase()} frame${matWords ? ` with ${matWords}` : ""}`;

  return (
    <div className={cn("rounded-2xl border border-border bg-white p-3 shadow-sm lg:p-4", className)}>
      {/* No visible heading: every pixel of height goes to the picture. */}
      <h2 className="sr-only">Live preview of your framed picture</h2>

      <div className="relative">
        <div
          role="img"
          aria-label={`Preview: ${summary}${sizeWords ? `, ${sizeWords}` : ""}.`}
          // Phones: a square wall, or a shorter strip when pinned. Desktop: a tall wall, as tall
          // as still lets the whole panel fit on screen under the site's header (18.5rem is the
          // header, the gap under it, and everything in the panel but the wall).
          className={cn(
            styles.stage,
            "w-full rounded-xl lg:aspect-[4/5] lg:max-h-[calc(100svh-18.5rem)]",
            compactOnPhones ? "max-lg:h-52" : "max-lg:aspect-square max-lg:max-h-[26rem]",
          )}
        >
          <div className={styles.frame} style={frameStyle}>
            <div className={styles.opening} data-mat={size.reveal > 0 ? "double" : size.mat > 0 ? "single" : "none"}>
              <div className={styles.reveal}>
                <div className={styles.art}>
                  {photoShown ? (
                    // eslint-disable-next-line @next/next/no-img-element -- a local file the visitor just chose
                    <img
                      key={url}
                      src={url}
                      alt=""
                      onLoad={(e) => setLoaded({ url, ratio: e.currentTarget.naturalWidth / e.currentTarget.naturalHeight })}
                      onError={() => setFailedUrl(url)}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element -- pre-sized files, see scripts/build-quote-frames.mjs
                    <img key={shownSample.src} src={shownSample.src} srcSet={shownSample.srcSet} sizes={SAMPLE_SIZES} alt="" decoding="async" />
                  )}
                </div>
              </div>
              <div className={styles.lip} />
              <div className={styles.glass} />
            </div>
          </div>
        </div>

        {!photo && (
          <label className="absolute bottom-2 right-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-stone-800 shadow-sm backdrop-blur-sm transition-colors hover:bg-white focus-within:ring-2 focus-within:ring-primary">
            <ImagePlus className="size-3.5" aria-hidden="true" />
            Use your photo
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                onAddPhoto(e);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>

      <div
        role="group"
        aria-label="Frame to preview"
        className="mt-2 flex flex-wrap gap-1.5 lg:mt-3"
        onPointerEnter={preloadFrames}
        onTouchStart={preloadFrames}
        onFocus={preloadFrames}
      >
        {quoteFrames.map((option) => (
          <button
            key={option.id}
            type="button"
            title={option.label}
            aria-label={`${option.label} frame`}
            aria-pressed={option.id === frameId}
            onClick={() => onFrameChange(option.id)}
            className={cn(
              "size-9 overflow-hidden rounded-md outline-offset-2 transition-shadow focus-visible:outline-2 focus-visible:outline-primary lg:size-11",
              option.id === frameId ? "ring-2 ring-primary ring-offset-2" : "ring-1 ring-border hover:ring-primary/60",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- 160 px file, see scripts/build-quote-frames.mjs */}
            <img src={option.corner} alt="" width={160} height={160} className="size-full object-cover" />
          </button>
        ))}
      </div>

      {/* Pinned on a phone, the caption goes (the wall takes its height) unless it has something
          the visitor needs: the photo picker, or the note about a photo that cannot be drawn. */}
      <div
        className={cn(
          "mt-2 flex items-start justify-between gap-3 text-sm lg:mt-3",
          compactOnPhones && photos.length < 2 && !(photo && !photoShown) && "max-lg:hidden",
        )}
      >
        <div className="min-w-0">
          <p className="font-medium text-foreground">
            {frame.label} frame{matWords ? ` with ${matWords}` : ""}
          </p>
          <p className="hidden text-muted-foreground lg:block">
            {picture}
            {sizeWords ? `, ${sizeWords}` : ""}
          </p>
          {photo && !photoShown && (
            <p className="text-muted-foreground">This photo type can&apos;t be shown here, but it will still be sent.</p>
          )}
        </div>

        {/* With more than one photo, the visitor picks which one is framed. */}
        {photos.length > 1 && (
          <div role="group" aria-label="Photo to preview" className="flex shrink-0 gap-1.5">
            {photos.map((option, i) => (
              <button
                key={photoUrlFor(option)}
                type="button"
                aria-label={`Show photo ${i + 1} of ${photos.length}`}
                aria-pressed={option === photo}
                onClick={() => onPhotoChange(option)}
                className={cn(
                  "relative size-9 overflow-hidden rounded-md bg-sand text-xs font-medium text-stone-600 outline-offset-2 transition-shadow focus-visible:outline-2 focus-visible:outline-primary",
                  option === photo ? "ring-2 ring-primary ring-offset-2" : "ring-1 ring-border hover:ring-primary/60",
                )}
              >
                {/* The photo's number, seen only if the browser cannot draw the photo itself. */}
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                  {i + 1}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element -- a local file the visitor just chose */}
                <img
                  src={photoUrlFor(option)}
                  alt=""
                  className="relative size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="mt-2 hidden text-xs text-muted-foreground lg:block">
        For illustration only. We confirm the exact frame, mat and size in your quote.
      </p>
    </div>
  );
}

type FrameCornerProps = {
  frameId: QuoteFrameId;
  /** A matting answer from the form: "none", "single" or "double". */
  matting?: string;
  /** How strong a reflection to draw on the glass, 0 to 1. */
  glare?: number;
  /** The photo the preview is showing; the sample picture is drawn without one. */
  photo: File | null;
  /** The sample picture the preview is showing. */
  sample?: QuoteSample;
  /** How many inches of the framed picture the tile's width shows. Smaller is closer. */
  span?: number;
  className?: string;
};

/**
 * A close-up of the top-left corner of a framed picture, for the form's option tiles: the
 * same frame, mat, glass and picture as the preview, enlarged. Purely decorative; the tile's
 * label says what the option is. It needs a size from its class, an aspect ratio for one.
 */
export function FrameCorner({ frameId, matting = "none", glare = 0, photo, sample = quoteSampleArt, span = 8, className }: FrameCornerProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const url = photo ? photoUrlFor(photo) : null;
  const photoShown = url !== null && url !== failedUrl;

  const frame = frameById(frameId);
  // Always a 16 x 20 in picture, so every tile is drawn at the same scale.
  const size = measure("16", "20", null, sample, matting, frame.inches);
  const [top, right, bottom, left] = frame.slice;
  const frameStyle = {
    "--u": `calc(100cqw / ${span})`,
    "--total-w": size.totalW,
    "--total-h": size.totalH,
    "--moulding": size.moulding,
    "--mat": size.mat,
    "--reveal": size.reveal,
    "--glare": glare,
    borderImageSource: `url(${frame.image})`,
    borderImageSlice: `${top}% ${right}% ${bottom}% ${left}%`,
  } as CSSProperties;

  // Spans, not divs: the tiles are labels, which may only hold inline elements.
  return (
    <span aria-hidden="true" className={cn(styles.corner, "block", className)}>
      <span className={styles.frame} style={frameStyle}>
        <span className={cn(styles.opening, "block")} data-mat={size.reveal > 0 ? "double" : size.mat > 0 ? "single" : "none"}>
          <span className={cn(styles.reveal, "block")}>
            <span className={cn(styles.art, "block")}>
              {photoShown ? (
                // eslint-disable-next-line @next/next/no-img-element -- a local file the visitor just chose
                <img key={url} src={url} alt="" onError={() => setFailedUrl(url)} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- pre-sized files, see scripts/build-quote-frames.mjs
                <img key={sample.src} src={sample.src} srcSet={sample.srcSet} sizes="20rem" alt="" decoding="async" />
              )}
            </span>
          </span>
          <span className={styles.lip} />
          <span className={styles.glass} />
        </span>
      </span>
    </span>
  );
}
