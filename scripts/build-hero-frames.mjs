// Exports the homepage hero frames for the web.
//
// Source: 18 stills (2048 x 2048 PNG) of three artworks in six frame styles each,
// all hanging on the same gallery wall. They live outside git in
//   design/hero-options/frame-swap-wall/<artwork>/<style>.png
//
// Output:
//   public/hero/frames/00-<artwork>-<style>-<width>.{avif,webp}   the first frame, whole picture
//   public/hero/frames/NN-<artwork>-<style>-<width>.{avif,webp}   every other frame, cut out
//   src/components/home/hero-frames.ts                             the list the hero component reads
//
// Why frames 1..17 are cut-outs: the stills were generated one by one, so the plaster
// wall differs very slightly in each. Shown one after another, the wall would shimmer.
// Instead the page shows ONE wall (the first frame) and lays each other frame on top of
// it as a cut-out with soft, transparent edges, so only the frame and artwork change.
//
// Run with:  npm run hero:frames
// Uses sharp, which is installed as part of Next.js.

import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stillsDir = path.join(root, "design/hero-options/frame-swap-wall");
const outDir = path.join(root, "public/hero/frames");
const manifestPath = path.join(root, "src/components/home/hero-frames.ts");

const SIZE = 2048; // stills are square
const WIDTHS = [768, 1280, 1600]; // width of the whole picture each export is made for
const AVIF = { quality: 58, effort: 5 };
const WEBP = { quality: 80, effort: 5, alphaQuality: 90 };

// Order of the loop: each artwork opens in the walnut frame, then runs through five more.
const SETS = [
  ["coast", ["walnut", "gold", "black-gold", "driftwood", "burl", "silver"]],
  ["orange", ["walnut", "white", "black", "terracotta", "maple", "barnwood"]],
  ["portrait", ["walnut", "aluminium", "mahogany", "champagne", "charcoal", "copper"]],
];
// The still whose wall every frame shares.
const WALL_SOURCE = ["orange", "walnut"];

// Area a frame and its shadow can occupy: [left, top, right, bottom] in still pixels.
// "std" fits frames the size of the walnut one; "wide" fits the widest mouldings.
const BOXES = {
  std: [339, 209, 1748, 1914],
  wide: [266, 148, 1826, 1974],
};
const FEATHER = 22; // blur radius of the cut-out's soft edge
const PAD = 64; // extra pixels kept around a box so the soft edge is not clipped

const stillPath = (art, style) => path.join(stillsDir, art, `${style}.png`);
const loadRGB = async (file) => {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.width !== SIZE || info.height !== SIZE) throw new Error(`${file}: expected ${SIZE}x${SIZE}`);
  return data;
};
const grey = (d, i) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
// Mean absolute brightness difference between two stills over a rectangle.
const difference = (a, b, x0, y0, x1, y1) => {
  let sum = 0;
  let n = 0;
  for (let y = y0; y < y1; y += 2)
    for (let x = x0; x < x1; x += 2) {
      const i = (y * SIZE + x) * 3;
      sum += Math.abs(grey(a, i) - grey(b, i));
      n++;
    }
  return sum / n;
};

async function softMask([l, t, r, b]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}"><rect width="100%" height="100%" fill="black"/><rect x="${l}" y="${t}" width="${r - l}" height="${b - t}" rx="30" fill="white"/></svg>`;
  return sharp(Buffer.from(svg)).greyscale().blur(FEATHER).raw().toBuffer();
}

