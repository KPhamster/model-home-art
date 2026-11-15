"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Camera, Palette, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { howItWorksFrames } from "./how-it-works-frames";
import styles from "./how-it-works-section.module.css";

const intro = "Getting your piece framed is easy — here's how.";

const steps = [
  {
    icon: Camera,
    title: "Send a photo + size",
    description: "Upload photos of your item and share the dimensions. Not sure? We can help you measure.",
  },
  {
    icon: Palette,
    title: "We design options",
    description: "We'll create framing options that fit your style and budget. No pressure, no surprises.",
  },
  {
    icon: Truck,
    title: "Pickup, delivery, or ship",
    description: "Pick up from our shop, schedule local delivery with installation, or we'll ship it to you.",
  },
];

/** The five layers in the picture, left to right once the frame is apart (front to back). */
const layers = ["Moulding", "Glazing", "Mat", "Artwork", "Backing"];

/*
 * The picture moves through its sequence as it travels up the screen with the rest of the
 * page. Nothing is pinned: the page scrolls normally the whole time.
 *
 * "Progress" is 0 when the picture's centre is START_AT of the way down the screen and 1
 * when it has risen to END_AT. Within that progress:
 *
 *   0          to OPEN_TO     the frame turns and its layers separate   step 2 from STEP_2_AT
 *   OPEN_TO    to CLOSE_FROM  the layers hold apart, with their names
 *   CLOSE_FROM to 1           the layers come back together             step 3
 */
const START_AT = 0.85;
const END_AT = 0.25;
const OPEN_TO = 0.42;
const CLOSE_FROM = 0.58;
const STEP_2_AT = 0.18;
const STEP_3_AT = CLOSE_FROM;
/** The layer names show once the sequence is this far apart (0 = finished frame, 1 = fully apart). */
const NAMES_FROM = 0.72;
/** How quickly the picture catches up with the scroll position, in milliseconds: lower is snappier. */
const CATCH_UP_MS = 75;

