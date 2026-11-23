"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { heroBaseFrame, heroFrameWidths, heroOverlayFrames } from "./hero-frames";
import styles from "./hero-section.module.css";

/** How many times the frame changes each second. */
const SWAPS_PER_SECOND = 1;
const FRAME_COUNT = heroOverlayFrames.length + 1;
/**
 * Tells the browser which file size to fetch. Desktop is the real drawn width. Phones and
 * tablets are deliberately under-reported (the picture is drawn at 104vw / 44rem) so that
 * high-density screens take the 768 and 1280 px sets instead of the largest one: the whole
 * loop then costs under 1 MB on a phone, and at that size the softer picture still looks
 * sharp while a frame is held for a second.
 */
const SIZES = "(min-width: 1024px) min(60vw, 88vh), (min-width: 640px) 36rem, 59vw";

const srcSet = (file: string, ext: "avif" | "webp") =>
  heroFrameWidths.map((w) => `/hero/frames/${file}-${w}.${ext} ${w}w`).join(", ");

// Visitors who ask for less motion, or to save data, get a still picture until they press play.
const QUIET_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeToQuiet(onChange: () => void) {
  const query = window.matchMedia(QUIET_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function prefersQuiet() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia(QUIET_QUERY).matches || connection?.saveData === true;
}

/**
 * The hero artwork: one picture on a gallery wall whose frame (and, every six
 * frames, the artwork) changes with a hard cut. Frame 0 is a whole picture; the
 * other frames are cut-outs laid over it, so the wall never changes.
 */
export function HeroFrameSwap({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRefs = useRef<(HTMLImageElement | null)[]>([]);
  const frameRef = useRef(0);
  // 0 shows the base picture alone; n shows cut-out n - 1 on top of it.
  const [frame, setFrame] = useState(0);
  // null until the visitor uses the pause button; then their choice wins.
  const [pausedByVisitor, setPausedByVisitor] = useState<boolean | null>(null);
  const quiet = useSyncExternalStore(subscribeToQuiet, prefersQuiet, () => true);
  const playing = pausedByVisitor === null ? !quiet : !pausedByVisitor;
  // The cut-outs are only downloaded once the loop is going to play.
  const showOverlays = playing || frame > 0;

  useEffect(() => {
    if (!playing) return;
    let stopped = false;
    let busy = false;
    let inView = true;
    const observer = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting), { threshold: 0.1 });
    if (rootRef.current) observer.observe(rootRef.current);

    const timer = window.setInterval(async () => {
      if (busy || !inView || document.hidden) return;
      const next = (frameRef.current + 1) % FRAME_COUNT;
      if (next > 0) {
        const image = overlayRefs.current[next - 1];
        // Not downloaded yet: hold the current frame and try again on the next tick.
        if (!image || !image.complete || image.naturalWidth === 0) return;
        busy = true;
        try {
          await image.decode();
        } catch {
          return;
        } finally {
          busy = false;
        }
        if (stopped) return;
      }
      frameRef.current = next;
      setFrame(next);
    }, 1000 / SWAPS_PER_SECOND);

    return () => {
      stopped = true;
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [playing]);

  return (
    <div ref={rootRef} className={cn("relative aspect-square", className)}>
      <div className={styles.artMask}>
        <picture>
          <source type="image/avif" srcSet={srcSet(heroBaseFrame.file, "avif")} sizes={SIZES} />
          <img
            src={`/hero/frames/${heroBaseFrame.file}-1280.webp`}
            srcSet={srcSet(heroBaseFrame.file, "webp")}
            sizes={SIZES}
            width={1600}
            height={1600}
            alt="A framed painting on a gallery wall. The frame keeps changing: walnut, ornate gold, black, white, silver and more."
            fetchPriority="high"
            decoding="sync"
            className="absolute inset-0 h-full w-full"
          />
        </picture>
        {showOverlays &&
          heroOverlayFrames.map((overlay, i) => (
            <picture key={overlay.file}>
              <source type="image/avif" srcSet={srcSet(overlay.file, "avif")} sizes={SIZES} />
              <img
                ref={(node) => {
                  overlayRefs.current[i] = node;
                }}
                src={`/hero/frames/${overlay.file}-1280.webp`}
                srcSet={srcSet(overlay.file, "webp")}
                sizes={SIZES}
                alt=""
                aria-hidden="true"
                fetchPriority="low"
                decoding="sync"
                className="absolute max-w-none"
                style={{
                  left: `${overlay.left}%`,
                  top: `${overlay.top}%`,
                  width: `${overlay.width}%`,
                  height: `${overlay.height}%`,
                  visibility: frame === i + 1 ? "visible" : "hidden",
                }}
              />
            </picture>
          ))}
      </div>

      <button
        type="button"
        onClick={() => setPausedByVisitor(playing)}
        aria-label={playing ? "Pause the changing frames" : "Play the changing frames"}
        // Bottom-left, clear of the widest frames: the site's floating "Get a Quote" button sits bottom-right.
        className="absolute bottom-0 left-[11.3%] flex size-8 items-center justify-center rounded-full border border-white/20 bg-black/35 text-stone-200 backdrop-blur-sm transition-colors hover:bg-black/55 hover:text-white sm:bottom-[5%] sm:size-10 lg:left-[5%]"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
      </button>
    </div>
  );
}