async function exportImage(pipeline, name, scaledWidth, sizes) {
  for (const [ext, encode] of [
    ["avif", (s) => s.avif(AVIF)],
    ["webp", (s) => s.webp(WEBP)],
  ]) {
    const buffer = await encode(pipeline.clone().resize({ width: scaledWidth, kernel: "lanczos3" })).toBuffer();
    await writeFile(path.join(outDir, `${name}.${ext}`), buffer);
    sizes[ext] = (sizes[ext] ?? 0) + buffer.length;
  }
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const wall = await loadRGB(stillPath(...WALL_SOURCE));
const masks = { std: await softMask(BOXES.std), wide: await softMask(BOXES.wide) };
const totals = Object.fromEntries(WIDTHS.map((w) => [w, {}]));
const overlays = [];
let base = null;
let index = 0;

for (const [art, styles] of SETS) {
  const walnut = await loadRGB(stillPath(art, "walnut"));
  for (const style of styles) {
    const still = await loadRGB(stillPath(art, style));
    // A moulding is "wide" when it covers wall that is bare just outside the walnut frame.
    const spill = Math.max(
      difference(still, walnut, 372, 600, 418, 1400),
      difference(still, walnut, 1630, 600, 1676, 1400),
      difference(still, walnut, 700, 228, 1350, 268),
    );
    const kind = spill > 14 ? "wide" : "std";
    const mask = masks[kind];
    const file = `${String(index).padStart(2, "0")}-${art}-${style}`;

    if (index === 0) {
      // First frame: the whole picture, on the shared wall.
      const out = Buffer.alloc(still.length);
      for (let p = 0, i = 0; p < SIZE * SIZE; p++, i += 3) {
        const m = mask[p] / 255;
        out[i] = Math.round(still[i] * m + wall[i] * (1 - m));
        out[i + 1] = Math.round(still[i + 1] * m + wall[i + 1] * (1 - m));
        out[i + 2] = Math.round(still[i + 2] * m + wall[i + 2] * (1 - m));
      }
      const pipeline = sharp(out, { raw: { width: SIZE, height: SIZE, channels: 3 } });
      for (const w of WIDTHS) await exportImage(pipeline, `${file}-${w}`, w, totals[w]);
      base = { file, artwork: art, style };
    } else {
      // Other frames: a cut-out of the frame area whose edges fade to transparent.
      const [l, t, r, b] = BOXES[kind];
      const x0 = Math.max(0, l - PAD);
      const y0 = Math.max(0, t - PAD);
      const x1 = Math.min(SIZE, r + PAD);
      const y1 = Math.min(SIZE, b + PAD);
      const cw = x1 - x0;
      const ch = y1 - y0;
      const rgba = Buffer.alloc(cw * ch * 4);
      for (let y = 0; y < ch; y++)
        for (let x = 0; x < cw; x++) {
          const src = (y + y0) * SIZE + (x + x0);
          const dst = (y * cw + x) * 4;
          rgba[dst] = still[src * 3];
          rgba[dst + 1] = still[src * 3 + 1];
          rgba[dst + 2] = still[src * 3 + 2];
          rgba[dst + 3] = mask[src];
        }
      const pipeline = sharp(rgba, { raw: { width: cw, height: ch, channels: 4 } });
      for (const w of WIDTHS) await exportImage(pipeline, `${file}-${w}`, Math.round((cw * w) / SIZE), totals[w]);
      const pct = (v) => Number(((v / SIZE) * 100).toFixed(3));
      overlays.push({ file, artwork: art, style, left: pct(x0), top: pct(y0), width: pct(cw), height: pct(ch) });
    }
    console.log(`${file.padEnd(24)} ${index === 0 ? "base" : kind}`);
    index++;
  }
}

const manifest = `// Generated by scripts/build-hero-frames.mjs. Do not edit by hand; run "npm run hero:frames".

/** Widths (in pixels of the whole square picture) each frame is exported at. */
export const heroFrameWidths = ${JSON.stringify(WIDTHS)} as const;

/** The first frame: the whole picture, including the wall every other frame shares. */
export const heroBaseFrame = ${JSON.stringify(base)} as const;

/**
 * Every other frame, in loop order. Each is a cut-out laid over the first frame;
 * left/top/width/height place it, as percentages of the square picture.
 */
export const heroOverlayFrames = [
${overlays.map((o) => `  ${JSON.stringify(o)},`).join("\n")}
] as const;
`;
await writeFile(manifestPath, manifest);

console.log("\nTotal download for all 18 frames:");
for (const w of WIDTHS)
  console.log(`  ${String(w).padStart(4)} px  avif ${(totals[w].avif / 1048576).toFixed(2)} MB   webp ${(totals[w].webp / 1048576).toFixed(2)} MB`);