/** Where in the sequence to be for a given progress: 0 = finished frame, 1 = fully apart. */
function sequencePosition(progress: number) {
  if (progress < OPEN_TO) return progress / OPEN_TO;
  if (progress <= CLOSE_FROM) return 1;
  return 1 - (progress - CLOSE_FROM) / (1 - CLOSE_FROM);
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const frameUrl = (index: number, width: number) =>
  `/how-it-works/frames/${String(index).padStart(3, "0")}-${width}.webp`;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * "How It Works": the three steps beside a framed picture that comes apart into its layers,
 * and back together, as it scrolls past. The steps light up one after another along the way.
 * With reduced motion the picture is a still of the layers apart and every step is lit.
 */
export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pictureRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const connectorRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // The furthest step reached so far: steps up to and including it are lit.
  const [reachedStep, setReachedStep] = useState(0);
  const [apart, setApart] = useState(false);
  // The server cannot know, so its markup is the moving one (step 1 lit, layer names hidden);
  // the stylesheet already covers reduced motion until this value arrives.
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );

  const { count, widths, background } = howItWorksFrames;
  const lastFrame = count - 1;

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const picture = pictureRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!section || !picture || !canvas || !context) return;

    // Phones always take the smallest set; larger screens take the first one sharp enough.
    const drawnWidth = canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 2);
    const width =
      window.innerWidth < 640 ? widths[0] : (widths.find((w) => w >= drawnWidth * 0.8) ?? widths[widths.length - 1]);
    canvas.width = width;
    canvas.height = width;

    const images: (HTMLImageElement | undefined)[] = new Array(count);
    const ready: boolean[] = new Array(count).fill(false);
    let near = false; // the section is on screen or about to be
    let loadingStarted = false;
    let target = 0; // progress the page is at
    let current = 0; // progress the picture is showing, eased toward the target
    let drawnFrame = -1;
    let shownStep = 0;
    let shownApart = false;
    let raf = 0;
    let lastTick = 0; // time of the previous animation frame, 0 when the loop is idle

    // The frame to draw for a wanted index: that one if it has arrived, else its nearest neighbour.
    const nearestReady = (index: number) => {
      for (let distance = 0; distance <= lastFrame; distance++) {
        if (ready[index - distance]) return index - distance;
        if (ready[index + distance]) return index + distance;
      }
      return -1;
    };

    const render = () => {
      const position = sequencePosition(current);
      const frame = nearestReady(Math.round(position * lastFrame));
      if (frame >= 0 && frame !== drawnFrame) {
        context.drawImage(images[frame]!, 0, 0, width, width);
        drawnFrame = frame;
      }

      // Each connector fills as the progress moves from its step to the next one.
      const fills = [clamp01(current / STEP_2_AT), clamp01((current - STEP_2_AT) / (STEP_3_AT - STEP_2_AT))];
      fills.forEach((fill, i) => {
        const element = connectorRefs.current[i];
        if (element) element.style.transform = `scaleY(${fill})`;
      });

      const step = current < STEP_2_AT ? 0 : current < STEP_3_AT ? 1 : 2;
      if (step !== shownStep) {
        shownStep = step;
        setReachedStep(step);
      }
      const isApart = position >= NAMES_FROM;
      if (isApart !== shownApart) {
        shownApart = isApart;
        setApart(isApart);
      }
    };

    const tick = (now: number) => {
      raf = 0;
      // Ease by elapsed time, not per frame, so it feels the same at any refresh rate.
      const elapsed = lastTick ? now - lastTick : 1000 / 60;
      const gap = target - current;
      current = Math.abs(gap) < 0.0005 ? target : current + gap * (1 - Math.exp(-elapsed / CATCH_UP_MS));
      render();
      if (current !== target) {
        lastTick = now;
        raf = requestAnimationFrame(tick);
      } else {
        lastTick = 0;
      }
    };
    const requestTick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!near) return;
      const rect = picture.getBoundingClientRect();
      const centre = rect.top + rect.height / 2;
      const screen = window.innerHeight;
      target = clamp01((screen * START_AT - centre) / (screen * (START_AT - END_AT)));
      requestTick();
    };

    // Coarse to fine: every 16th still first, then the gaps, so scrolling works almost at once.
    // Visitors who ask to save data stop at every 4th.
    const loadFrames = () => {
      if (loadingStarted) return;
      loadingStarted = true;
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      const passes = connection?.saveData === true ? [16, 8, 4] : [16, 8, 4, 2, 1];
      const queued = new Set<number>();
      const queue = (index: number) => {
        if (queued.has(index)) return;
        queued.add(index);
        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          ready[index] = true;
          requestTick();
        };
        image.src = frameUrl(index, width);
        images[index] = image;
      };
      queue(0);
      queue(lastFrame);
      for (const every of passes) for (let index = 0; index <= lastFrame; index += every) queue(index);
    };

    // Start a screen early, so the stills are there by the time the picture scrolls into view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) {
          loadFrames();
          onScroll();
        }
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      for (const image of images) if (image) image.onload = null;
    };
  }, [reducedMotion, count, lastFrame, widths]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="how-it-works-title"
      className={cn(styles.section, "text-stone-50")}
      style={{ "--hiw-bg": background } as CSSProperties}
    >
      <div className={styles.inner}>
        <div className={cn(styles.grid, "container-wide")}>
          <div className={cn(styles.head, "text-center lg:text-left")}>
            {/* The same short copper rule the other sections' headings open with. */}
            <span aria-hidden="true" className="mx-auto mb-5 block h-0.5 w-10 rounded-full bg-brand lg:mx-0" />
            <h2 id="how-it-works-title" className="font-heading text-3xl font-semibold md:text-4xl">
              How It Works
            </h2>
            <p className="mt-2 text-balance text-base text-stone-300 md:text-lg lg:mt-4">{intro}</p>
          </div>

          <div className={styles.art}>
            <div ref={pictureRef} className={styles.picture}>
              {/* The still shown before the sequence loads. With reduced motion it is the
                  only picture, so it is the one with the layers apart. */}
              <picture>
                <source media={REDUCED_MOTION} srcSet={frameUrl(lastFrame, widths[0])} />
                <img
                  src={frameUrl(0, widths[0])}
                  width={widths[0]}
                  height={widths[0]}
                  alt="A walnut picture frame that comes apart into its five layers: moulding, glazing, mat, artwork and backing."
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <canvas ref={canvasRef} aria-hidden="true" />
            </div>
            {/* The alt text above already names the layers. */}
            <ol
              aria-hidden="true"
              data-on={reducedMotion || apart ? "" : undefined}
              className={cn(styles.legend, "text-center text-[0.6875rem] text-stone-300 sm:text-xs sm:tracking-wide")}
            >
              {layers.map((layer) => (
                <li key={layer}>{layer}</li>
              ))}
            </ol>
          </div>

          <ol className={styles.steps}>
            {steps.map((step, i) => {
              const reached = reducedMotion || i <= reachedStep;
              return (
                <li key={step.title} data-reached={reached ? "" : undefined} className={cn(styles.step, "group")}>
                  <span
                    className={cn(
                      styles.marker,
                      "flex items-center justify-center rounded-full border border-white/15 text-stone-400 transition-colors duration-300",
                      "group-data-[reached]:border-brand group-data-[reached]:bg-brand group-data-[reached]:text-[#151311]",
                    )}
                  >
                    <span className="text-sm font-semibold lg:hidden" aria-hidden="true">
                      {i + 1}
                    </span>
                    <step.icon className="hidden size-5 lg:block" aria-hidden="true" />
                  </span>
                  {i < steps.length - 1 && (
                    <span className={styles.connector} aria-hidden="true">
                      <span
                        ref={(node) => {
                          connectorRefs.current[i] = node;
                        }}
                        className={styles.connectorFill}
                      />
                    </span>
                  )}
                  <p className="hidden text-xs font-medium uppercase tracking-[0.14em] text-stone-400 lg:block">
                    Step {i + 1}
                  </p>
                  <h3 className="pt-0.5 font-heading text-lg font-semibold text-stone-400 transition-colors duration-300 group-data-[reached]:text-stone-50 lg:pt-0 lg:text-xl">
                    {step.title}
                  </h3>
                  <p className="pt-1 text-sm text-stone-400 transition-colors duration-300 group-data-[reached]:text-stone-300 lg:text-base">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <div aria-hidden="true" className={styles.blend} />
    </section>
  );
}
